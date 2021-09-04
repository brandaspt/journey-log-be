import mongoose from "mongoose"
import { IPhoto } from "src/typings/photos"

const { Schema, model } = mongoose

const PhotoSchema = new Schema<IPhoto>(
  {
    description: String,
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    dateTaken: Date,
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true }
)

export default model<IPhoto>("Photo", PhotoSchema)
