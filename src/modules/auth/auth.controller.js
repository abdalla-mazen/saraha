import { Router } from "express";
import * as AS from "./auth.service.js"

const authRouter = Router()

// signup route
authRouter.post("/signup", AS.signup);

// signin route
authRouter.post("/signin", AS.signin);

export default authRouter