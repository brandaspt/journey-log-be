import { Router } from "express"
import { JWTAuthMiddleware } from "../auth/middlewares"

import * as controllers from "./controllers"

const router = Router()

router.get("/me", JWTAuthMiddleware, controllers.getMe)
router.get("/search", JWTAuthMiddleware, controllers.searchUsers)

export default router
