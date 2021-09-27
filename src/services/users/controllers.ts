import { TController } from "src/typings/controllers"
import createError from "http-errors"
import UserModel from "./model"
import { IUserDocument } from "src/typings/users"

export const getMe: TController = async (req, res, next) => {
  res.json(req.user)
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
