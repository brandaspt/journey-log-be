import { Schema, Document } from "mongoose"

export interface IComment {
  comment: string
  postId?: Schema.Types.ObjectId
  photoId?: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
}

export interface ICommentDocument extends Document, IComment {}
