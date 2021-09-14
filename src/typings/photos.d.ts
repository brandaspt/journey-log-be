import mongoose, { Schema } from "mongoose"

const { Schema } = mongoose

export interface IPhoto {
  description?: string
  lat: number
  long: number
  dateTaken?: Date
  postId?: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  url: string
}
