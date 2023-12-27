import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z, ZodType } from "zod";

import {
  MutationResolvers,
  MutationSignupArgs,
  SignupInput,
} from "../../generatedGraphqlTypes/resolvers-types";
import { InterfaceUser, User } from "../../models/users";

dotenv.config();

export const signup: MutationResolvers["signup"] = async (
  _parent: any,
  args: MutationSignupArgs,
  _contextValue: any,
  _info: any
) => {
  const inputSchema = z.object({
    emailId: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    password: z.string().min(5).max(10),
  });
  const isValidSchema = inputSchema.safeParse(args.data);
  if (!isValidSchema.success) throw new Error("Invalid Input");

  const { firstName, lastName, emailId, password } = args.data;

  if (!emailId || !password) throw "Please provide email and password";

  try {
    const user = await User.findOne({ emailId });
    if (user) throw "Looks like you already have an account";

    // Encrypting Password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    // @Todo: Email validation

    // Auth Token
    const data = {
      user: {
        emailId,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);
    console.log(authToken);

    const newUser = new User<InterfaceUser>({
      firstName: firstName,
      lastName: lastName,
      email: emailId.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      isAdmin: false,
      verifyToken: authToken,
      verifyTokenExpiry: null,
      forgotPasswordToken: null,
      forgotPasswordTokenExpiry: null,
    });
    await newUser.save();

    const outputData = {
      success: true,
      token: authToken,
    };

    return outputData;
  } catch (error) {
    throw "Internal Server Error";
  }
};
