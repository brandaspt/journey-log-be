// Packages
import express from "express"
import mongoose from "mongoose"
import cors from "cors"

// Routers
import usersRouter from "./services/users/routes.js"
import postsRouter from "./services/posts/routes.js"
import photosRouter from "./services/photos/routes.js"
import authRouter from "./services/auth/routes.js"

import { corsOptions } from "./settings/cors.js"

const app = express()

const PORT = process.env.PORT || 3001

// MIDDLEWARES
app.use(express.json())
app.use(cors(corsOptions))

// ENDPOINTS
app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/photos", photosRouter)
app.use("/auth", authRouter)

mongoose.set("returnOriginal", false)
mongoose
  .connect(process.env.ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log("Server running on port " + PORT)))
  .catch(err => console.log(err.message))
