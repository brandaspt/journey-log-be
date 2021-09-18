import mongoose from "mongoose"
import { IComment } from "src/typings/comments"

const { Schema, model } = mongoose

const CommentSchema = new Schema<IComment>(
  {
    comment: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    photoId: { type: Schema.Types.ObjectId, ref: "Photo" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

CommentSchema.methods.toJSON = function () {
  const photo = this.toObject()
  delete photo.__v
  return photo
}

export default model<IComment>("Comment", CommentSchema)
