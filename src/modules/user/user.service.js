import { EXPIRE_IN_ACCESS, EXPIRE_IN_REFRESH } from "../../../config/config.service.js";
import { createLoginCredentials, userRevokeTokenKey } from "../../common/security/token.security.js";
import { set } from "../../common/services/cache.service.js";
import { findByIdAndUpdate } from "../../DB/database.repository.js";
import userModel from "../../DB/model/user.model.js";
import { BadRequestException } from "../../utils/response/error.response.js";
import sucessResponse from "../../utils/response/sucess.response.js";

// rotate token
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

// logout
export const logout = async (req, res, next) => {
  const consumedTime = (Math.ceil(Date.now() / 1000) - req.payload.iat);
  const refreshExpireIn = req.payload.iat + EXPIRE_IN_REFRESH;
  const ttl = refreshExpireIn - consumedTime;

  await set({ key: userRevokeTokenKey(req.user._id, req.payload.jti), value: req.payload.jti, ttl: ttl });
  sucessResponse({
    res,
    statusCode: 200,
    message: "Logout successfully",
  });
};

// upload profile picture
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

// upload cover picture
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



// Hard delete account
export const hardDeleteAccount = async (req, res, next) => {
  const { userId } = req.params;

  const result = await deleteOne({
    model: userModel,
    filter: { _id: userId },
  });

  if (!result.deletedCount) {
    throw NotFoundException({ message: "User not found" });
  }

  return sucessResponse({
    res,
    message: "User deleted successfully",
  });
};