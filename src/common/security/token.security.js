import jwt from "jsonwebtoken";
import { RoleEnum } from "../../utils/enums/user.enum.js";
import { TokenEnum } from "../../utils/enums/security.enum.js";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/response/error.response.js";
import { findById } from "../../DB/database.repository.js";
import userModel from "../../DB/model/user.model.js";
import {
  ACCESS_ADMIN_TOKEN_SIGNTURE,
  ACCESS_USER_TOKEN_SIGNTURE,
  EXPIRE_IN_ACCESS,
  EXPIRE_IN_REFRESH,
  REFRESH_ADMIN_TOKEN_SIGNTURE,
  REFRESH_USER_TOKEN_SIGNTURE,
} from "../../../config/config.service.js";
export const createToken = async ({
  payload,
  options,
  secret = ACCESS_USER_TOKEN_SIGNTURE,
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",
  secret = ACCESS_USER_TOKEN_SIGNTURE,
} = {}) => {
  return jwt.verify(token, secret);
};

export const getTokenSignture = async ({ role = RoleEnum.USER } = {}) => {
  let signatures;
  switch (role) {
    case RoleEnum.ADMIN:
      signatures = {
        accessSignature: ACCESS_ADMIN_TOKEN_SIGNTURE,
        refreshSignature: REFRESH_ADMIN_TOKEN_SIGNTURE,
      };
      break;

    default:
      signatures = {
        accessSignature: ACCESS_USER_TOKEN_SIGNTURE,
        refreshSignature: REFRESH_USER_TOKEN_SIGNTURE,
      };
  }
  return signatures;
};

export const getSignature = async ({
  tokenType = TokenEnum.ACCESS,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignture({ role });
  return tokenType == TokenEnum.ACCESS
    ? signatures.accessSignature
    : signatures.refreshSignature;
};

export const decodeToken = async ({
  token ,
  tokenType = TokenEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(token);
  if (!decoded?.aud.length) {
    throw BadRequestException("Missing token payload ");
  }

  const payload = await verifyToken({
    token: token,
    secret: await getSignature({ tokenType, role: decoded.aud[0] }),
  });
  if (!payload.sub) {
    throw BadRequestException("Missing token payload ");
  }
  const user = await findById({ id: payload.sub, model: userModel });
  if (!user) {
    throw NotFoundException("Invalid user ");
  }
  return { user, payload };
};

export const createLoginCredentials = async ({ user, options = {} } = {}) => {
  const { accessSignature, refreshSignature } = await getTokenSignture({
    role: user.role,
  });

  console.log({user})
  const access_token = await createToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      ...options,
      audience: [user.role],
      expiresIn: EXPIRE_IN_ACCESS,
    },
  });
  const refresh_token = await createToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    options: {
      ...options,
      audience: [user.role],
      expiresIn: EXPIRE_IN_REFRESH,
    },
  });
  return { access_token, refresh_token };
};
