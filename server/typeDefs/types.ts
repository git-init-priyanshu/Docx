import { gql } from "apollo-server-express";

export const types = gql`
  type User {
    _id: ObjectId!
    email: String!
    isVerified: Boolean!
    isAdmin: Boolean!
    verifyToken: String
    verifyTokenExpiry: Date
    forgotPasswordToken: String
    forgotPasswordTokenExpiry: Date
  }

  type Data{
    data: String
  }

  type Doc {
    _id: ID!
    docId: String!
    email: [String!]
    data: JSON
    thumbnail: String!
  }
`;
