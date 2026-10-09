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