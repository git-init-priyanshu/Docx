import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { User } from "../../models/users";

dotenv.config();

export const login: MutationResolvers["login"] = async (
  _parent,
  args,
  _contextValue,
  _info
) => {
  const { emailId, password } = args.data;
  try {
    // Email validation
    const user = await User.findOne({ email: emailId });
    // Password validation
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!user || !isCorrectPassword) throw new Error("Invalid credentials");

    // Auth Token
    const data = {
      user: {
        emailId
      },
    };
    const authToken = jwt.sign(data, process.env.JWT_SECRET);

    const outputData = {
      success: true,
      token: authToken
    }
    
    return outputData;
  } catch (error) {
    throw new Error("Internal Server Error");
  }
};
