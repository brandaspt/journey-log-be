import { v2 as cloudinary } from "cloudinary"

const cloudinaryDestroyAsync = (publicId: string) =>
  new Promise((resolve, reject) =>
    cloudinary.uploader.destroy(publicId, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  )

export const deleteFromCloudinary = async (url: string, folder: string) => {
  const urlArr = url.split(`JourneyLog/${folder}`)
  const publicId = `JourneyLog/${folder}${urlArr[1].slice(0, -4)}`
  try {
    const result = await cloudinaryDestroyAsync(publicId)
    console.log(result)
  } catch (error) {
    console.log(error)
  }
}
