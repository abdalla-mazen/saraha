import {resolve} from "node:path";
import dotenv from "dotenv";
const envPath ={
    dev:`dev.env`,
    prod:`prod.env`
}

dotenv.config({path:resolve(`./config/${envPath.dev}`)});

export const port = process.env.PORT || 5000;
export const DB_URI = process.env.DB_URI;
export const ENC_KEY = process.env.ENC_KEY;
export const IV_LENGTH = process.env.IV_LENGTH;
export const ACCESS_USER_TOKEN_SIGNTURE = process.env.ACCESS_USER_TOKEN_SIGNTURE;
export const REFRESH_USER_TOKEN_SIGNTURE = process.env.REFRESH_USER_TOKEN_SIGNTURE;
export const ACCESS_ADMIN_TOKEN_SIGNTURE = process.env.ACCESS_ADMIN_TOKEN_SIGNTURE;
export const REFRESH_ADMIN_TOKEN_SIGNTURE = process.env.REFRESH_ADMIN_TOKEN_SIGNTURE;
export const EXPIRE_IN_ACCESS = process.env.EXPIRE_IN_ACCESS;
export const EXPIRE_IN_REFRESH = process.env.EXPIRE_IN_REFRESH;
export const CLIENT_ID = process.env.CLIENT_ID;
