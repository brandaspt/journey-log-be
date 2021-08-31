import mongoose, { SchemaType } from "mongoose"

const { Schema, model } = mongoose

const PhotoSchema = new Schema(
  {
    description: String,
    lat: { type: Number, required: true },
    dateTaken: Date,
    postId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true }
)

export default model("Photo", PhotosSchema)
