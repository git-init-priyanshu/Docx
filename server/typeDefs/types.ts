import { gql } from "apollo-server-express";

export const types = gql`
  type User {
    _id: ID!
    email: Email!
    isVerified: Boolean!
    isAdmin: Boolean!
    verifyToken: String!
    verifyTokenExpiry: Date!
    forgotPasswordToken: String!
    forgotPasswordTokenExpiry: Date!
  }

  type Data{
  }

  type Doc {
    _id: ID!
    docID: String!
    email: [User]
    data: Data!
    thumbnail: Url!
  }
`;
