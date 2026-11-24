import { Router } from "express";
import * as AS from "./auth.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
import rateLimitMiddleware from "../../common/rate-limit.js";

const authRouter = Router();

// rate limit middleware for login route
const limiterLogin = rateLimitMiddleware({ windowMs: 15 * 60 * 1000, limit: 5 });


// signup route
authRouter.post(
  "/signup",
  validation(authValidation.registerSchema),
  AS.signup,
);

// signin route
authRouter.post("/signin", limiterLogin, validation(authValidation.loginSchema), AS.signin);

// confirm email route
authRouter.patch(
  "/confirm-email",
  validation(authValidation.confirmEmailSchema),
  AS.confirmEmail,
);

// forget password route
authRouter.patch(
  "/forget",
  validation(authValidation.forgetPasswordSchema),
  AS.forget,
);

// reset password route
authRouter.patch(
  "/reset-password",
  validation(authValidation.resetPasswordSchema),
  AS.resetPassword,
);

export default authRouter;
