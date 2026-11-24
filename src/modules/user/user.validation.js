import { z } from "zod";
import { generalFileds } from "../../utils/validation/genaralfildes.js";

const imageTypes = ["image/jpeg", "image/png", "image/webp"];

// rotate token validation schema
export const rotateTokrnSchema = {
  headers: z.strictObject({
    authorization: generalFileds.autrization,
  }),
};

// upload profile picture validation schema
export const uploadProfilePicSchema = {
  headers: z.strictObject({
    authorization: generalFileds.autrization,
  }),
  file: generalFileds.file(imageTypes),
};

// upload cover picture validation schema
export const uploadCoverPicSchema = {
  headers: z.strictObject({
    authorization: generalFileds.autrization,
  }),
  files: z.array(generalFileds.file(imageTypes)),
};

// hard delete user validation schema
export const hardDeleteSchema = {
  params: z.strictObject({
    userId: generalFileds.id,
  }),
};
