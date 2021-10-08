import { Schema, Document, ObjectId, Types } from "mongoose"
import { IComment } from "./comments"
import { IPhotoDocument } from "./photos"

export interface IPost {
  title: string
  likes?: ObjectId[]
  photos: ObjectId[]
  comments: IComment[]
  isPrivate: boolean
  lat: number
  lng: number
  userId: Types.ObjectId
  description?: string
}

export interface IPostDocument extends Document, IPost {}
