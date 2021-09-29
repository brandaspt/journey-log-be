import { Router } from "express"
import { photosParser } from "../../settings/cloudinary"
import { JWTAuthMiddleware } from "../auth/middlewares"
import * as controllers from "./controllers"

const router = Router()

router.get("/:postId", controllers.getPostById)
router.post("/", JWTAuthMiddleware, photosParser.array("photos"), controllers.newPost)
router.delete("/:postId", JWTAuthMiddleware, controllers.deletePost)

export default router
