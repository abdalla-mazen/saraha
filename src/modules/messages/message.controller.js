import { Router } from "express";
import * as MS from "./message.service.js";
import * as messageValidation from "./message.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  authentication,
  authorization,
} from "../../middleware/authentication.middleware.js";
import { TokenEnum } from "../../utils/enums/security.enum.js";
import { RoleEnum } from "../../utils/enums/user.enum.js";

const messageRouter = Router();

// send message route
messageRouter.post(
  "/send/:receiverId",
  validation(messageValidation.sendMessageSchema),
  MS.sendMessage,
);

//  get all messages route
messageRouter.get("/:id/all", MS.getAllMessages);

// toggle read message route
messageRouter.patch(
  "/:messageId/toggle-read",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  MS.toggleReadMessage,
);

// mark message as favorite route
messageRouter.patch(
  "/:messageId/mark-favorite",
  authentication({ tokenType: TokenEnum.ACCESS }),
  authorization([RoleEnum.USER, RoleEnum.ADMIN]),
  MS.markMessageAsFavorite,
);

export default messageRouter;
