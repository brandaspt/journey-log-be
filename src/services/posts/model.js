import mongoose from "mongoose"

const { Schema, model } = mongoose

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
  { timestamps: true }
)

export default model("Post", PostSchema)
