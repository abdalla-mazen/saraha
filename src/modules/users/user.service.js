import userModel from "../../DB/model/user.model.js";
import { Types } from "mongoose";
import { Encrypt, Decrypt } from "../../common/security/encrypt.js";
import { compareValue, hashValue } from "../../common/security/hash.js";
import sucessResponse from "../../utils/response/sucess.response.js";
import {
  ConflictException,
  UnauthorizedException,
} from "../../utils/response/error.response.js";
import { findOne } from "../../DB/database.repository.js";

// signup
export const signup = async (req, res, next) => {
  const existUser = await findOne({ model: userModel, filter: { email: req.body.email } });
  if (existUser) {
    throw ConflictException("Email already exist");
  }
  if (req.body.phone) {
    req.body.phone = Encrypt(String(req.body.phone));
  }
  req.body.password = await hashValue(req.body.password);
  const user = await userModel.insertOne(req.body);
  sucessResponse({
    res,
    statusCode: 201,
    message: "User create Successful",
    data: user,
  });
};

// signin
export const signin = async (req, res, next) => {
  const user = await findOne({ model: userModel, filter: { email: req.body.email } });

  if (!user) {
    throw UnauthorizedException("Invalid Email or Password");
  }

  const isMatch = await compareValue(req.body.password, user.password);

  if (!isMatch) {
    throw UnauthorizedException("Invalid Email or Password");
  }
  user.phone = Decrypt(user.phone);
  const { password, ...userData } = user.toObject();
  sucessResponse({
    res,
    statusCode: 200,
    message: "Done",
    data: userData,
  });
};
