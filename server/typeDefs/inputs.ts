import { gql } from "apollo-server-express";

export const inputs = gql`
  input docInput {
    docId: String!
    emailId: String!
  }

  input signupInput {
    firstName: String!
    lastName: String!
    emailId: String!
    password: String!
  }

  input loginInput {
    emailId: String!
    password: String!
  }
`;
