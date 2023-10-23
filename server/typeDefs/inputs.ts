import { gql } from "apollo-server-express";

export const inputs = gql`
  input docInput {
    docID: String!
    emailId: Email!
  }

  input userInput {
    emailId: Email!
    password: String!
  }
`;
