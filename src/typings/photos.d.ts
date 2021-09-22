import { Schema, Document } from "mongoose"

export interface IPhoto {
  likes?: Schema.Types.ObjectId[]
  lat: number
  lng: number
  dateTaken?: Date
  postId?: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  url: string
  isPrivate: boolean
}

export interface IPhotoDocument extends Document, IPhoto {}
