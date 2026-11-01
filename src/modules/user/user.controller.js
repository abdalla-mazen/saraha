import { Router } from "express";
import * as US from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { TokenEnum } from "../../utils/enums/security.enum.js";
import { fileValidation, localFileUpload, validationMagicNumbers } from "../../utils/multer/local.multer.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const userRouter = Router();

userRouter.post(
  "/rotate-token",
  authentication({ tokenType: TokenEnum.REFRESH }),
  US.rotateToken,
);

userRouter.patch(
  "/upload-profile-pic",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  localFileUpload({ customPath: "user",validation:[...fileValidation.images ,  ...fileValidation.documents] }).single("attachments"),
  validationMagicNumbers([...fileValidation.images ,  ...fileValidation.documents]),
  US.uploadFile,
);
userRouter.patch(
  "/upload-cover-pic",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  localFileUpload({ customPath: "user" ,validation:[...fileValidation.images ,  ...fileValidation.documents] }).array("attachments",10),
  US.uploadCoverFile,
);
export default userRouter;
