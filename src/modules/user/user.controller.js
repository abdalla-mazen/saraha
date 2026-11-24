import { Router } from "express";
import * as US from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { TokenEnum } from "../../utils/enums/security.enum.js";
import { fileValidation, localFileUpload, validationMagicNumbers } from "../../utils/multer/local.multer.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as userValidation from "../user/user.validation.js"

const userRouter = Router();

// rotate token route
userRouter.post(
  "/rotate-token",
  authentication({ tokenType: TokenEnum.REFRESH }),
  US.rotateToken,
);

// upload profile picture route
userRouter.patch(
  "/upload-profile-pic",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  localFileUpload({ customPath: "user", validation: [...fileValidation.images, ...fileValidation.documents] }).single("attachments"),
  validationMagicNumbers([...fileValidation.images, ...fileValidation.documents]),
  US.uploadFile,
);

// upload cover picture route
userRouter.patch(
  "/upload-cover-pic",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  localFileUpload({ customPath: "user", validation: [...fileValidation.images, ...fileValidation.documents] }).array("attachments", 10),
  US.uploadCoverFile,
);

// hard delete user route
userRouter.delete(
  "/delete-account/:userId",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.ADMIN]),
  validation(userValidation.hardDeleteSchema),
  US.hardDeleteAccount,
);


export default userRouter;
