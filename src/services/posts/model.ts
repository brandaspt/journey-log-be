import mongoose from "mongoose"
import { IPost, IPostDocument } from "src/typings/posts"
import PhotoModel from "../photos/model"

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

PostSchema.pre("findOneAndDelete", async function (next) {
  const doc = (await this.model.findOne(this.getFilter())) as IPostDocument
  if (doc) await Promise.all(doc.photos.map(photo => PhotoModel.findByIdAndDelete(photo._id)))
  next()
})

export default model<IPost>("Post", PostSchema)
