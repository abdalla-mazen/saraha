import userModel from "../../DB/model/user.model.js";
import { Encrypt, Decrypt } from "../../common/security/encrypt.js";
import { compareValue, hashValue } from "../../common/security/hash.js";
import sucessResponse from "../../utils/response/sucess.response.js";
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "../../utils/response/error.response.js";
import { create, findOne, updateOne } from "../../DB/database.repository.js";
import { createLoginCredentials } from "../../common/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { CLIENT_ID } from "../../../config/config.service.js";
import generateOTP from "../../utils/generateOtp/generate-otp.js";
import { emailEvent } from "../../utils/events/email.events.js";
import { ProviderEnum } from "../../utils/enums/user.enum.js";

// signup
export const signup = async (req, res, next) => {
  const existUser = await findOne({
    model: userModel,
    filter: { email: req.body.email },
  });
  if (existUser) {
    throw ConflictException("Email already exist");
  }
  if (req.body.phone) {
    req.body.phone = Encrypt(String(req.body.phone));
  }
  req.body.password = await hashValue(req.body.password);
  const otp = generateOTP();
  const hashedOtp = await hashValue(otp.toString());

  const user = await create({
    model: userModel,
    data: [{ ...req.body, confirmEmailOtp: hashedOtp }],
  });

  emailEvent.emit("confirmEmail", {
    to: user.email,
    code: otp,
    firstName: user.fName,
  });

  sucessResponse({
    res,
    statusCode: 201,
    message: "User create Successful",
    data: user,
  });
};

// signin
export const signin = async (req, res, next) => {
  const user = await findOne({
    model: userModel,
    filter: { email: req.body.email },
  });

  if (!user) {
    throw UnauthorizedException("Invalid Email or Password");
  }

  const isMatch = await compareValue(req.body.password, user.password);

  if (!isMatch) {
    throw UnauthorizedException("Invalid Email or Password");
  }
  user.phone = Decrypt(user.phone);
  const { password, ...userData } = user.toObject();
  const tokens = await createLoginCredentials({ user });
  sucessResponse({
    res,
    statusCode: 200,
    message: "Done",
    data: { userData, tokens },
  });
};

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: { $exists: false },
      provider: ProviderEnum.SYSTEM,
    },
  });
  if (!user) {
    throw BadRequestException({ message: "invalid user" });
  }
  const verifiyOtp = await compareValue(otp, user.confirmEmailOtp);
  if (!verifiyOtp) {
    throw BadRequestException({ message: "invalid otp" });
  }
  await updateOne({
    model: userModel,
    filter: {
      email,
    },
    update: {
      $set: {
        isConfirmed: new Date(),
      },
      $unset: {
        confirmEmailOtp: 1,
      },
    },
  });
  sucessResponse({ res, message: "your account is confirmed" });
};

async function verifyGoogleAccount({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();

  return payload;
}

export const loginWithGmail = async (req, res) => {
  const { idToken } = req.body;

  const { email, picture, given_name, family_name, email_verified } =
    await verifyGoogleAccount({ idToken });

  if (!email_verified) {
    throw BadRequestException({ message: "Email not verified" });
  }

  const user = await findOne({ model: userModel, filter: { email } });

  if (user) {
    if (user.provider === ProviderEnum.GOOGLE) {
      const tokens = await createLoginCredentials({ user });
      sucessResponse({ res, message: "Done", data: { tokens } });
    }
  } else {
    const newUser = await create({
      model: userModel,
      data: [
        {
          firstName: given_name,
          lastName: family_name,
          email,
          profilePic: picture,
          provider: ProviderEnum.GOOGLE,
        },
      ],
    });
    const tokens = await createLoginCredentials({ user: newUser });
    sucessResponse({ res, message: "Done", statusCode: 201, data: { tokens } });
  }
};

export const forget = async (req, res, next) => {
  const { email } = req.body;
  const user = await findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    },
  });
  if (!user) {
    throw BadRequestException({ message: "invalid user" });
  }
  const otp = generateOTP();
  const hashedOtp = await hashValue(otp.toString());
  await updateOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    },
    update: {
      forgrtPasswordOtp: hashedOtp,
    },
  });
  emailEvent.emit("forgetPassword", {
    to: user.email,
    code: otp,
    firstName: user.fName,
  });

  sucessResponse({ res, message: "Done" });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await findOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    },
  });
  if (!user) {
    throw BadRequestException({ message: "invalid user" });
  }
  const verifiyOtp = await compareValue(otp, user.forgrtPasswordOtp);
  if (!verifiyOtp) {
    throw BadRequestException({ message: "invalid otp" });
  }
  const hashedPassword = await hashValue(password);
  await updateOne({
    model: userModel,
    filter: {
      email,
      isConfirmed: { $exists: true },
      provider: ProviderEnum.SYSTEM,
    },
    update: {
      $set: {
        password: hashedPassword,
      },
      $unset: {
        forgrtPasswordOtp: 1,
      },
    },
  });
  sucessResponse({ res, message: "Done" });
};
