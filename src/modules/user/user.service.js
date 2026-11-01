import { EXPIRE_IN_ACCESS } from "../../../config/config.service.js";
import { createLoginCredentials } from "../../common/security/token.security.js";
import { findByIdAndUpdate } from "../../DB/database.repository.js";
import userModel from "../../DB/model/user.model.js";
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

export const uploadFile = async (req, res, next) => {
  if (!req.file) {
    throw BadRequestException("No file uploaded");
  }
  const user = await findByIdAndUpdate({
    id: req.user._id,
    model: userModel,
    update: {
      profielImage: req.file.finalPath,
    }
  });
  if (!user) {
    throw BadRequestException("User not found");
  }
  sucessResponse({
    res,
    statusCode: 200,
    message: "File uploaded successfully",
    data: { filename: req.file.filename, path: req.file.path },
  });
};
export const uploadCoverFile = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    throw BadRequestException("No files uploaded");
  }
  const user = await findByIdAndUpdate({
    id: req.user._id,
    model: userModel,
    update: {
      profielImage: req.files.map((file) => file.finalPath),
    }
  });
  if (!user) {
    throw BadRequestException("User not found");
  }
  sucessResponse({
    res,
    statusCode: 200,
    message: "File uploaded successfully",
    data: { filename: req.file.filename, path: req.file.path },
  });
};
