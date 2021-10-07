import { Router } from "express"
import { JWTAuthMiddleware } from "../auth/middlewares"

import * as controllers from "./controllers"

const router = Router()

router.get("/me", JWTAuthMiddleware, controllers.getMe)
router.get("/myPosts", JWTAuthMiddleware, controllers.getMyPosts)
router.get("/myPhotos", JWTAuthMiddleware, controllers.getMyPhotos)
router.get("/:userId/publicInfo", controllers.getUserPublicInfo)
router.get("/search", JWTAuthMiddleware, controllers.searchUsers)
router.post("/toggleFollow", JWTAuthMiddleware, controllers.toggleFollowUser)
router.post("/checkEmail", controllers.emailExists)
router.put("/updateProfile", JWTAuthMiddleware, controllers.updateProfile)
router.delete("/deleteUser", JWTAuthMiddleware, controllers.deleteUser)

export default router
