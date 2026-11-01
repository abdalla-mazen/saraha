import { Router } from "express";
import * as AS from "./auth.service.js"

const authRouter = Router()

// signup route
authRouter.post("/signup", AS.signup);

// signin route
authRouter.post("/signin", AS.signin);

// confirm email route
authRouter.patch("/confirm-email", AS.confirmEmail);

// forget password route
authRouter.patch("/forget", AS.forget);

// reset password route
authRouter.patch("/reset-password", AS.resetPassword);

export default authRouter