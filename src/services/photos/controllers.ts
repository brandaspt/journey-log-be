import createError from "http-errors"
import mongoose from "mongoose"
import PhotoModel from "./model"
import PostModel from "../posts/model"
import { IPhoto } from "src/typings/photos"
import { IUserDocument } from "src/typings/users"
import { TController } from "../../typings/controllers"
import { deleteFromCloudinary } from "../../settings/tools"
import { IPostDocument } from "src/typings/posts"

export const getMyPhotos: TController = async (req, res, next) => {
  const me = req.user as IUserDocument
  try {
    const myPhotos = await PhotoModel.find({ userId: me._id, postId: undefined }).populate({
      path: "userId",
      select: "avatar name surname",
    })
    res.json(myPhotos)
  } catch (error) {
    next(createError(500, error as Error))
  }
}
export const getUserPublicPhotos: TController = async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId)
  try {
    const photos = await PhotoModel.find({ userId, isPrivate: false, postId: undefined }).populate({
      path: "userId",
      select: "avatar name surname",
    })
    res.json(photos)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const uploadPhotos: TController = async (req, res, next) => {
  const user = req.user as IUserDocument
  const photos = req.files as Express.Multer.File[]
  console.log(photos[0])
  const textFields = req.body
  const photosArr = photos.reduce((acc: IPhoto[], curr, idx) => {
    return [
      ...acc,
      {
        url: curr.path,
        cloudinaryPublicId: curr.filename,
        userId: user._id,
        lat: photos.length === 1 ? textFields.lat : textFields.lat[idx],
        lng: photos.length === 1 ? textFields.lng : textFields.lng[idx],
        isPrivate: photos.length === 1 ? (textFields.isPrivate ? true : false) : textFields.isPrivate[idx] ? true : false,
      },
    ]
  }, [])
  try {
    const savedPhotos = await PhotoModel.create(photosArr)
    res.status(201).json(savedPhotos)
  } catch (error) {
    next(createError(400, error as Error))
  }
}

export const deletePhoto: TController = async (req, res, next) => {
  const me = req.user as IUserDocument
  const photoId = req.params.photoId
  try {
    const deletedPhoto = await PhotoModel.findOneAndDelete({ userId: me._id, _id: photoId }).populate("postId")
    if (!deletedPhoto) return next(createError(404, "Photo not found"))
    if (!deletedPhoto.postId) res.json({ message: "Deleted standalone photo ", photoId })
    else {
      const post = deletedPhoto.postId as IPostDocument
      const postId = post._id
      if (post.photos.length === 1) {
        await PostModel.findByIdAndDelete(postId)
        res.json({ message: "Deleted photo and post", photoId, postId })
      } else {
        await PostModel.findByIdAndUpdate(postId, { $pull: { photos: photoId } })
        res.json({ message: "Deleted photo and updated post", photoId, postId })
      }
    }
  } catch (error) {
    next(createError(500, error as Error))
  }
}
