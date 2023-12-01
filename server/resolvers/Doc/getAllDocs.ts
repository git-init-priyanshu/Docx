import jwt from "jsonwebtoken";

import { QueryResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc } from "../../models/doc";
import { JwtPayload } from "../index";

export const getAllDocs: QueryResolvers["getAllDocs"] = async (
  _parent,
  args,
  _contextValue,
  _info
) => {
  const { token } = args;

  try {
    // Getting userEmail of user from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const userEmail = decoded.user.emailId;

    const docs = await Doc.find({ email: userEmail }).select("-__v");

    return docs;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
