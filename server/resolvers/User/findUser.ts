import jwt from "jsonwebtoken";

import { QueryResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { User } from "../../models/users";
import { JwtPayload } from "../index";

export const findUser: QueryResolvers["findUser"] = async (
  _parent,
  args,
  _contextValue,
  _info
) => {
  try {
    const { token } = args;
    if (!token) throw "Not Authorised";

    const output = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const userEmail = output.user.emailId;

    const user = await User.findOne({ email: userEmail }).select("-password -__v");

    if (user) return true;
    return false;
  } catch (error) {
    throw "Internal server error";
  }
};
