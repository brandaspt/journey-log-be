import createError from "http-errors"
import { TController } from "src/typings/controllers"
import { IUserDocument } from "src/typings/users"
import PostModel from "./model"
import PhotoModel from "../photos/model"
import { IPhoto } from "src/typings/photos"
import { IPost } from "src/typings/posts"
import { deleteFromCloudinary } from "../../settings/tools"

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
      cloudinaryPublicId: photos[i].filename,
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

export const addPhotos: TController = async (req, res, next) => {
  const user = req.user as IUserDocument
  const userId = user._id
  const postId = req.params.postId

  try {
    const post = await PostModel.findOne({ _id: postId, userId })
    if (!post) return next(createError(404, "Post not found"))

    const photos = req.files as Express.Multer.File[]
    const newPhotosArr: IPhoto[] = []
    for (let i = 0; i < photos?.length!; i++) {
      const newPhoto: IPhoto = {
        lat: post.lat,
        lng: post.lng,
        postId,
        userId,
        url: photos[i].path,
        cloudinaryPublicId: photos[i].filename,
        isPrivate: post.isPrivate,
      }
      newPhotosArr.push(newPhoto)
    }
    const savedPhotos = await PhotoModel.create(newPhotosArr)
    const photoIds = savedPhotos.map(photo => photo._id)
    post.photos = [...post.photos, ...photoIds]
    await post.save()
    res.json(post)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const editPost: TController = async (req, res, next) => {
  const user = req.user as IUserDocument
  const userId = user._id
  const postId = req.params.postId

  try {
    const updatedPost = await PostModel.findOneAndUpdate({ userId, _id: postId }, req.body)
    res.json(updatedPost)
  } catch (error) {
    next(createError(400, error as Error))
  }
}

export const deletePost: TController = async (req, res, next) => {
  const user = req.user as IUserDocument
  const userId = user._id
  const postId = req.params.postId

  try {
    const post = await PostModel.findOneAndDelete({ userId, _id: postId })
    if (!post) return next(createError(404, "Post not found"))
    res.sendStatus(200)
  } catch (error) {
    next(createError(500, error as Error))
  }
}
