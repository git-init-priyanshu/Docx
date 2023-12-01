import { gql } from "apollo-server-express";

export const inputs = gql`
  input docInput {
    docId: String!
    emailId: String!
  }

  input userInput {
    emailId: String!
    password: String!
  }
`;
