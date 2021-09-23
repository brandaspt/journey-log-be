import mongoose from "mongoose"
import { IPhoto } from "src/typings/photos"

const { Schema, model } = mongoose

const PhotoSchema = new Schema<IPhoto>(
  {
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    dateTaken: Date,
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    isPrivate: { type: Boolean, required: true },
  },
  { timestamps: true }
)

PhotoSchema.methods.toJSON = function () {
  const photo = this.toObject()
  delete photo.__v
  return photo
}

export default model<IPhoto>("Photo", PhotoSchema)
