import { gql } from "apollo-server-express";

export const queries = gql`
  type Query {
    getAllDocs(emailId: Email!, token: String): [Doc!]
    findUser(token: String): Boolean!
  }
`;
