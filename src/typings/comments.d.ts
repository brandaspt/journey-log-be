import { Schema, Document } from "mongoose"

export interface IComment {
  comment: string
  userId: ObjectId
  createdAt: Date
}
