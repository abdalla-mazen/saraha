import { z } from "zod";
import { generalFileds } from "../../utils/validation/genaralfildes.js";
import { GenderEnum, ProviderEnum } from "../../utils/enums/user.enum.js";

// register schema
export const registerSchema = {
  body: z
    .strictObject({
      fName: generalFileds.fName,
      lName: generalFileds.lName,
      email: generalFileds.email,
      password: generalFileds.password,
      confirmPassword: z.string({ error: "Confirm password is required" }),
      age: generalFileds.age,
      phone: generalFileds.phone.optional(),
      role: generalFileds.role.optional(),
      DOB: generalFileds.DOB.optional(),
      gender :z.enum(GenderEnum),
       profileImage: z.string().optional(),
      provider: z.enum(ProviderEnum) 
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Password not match",
      path: ["confirmPassword"],
    }),
};

// login schema
export const loginSchema = {
  body: z.strictObject({
    email: generalFileds.email,
    password: generalFileds.password,
  }),
};

// confirm email schema
export const confirmEmailSchema = {
  body: z.strictObject({
    email: generalFileds.email,
    otp: z.string({ error: "OTP is required" }),
  }),
};

// forget password schema
export const forgetPasswordSchema = {
  body: z.strictObject({
    email: generalFileds.email,
  }),
};

// reset password schema
export const resetPasswordSchema = {
  body: z.strictObject({
    email: generalFileds.email,
    password: generalFileds.password,
    otp: z.string({ error: "OTP is required" }),
  }),
};
