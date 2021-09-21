import createError from "http-errors"
import { TController } from "src/typings/controllers"
import { IUserDocument } from "src/typings/users"
import PostModel from "./model"
import PhotoModel from "../photos/model"
import { IPhoto } from "src/typings/photos"
import { IPost } from "src/typings/posts"
import mongoose from "mongoose"

export const getMyPosts: TController = async (req, res, next) => {
  const me = req.user as IUserDocument
  try {
    const myPosts = await PostModel.find({ userId: me._id })
      .populate({ path: "photos", select: "_id url" })
      .populate({ path: "userId", select: "avatar name surname" })
    res.json(myPosts)
  } catch (error) {
    next(createError(500, error as Error))
  }
}
export const getUserPublicPosts: TController = async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId)

  try {
    const posts = await PostModel.find({ userId, isPrivate: false })
      .populate({ path: "photos", select: "_id url" })
      .populate({ path: "userId", select: "avatar name surname" })
    res.json(posts)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const newPost: TController = async (req, res, next) => {
  const user = req.user as IUserDocument
  const photos = req.files as Express.Multer.File[]
  const textFields: IPost = req.body
  const newPost: IPost = {
    title: textFields.title,
    lat: textFields.lat,
    lng: textFields.lng,
    userId: user._id,
    description: textFields.description,
    isPrivate: textFields.isPrivate ? true : false,
    photos: [],
  }
  const createdPost = new PostModel(newPost)
  const newPhotosArr: IPhoto[] = []
  for (let i = 0; i < photos?.length!; i++) {
    const newPhoto: IPhoto = {
      lat: textFields.lat,
      lng: textFields.lng,
      postId: createdPost._id,
      userId: user._id,
      url: photos[i].path,
    }
    newPhotosArr.push(newPhoto)
  }
  try {
    const savedPhotos = await PhotoModel.create(newPhotosArr)
    const photoIds = savedPhotos.map(photo => photo._id)
    createdPost.photos = photoIds
    const savedPost = await createdPost.save()
    res.status(201).json(savedPost)
  } catch (error) {
    next(createError(400, error as Error))
  }
}
