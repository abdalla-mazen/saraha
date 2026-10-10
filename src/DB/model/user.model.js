import mongoose from "mongoose";
import { GenderEnum, ProviderEnum } from "../../utils/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    lName: {
      type: String,
      required: true,
      trim: true,
      minLegth: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLegth: 3,
    },
    age: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.keys(GenderEnum),
      default: GenderEnum.MALE,
    },
    profielImage: String,
    provider: {
      type: String,
      enum: Object.keys(ProviderEnum),
      default:  ProviderEnum.SYSTEM,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// 
const userModel = mongoose.models.User || mongoose.model("User",userSchema)
export default userModel