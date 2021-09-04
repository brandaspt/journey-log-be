import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import { IUserDocument, IUserModel } from "src/typings/users"

const { isEmail } = validator
const { Schema, model } = mongoose

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: { validator: isEmail, message: "Invalid email." },
      unique: true,
      required: true,
    },
    password: String,
    avatar: String,
    bio: String,
    refreshToken: String,
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password!, 10)
  next()
})

UserSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) return
  const isMatch = await bcrypt.compare(password, user.password!)
  if (isMatch) return user
}

UserSchema.methods.toJSON = function () {
  const { name, surname, email, avatar, bio, _id } = this.toObject()
  return { name, surname, email, avatar, bio, _id }
}

export default model<IUserDocument, IUserModel>("User", UserSchema)
