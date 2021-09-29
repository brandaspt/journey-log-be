import mongoose from "mongoose"
import { deleteFromCloudinary } from "../../settings/tools"
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
    cloudinaryPublicId: {
      type: String,
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
PhotoSchema.pre("findOneAndDelete", async function (next) {
  const doc = (await this.model.findOne(this.getFilter())) as IPhoto
  if (doc) await deleteFromCloudinary(doc.cloudinaryPublicId)
  next()
})

export default model<IPhoto>("Photo", PhotoSchema)
