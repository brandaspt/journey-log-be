import { Schema, Document, ObjectId, Types } from "mongoose"
import { IPostDocument } from "./posts"

export interface IPhoto {
  likes?: ObjectId[]
  lat: number
  lng: number
  dateTaken?: Date
  postId?: Types.ObjectId | IPostDocument
  userId: Types.ObjectId
  url: string
  cloudinaryPublicId?: string
  isPrivate: boolean
}

export interface IPhotoDocument extends Document, IPhoto {}
