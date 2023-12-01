import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

export interface InterfaceUser {
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  verifyToken: String | null;
  verifyTokenExpiry: Date | null;
  forgotPasswordToken: String | null;
  forgotPasswordTokenExpiry: Date | null;
}

const UserSchema = new Schema<InterfaceUser>({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
});

export const User = model<InterfaceUser>("User", UserSchema);
