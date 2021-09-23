import createError from "http-errors"
import mongoose from "mongoose"
import PhotoModel from "./model"
import { IPhoto } from "src/typings/photos"
import { IUserDocument } from "src/typings/users"
import { TController } from "../../typings/controllers"

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
  const textFields = req.body
  const photosArr = photos.reduce((acc: IPhoto[], curr, idx) => {
    return [
      ...acc,
      {
        url: curr.path,
        userId: user._id,
        lat: textFields.lat[idx],
        lng: textFields.lng[idx],
        isPrivate: textFields.isPrivate[idx] ? true : false,
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
