import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  MutationResolvers,
  MutationLoginArgs,
  LoginInput,
} from "../../generatedGraphqlTypes/resolvers-types";
import { User } from "../../models/users";
import { z, ZodType } from "zod";

dotenv.config();

export const login: MutationResolvers["login"] = async (
  _parent,
  args: MutationLoginArgs,
  _contextValue,
  _info
) => {
  // Input validation
  const loginSchema = z.object({
    emailId: z.string().email(),
    password: z.string(),
  });
  const isValidSchema = loginSchema.safeParse(args.data);
  if (!isValidSchema.success) throw new Error("Invalid Input");

  const { emailId, password } = args.data;
  try {
    // Email validation
    const user = await User.findOne({ email: emailId });
    // Password validation
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!user || !isCorrectPassword) throw new Error("Invalid Credentails");

    // Auth Token
    const data = {
      user: {
        emailId,
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    const outputData = {
      success: true,
      token: authToken,
    };

    return outputData;
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};
