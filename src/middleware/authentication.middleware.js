// import { decodeToken } from "../common/security/token.security.js";
// import { TokenEnum } from "../utils/enums/security.enum.js";
// import {
//   ForbiddenException,
//   UnauthorizedException,
// } from "../utils/response/error.response.js";

// export const authentication = (tokenType = TokenEnum.ACCESS) => {
//   return async (req, res, next) => {
//     const { authorization } = req.headers;
//     if (!authorization) {
//       throw UnauthorizedException("Unauthorized account");
//     }
//     const [key , token] = authorization.split(" ") || [];
//     const { user, payload } = await decodeToken({
//       tokenType : tokenType,
//       token: token,
//     });
//     req.user = user;
//     req.payload = payload;
//     next();
//   };
// };
// export const authorization = (accessRole) => {
//   return async (req, res, next) => {
//     if (!accessRole.includes(req.user.role)) {
//       throw ForbiddenException("Forbidden Acccount");
//     }
//     next();
//   };
// };


import { decodeToken } from "../common/security/token.security.js";
import { TokenEnum } from "../utils/enums/security.enum.js";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../utils/response/error.response.js";

export const authentication = ({ tokenType = TokenEnum.ACCESS } = {}) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw UnauthorizedException("Unauthorized account");
      }

      const [key, token] = authorization.trim().split(/\s+/);
      if (!token) {
        throw UnauthorizedException("Unauthorized account");
      }

      const { user, payload } = await decodeToken({ tokenType, token });
      req.user = user;
      req.payload = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authorization = (accessRole = []) => {
  return async (req, res, next) => {
    try {
      if (!accessRole.includes(req.user.role)) {
        throw ForbiddenException("Forbidden Account");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};