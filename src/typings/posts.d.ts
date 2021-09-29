import { Schema, Document, Types } from "mongoose"
import { IPhotoDocument } from "./photos"

export interface IPost {
  title: string
  likes?: ObjectId[]
  photos: ObjectId[]
  isPrivate: boolean
  lat: number
  lng: number
  userId: ObjectId
  description?: string
}

export interface IPostDocument extends Document, IPost {}
