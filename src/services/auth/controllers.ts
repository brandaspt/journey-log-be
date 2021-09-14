// Packages
import createError from "http-errors"

// Model
import UserModel from "../users/model"

import { getTokens } from "../auth/tools"
import { TController } from "src/typings/controllers"
import { refreshTokens } from "./tools"

export const registerUser: TController = async (req, res, next) => {
  const userDetails = { ...req.body }
  userDetails.avatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
  const newUser = new UserModel(userDetails)
  try {
    const savedUser = await newUser.save()
    const { accessToken, refreshToken } = await getTokens(savedUser)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    res.status(201).send(savedUser)
  } catch (error) {
    next(createError(400, error as Error))
  }
}

export const loginUser: TController = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = await UserModel.checkCredentials(email, password)
    if (!user) return next(createError(401, "Invalid credentials"))
    const { accessToken, refreshToken } = await getTokens(user)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    res.status(204).send()
  } catch (error) {
    next(createError(500, error as Error))
  }
}

export const refresh: TController = async (req, res, next) => {
  const { refreshToken } = req.cookies
  // if (!refreshToken) return next(createError(400, "Refresh token must be provided"))
  try {
    const tokens = await refreshTokens(refreshToken)
    if (!tokens) return next(createError(401, "Invalid token"))
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    })
    res.status(204).send()
  } catch (error) {
    next(createError(500, error as Error))
  }
}
