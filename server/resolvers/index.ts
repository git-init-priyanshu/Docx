import dotenv from "dotenv";
import { ObjectIDResolver, DateResolver, JSONResolver } from "graphql-scalars";

import { Resolvers } from "../generatedGraphqlTypes/resolvers-types";
import { addDoc } from "./Doc/addDoc";
import { createDoc } from "./Doc/createDoc";
import { getAllDocs } from "./Doc/getAllDocs";
import { saveThumbnail } from "./Doc/saveThumbnail";
import { findUser } from "./User/findUser";
import { login } from "./User/login";
import { signup } from "./User/signup";

dotenv.config();

export interface JwtPayload {
  user: {
    emailId: string;
  };
}

export const resolvers: Resolvers = {
  // Queries
  Query: {
    getAllDocs,
    findUser,
  },

  // Mutations
  Mutation: {
    addDoc,
    createDoc,
    saveThumbnail,
    login,
    signup,
  },

  // graphql-scalar resolver
  ObjectId: ObjectIDResolver,
  Date: DateResolver,
  JSON: JSONResolver,
};
