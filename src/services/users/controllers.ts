import createError from "http-errors"
import mongoose from "mongoose"
import UserModel from "./model"
import PostModel from "../posts/model"
import PhotoModel from "../photos/model"
import { TController } from "src/typings/controllers"
import { IUserDocument } from "src/typings/users"

export const getMe: TController = async (req, res, next) => {
  res.json(req.user)
}
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
export const getUserPublicInfo: TController = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const publicProfile = await UserModel.findById(userId, "name surname avatar createdAt")
    if (!publicProfile) return next(createError(404, "User not found."))
    const publicPhotos = await PhotoModel.find({ userId, isPrivate: false, postId: undefined }).populate({
      path: "userId",
      select: "avatar",
    })
    const publicPosts = await PostModel.find({ userId, isPrivate: false })
      .populate({ path: "photos", select: "url" })
      .populate({
        path: "userId",
        select: "avatar",
      })
      .populate({ path: "comments.userId", select: "avatar name surname" })
    res.json({ publicProfile, publicPosts, publicPhotos })
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const searchUsers: TController = async (req, res, next) => {
  const query = req.query.q as string
  const regex = new RegExp(query, "i")
  try {
    const users = await UserModel.find({
      $or: [{ name: { $regex: regex } }, { surname: { $regex: regex } }, { email: { $regex: regex } }],
    })
    res.json(users)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const toggleFollowUser: TController = async (req, res, next) => {
  const me = req.user as IUserDocument
  const myId = me._id
  const userToFollowId = req.body.userId

  try {
    const followingUser = await UserModel.findOneAndUpdate(
      {
        _id: userToFollowId,
        followers: { $not: { $elemMatch: { $eq: myId } } },
      },
      {
        $push: { followers: myId },
      }
    )
    if (followingUser) {
      await me.updateOne({ $push: { following: userToFollowId } })
    } else {
      const unfollowingUser = await UserModel.findOneAndUpdate(
        {
          _id: userToFollowId,
          followers: myId,
        },
        {
          $pull: { followers: myId },
        }
      )
      if (!unfollowingUser) return next(createError(404, "User not found"))
      await me.updateOne({ $pull: { following: userToFollowId } })
    }
    res.sendStatus(200)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const emailExists: TController = async (req, res, next) => {
  const { email } = req.body
  try {
    const user = await UserModel.findOne({ email })
    if (user) res.json(true)
    else res.json(false)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const updateProfile: TController = async (req, res, next) => {
  const me = req.user as IUserDocument
  let avatar = me.avatar
  if (me.avatar?.includes("ui-avatars.com/api")) {
    if (req.body.name || req.body.surname) {
      avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    }
  }
  try {
    const updated = await me.updateOne({ ...req.body, avatar })
    res.json(updated)
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const deleteUser: TController = async (req, res, next) => {
  const me = req.user as IUserDocument
  const myId = me._id

  try {
    const myPosts = await PostModel.find({ userId: myId })
    const deletedPosts = await Promise.all(myPosts.map(post => PostModel.findByIdAndDelete(post._id)))
    const myPhotos = await PhotoModel.find({ userId: myId })
    const deletedPhotos = await Promise.all(myPhotos.map(photo => PhotoModel.findByIdAndDelete(photo._id)))
    const deletedUser = await UserModel.findByIdAndDelete(myId)
    await UserModel.updateMany({ followers: myId }, { $pull: { followers: myId } })
    await UserModel.updateMany({ following: myId }, { $pull: { following: myId } })

    res.json({ deletedPosts, deletedPhotos, deletedUser })
  } catch (error) {
    next(createError(500, error as Error))
  }
}
