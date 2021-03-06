import { Document, Model, ObjectId } from "mongoose"
export interface IUser {
  name: string
  surname: string
  email: string
  followers: ObjectId[]
  following: ObjectId[]
  password?: string
  avatar?: string
  bio?: string
  refreshToken?: string
  googleId?: string
}

export interface IUserDocument extends Document, IUser {}
export interface IUserModel extends Model<IUserDocument> {
  checkCredentials(email: string, password: string): Promise<IUserDocument | null>
}
export interface IPassportUser {
  user: IUserDocument
  tokens: {
    accessToken: string
    refreshToken: string
  }
}
