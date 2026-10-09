import { Router } from "express";
import * as US from "./user.service.js"

const userRouter = Router()

// signup route
userRouter.post("/signup", US.signup);

// signin route
userRouter.post("/signin", US.signin);

export default userRouter