import { Router } from "express"

import * as controllers from "./controllers"

const router = Router()

router.post("/register", controllers.registerUser)
router.post("/login", controllers.loginUser)

export default router
