import mongoose from "mongoose"
import { IPost } from "src/typings/posts"

const { Schema, model } = mongoose

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    isPrivate: { type: Boolean, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    photos: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: String,
  },
  { timestamps: true }
)

export default model<IPost>("Post", PostSchema)
