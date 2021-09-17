import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { IPassportUser } from "src/typings/users"
import UserModel from "../users/model"
import { getTokens } from "./tools"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID!,
    clientSecret: process.env.GOOGLE_APP_SECRET!,
    callbackURL: `${process.env.BACKEND_URL}/auth/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      const user = await UserModel.findOne({ googleId: profile.id })
      if (user) {
        const tokens = await getTokens(user)
        passportNext(null, { tokens })
      } else {
        const newUserData = new UserModel({
          name: profile.name!.givenName,
          avatar: profile.photos![0].value,
          surname: profile.name!.familyName,
          email: profile.emails![0].value,
          googleId: profile.id,
        })
        const newUser = await newUserData.save()
        const tokens = await getTokens(newUser)
        passportNext(null, { user: newUser, tokens })
      }
    } catch (error) {
      passportNext(error as Error)
    }
  }
)

passport.serializeUser((user, passportNext) => {
  // REQUIRED to have req.user
  passportNext(null, user)
})

export default googleStrategy
