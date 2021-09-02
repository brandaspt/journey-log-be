// Packages
import createError from "http-errors"

// Model
import UserModel from "./model.js"

import { getTokens } from "../auth/tools.js"

export const registerUser = async (req, res, next) => {
  try {
    res.status(201).json(await new UserModel(req.body).save())
  } catch (error) {
    next(createError(400, error))
  }
}

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.checkCredentials(email, password)
    if (!user) return next(createError(401, "Invalid credentials"))
    const { accessToken, refreshToken } = await getTokens(user)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "none",
    })
    res.status(204).send()
  } catch (error) {
    next(createError(500, error))
  }
}
