import { file, z } from "zod";
import { RoleEnum } from "../enums/user.enum.js";

const allowedTlds = ["com", "net", "org"];

export const generalFileds = {
  fName: z
    .string()
    .min(3)
    .max(20)
    .trim()
    .regex(
      /^[a-zA-Z0-9]+$/,
      "First name must contain only letters and numbers",
    ),
  lName: z
    .string()
    .min(3)
    .max(20)
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, "Last name must contain only letters and numbers"),
  email: z
    .email({ error: "Invalid email address" })
    .trim()
    .toLowerCase()
    .refine((v) => allowedTlds.includes(v.split(".").pop().toLowerCase()), {
      error: `Email must have a valid top-level domain (TLD)  (${allowedTlds.join(", ")})`,
    }),
  password: z
    .string()
    .min(8)
    .trim()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  age: z
    .number()
    .int({ error: "Age must be an integer" })
    .min(18, { error: "Age must be at least 18" }),
  phone: z.string(),
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, { error: "Invalid ID format" }),
  otp: z
    .string()
    .length(6, { error: "OTP must be 6 digits" })
    .regex(/^[0-9]{6}$/, { error: "OTP must contain only digits" }),
  autrization: z.string({ error: "Authorization header is required" }),
  role: z.enum(RoleEnum),
  DOB: z.date(),
  file: (allowedMimeTypes = [], maxFileSize = 5 * 1024 * 1024) => {
    z.object({
      filedName: z.literal("attachments"),
      originalname: z.string().min(1, { error: "Original name is required" }),
      encoding: z.string(),
      mimetype: z.enum(allowedMimeTypes, {
        error: `Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`,
      }),
      size: z
        .number()
        .max(maxFileSize, {
          error: `File size must be less than ${maxFileSize / (1024 * 1024)} MB`,
        }),
      destination: z.string(),
      filename: z.string(),
      path: z.string(),
      finalpath: z.string()
    })
  },
};
