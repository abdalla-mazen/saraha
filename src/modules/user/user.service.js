import { EXPIRE_IN_ACCESS } from "../../../config/config.service.js";
import { createLoginCredentials } from "../../common/security/token.security.js";
import { BadRequestException } from "../../utils/response/error.response.js";
import sucessResponse from "../../utils/response/sucess.response.js";

export const rotateToken = async (req, res, next) => {
  const accessExpireIn = (req.iat + EXPIRE_IN_ACCESS) * 1000;
  const currentTime = Date.now() + 30 * 6000; 
  if (currentTime < accessExpireIn) {
    throw BadRequestException("Access token is still valid, no need to rotate");
  }
 const tokens = await createLoginCredentials({ user: req.user });
    sucessResponse({
      res,
      statusCode: 200,
      message: "Token rotated successfully",
      data: tokens,
    });
};

