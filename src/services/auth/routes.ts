import { Router } from "express"
import passport from "passport"
import * as controllers from "./controllers"

const router = Router()

router.post("/refreshTokens", controllers.refresh)
router.post("/register", controllers.registerUser)
router.post("/login", controllers.loginUser)
router.get("/logout", controllers.logoutUser)
router.get("/googleLogin", passport.authenticate("google", { scope: ["email", "profile"] }))
router.get("/googleRedirect", passport.authenticate("google"), controllers.googleRedirect)

export default router
