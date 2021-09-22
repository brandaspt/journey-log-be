import { IPhoto } from "src/typings/photos"
import { IUserDocument } from "src/typings/users"
import { TController } from "../../typings/controllers"

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
  console.log(photosArr)
  res.json()
}
