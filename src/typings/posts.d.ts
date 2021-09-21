import { Schema, Document, Types } from "mongoose"

export interface IPost {
  title: string
  likes?: Schema.Types.ObjectId[]
  photos: Schema.Types.ObjectId[]
  isPrivate: boolean
  lat: number
  lng: number
  userId: Types.ObjectId
  description?: string
}

export interface IPostDocument extends Document, IPost {}
