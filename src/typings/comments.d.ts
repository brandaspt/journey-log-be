import { Schema, Document, ObjectId } from "mongoose"

export interface IComment {
  comment: string
  userId: ObjectId
  createdAt: Date
}
