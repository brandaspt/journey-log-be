import { TController } from "src/typings/controllers"

export const getMe: TController = async (req, res, next) => {
  res.json(req.user)
}
