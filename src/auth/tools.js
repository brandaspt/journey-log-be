import jwt from "jsonwebtoken"
import UserModel from "../services/users/model.js"

const generateJWT = payload =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  )

const generateRefreshJWT = payload =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1w" }, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  )

export const getTokens = async user => {
  const accessToken = await generateJWT({ _id: user._id })
  const refreshToken = await generateRefreshJWT({ _id: user._id })

  user.refreshToken = refreshToken

  await user.save()

  return { accessToken, refreshToken }
}

export const verifyJWT = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err)
      resolve(decodedToken)
    })
  )
export const verifyRefreshJWT = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
      if (err) reject(err)
      resolve(decodedToken)
    })
  )

export const refreshTokens = async currentRefreshToken => {
  try {
    const decoded = await verifyRefreshJWT(currentRefreshToken)
    const user = await UserModel.findById(decoded._id)
    if (!user) return null
    if (currentRefreshToken !== user.refreshToken) return null
    const { accessToken, refreshToken } = await getTokens(user)
    return { accessToken, refreshToken }
  } catch (error) {
    return null
  }
}

// export const refreshTokens = async currentRefreshToken => {
//   const decoded = await verifyRefreshJWT(currentRefreshToken)
//   const user = await UserModel.findById(decoded._id)
//   return new Promise((resolve, reject) => {

//   })
// }
