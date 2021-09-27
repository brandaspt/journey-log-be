import { Schema, Document } from "mongoose"

export interface IComment {
  comment: string
  postId?: ObjectId
  photoId?: ObjectId
  userId: ObjectId
}

export interface ICommentDocument extends Document, IComment {}
