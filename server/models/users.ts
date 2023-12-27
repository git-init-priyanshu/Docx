import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

export interface InterfaceUser {
  firstName: string;
  lastName: string;
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
  firstName: {
    type: String,
    required: [true, "Please provide firstname"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide lastname"],
  },
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
