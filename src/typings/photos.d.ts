import { Schema, Document } from "mongoose"

export interface IPhoto {
  likes?: ObjectId[]
  lat: number
  lng: number
  dateTaken?: Date
  postId?: ObjectId
  userId: ObjectId
  url: string
  cloudinaryPublicId?: string
  isPrivate: boolean
}

export interface IPhotoDocument extends Document, IPhoto {}
