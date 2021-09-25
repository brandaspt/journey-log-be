// Packages
import express from "express"
import cors from "cors"
import passport from "passport"

// Routers
import usersRouter from "./services/users/routes"
import postsRouter from "./services/posts/routes"
import photosRouter from "./services/photos/routes"
import authRouter from "./services/auth/routes"

// Middlewares
import { corsOptions } from "./settings/cors"
import cookieParser from "cookie-parser"
import { errorsMiddleware } from "./errorsMiddlewares"
import googleStrategy from "./services/auth/google"

const app = express()
passport.use("google", googleStrategy)

// MIDDLEWARES
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(passport.initialize())

// ENDPOINTS
app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/photos", photosRouter)
app.use("/auth", authRouter)

// ERRORS MIDDLEWARE
app.use(errorsMiddleware)

export default app
