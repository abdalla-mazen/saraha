import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../utils/enums/user.enum.js";

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
      minLength: 3,
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
      minLength: 3,
    },
    age: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.USER,
    },
    profielImage: String,
    profielImage: [String],
    provider: {
      type: String,
      enum: Object.keys(ProviderEnum),
      default: ProviderEnum.SYSTEM,
    },
    isConfirmed: Date,
    forgrtPasswordOtp: String,
    confirmEmailOtp: String,
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
