import { gql } from "apollo-server-express";

export const types = gql`
  type User {
    _id: ObjectId!
    firstName: String!
    lastName: String!
    email: String!
    isVerified: Boolean!
    isAdmin: Boolean!
    verifyToken: String
    verifyTokenExpiry: Date
    forgotPasswordToken: String
    forgotPasswordTokenExpiry: Date
  }

  type Doc {
    _id: ObjectId!
    name: String!
    docId: String!
    email: [String!]
    data: JSON
    thumbnail: String!
    creator: String!
    createdAt: Date!
    isShared: Boolean!
  }

  type userOutput {
    success: Boolean!
    token: String!
  }
`;
