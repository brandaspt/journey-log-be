import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

const { isEmail } = validator

const { Schema, model } = mongoose

const UserSchema = new Schema(
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
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10)
  next()
})

export default model("User", UserSchema)
