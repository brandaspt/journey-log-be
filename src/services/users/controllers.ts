import { TController } from "src/typings/controllers"
import createError from "http-errors"
import UserModel from "./model"

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
