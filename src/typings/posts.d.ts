import { Schema, Document } from "mongoose"

export interface IPost {
  title: string
  likes: Schema.Types.ObjectId[]
  lat: number
  long: number
  userId: Schema.Types.ObjectId
  description: string
}

export interface IPostDocument extends Document, IPost {}
