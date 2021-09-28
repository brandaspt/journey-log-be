import createError from "http-errors"
import { TController } from "src/typings/controllers"
import { IUserDocument } from "src/typings/users"
import PostModel from "./model"
import PhotoModel from "../photos/model"
import { IPhoto } from "src/typings/photos"
import { IPost } from "src/typings/posts"

export const getPostById: TController = async (req, res, next) => {
  const postId = req.params.postId
  try {
    const post = await PostModel.findById(postId)
      .populate({ path: "photos", select: "_id url" })
      .populate({ path: "userId", select: "avatar name surname" })
    if (!post) return next(createError(404, "Post not found"))
    res.json(post)
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
      isPrivate: textFields.isPrivate ? true : false,
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
