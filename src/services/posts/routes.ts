import { Router } from "express"
import { photosParser } from "../../settings/cloudinary"
import { JWTAuthMiddleware } from "../auth/middlewares"
import * as controllers from "./controllers"

const router = Router()

router.get("/:postId", controllers.getPostById)
router.post("/", JWTAuthMiddleware, photosParser.array("photos"), controllers.newPost)
router.post("/:postId/comments", JWTAuthMiddleware, controllers.addComment)
router.put("/:postId/addPhotos", JWTAuthMiddleware, photosParser.array("photos"), controllers.addPhotos)
router.put("/:postId/toggleLike", JWTAuthMiddleware, controllers.toggleLike)
router.put("/:postId", JWTAuthMiddleware, controllers.editPost)
router.delete("/:postId", JWTAuthMiddleware, controllers.deletePost)

export default router
