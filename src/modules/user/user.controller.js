import { Router } from "express";
import * as US from "./user.service.js"
import { authentication } from "../../middleware/authentication.middleware.js";
import { TokenEnum } from "../../utils/enums/security.enum.js";

const userRouter = Router()


userRouter.post("/rotate-token",authentication({tokenType: TokenEnum.REFRESH}), US.rotateToken);


export default userRouter