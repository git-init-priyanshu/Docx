import dotenv from "dotenv";
import { ObjectIDResolver, DateResolver, JSONResolver } from "graphql-scalars";

import { Resolvers } from "../generatedGraphqlTypes/resolvers-types";
import { addDoc } from "./Doc/addDoc";
import { createDoc } from "./Doc/createDoc";
import { getAllDocs } from "./Doc/getAllDocs";
import { saveThumbnail } from "./Doc/saveThumbnail";
import { getDocData } from "./Doc/getDocData";
import { saveDoc } from "./Doc/saveDoc";
import {changeDocName} from './Doc/changeDocName'
import { findUser } from "./User/findUser";
import { login } from "./User/login";
import { signup } from "./User/signup";
import { subscribeToDoc } from "./User/subscribeToDoc";
import { changeText } from "./User/changeText";
import { reflectChanges } from "./User/reflectChanges";

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
    getDocData,
  },

  // Mutations
  Mutation: {
    addDoc,
    createDoc,
    saveThumbnail,
    saveDoc,
    changeDocName,
    login,
    signup,
    changeText,
  },

  // Subscriptions
  Subscription: {
    subscribeToDoc,
    reflectChanges,
  },

  // graphql-scalar resolver
  ObjectId: ObjectIDResolver,
  Date: DateResolver,
  JSON: JSONResolver,
};
