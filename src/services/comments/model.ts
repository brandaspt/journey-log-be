import mongoose from "mongoose"
import { IComment } from "src/typings/comments"

const { Schema } = mongoose

const CommentSchema = new Schema<IComment>({
  comment: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, required: true },
})

export default CommentSchema
