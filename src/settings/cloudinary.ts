import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from "multer"
import { IUserDocument } from "src/typings/users"

const photosStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const user = req.user as IUserDocument
    return {
      folder: `JourneyLog/Photos/${user._id}`,
    }
  },
})
export const photosParser = multer({ storage: photosStorage })

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: `JourneyLog/Avatars`,
    }
  },
})
export const avatarParser = multer({ storage: avatarStorage })
