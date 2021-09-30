import { Router } from "express"
import { photosParser } from "../../settings/cloudinary"
import { JWTAuthMiddleware } from "../auth/middlewares"
import * as controllers from "./controllers"

const router = Router()

router.post("/", JWTAuthMiddleware, photosParser.array("photos"), controllers.uploadPhotos)
router.delete("/:photoId", JWTAuthMiddleware, controllers.deletePhoto)
export default router
