import { gql } from "apollo-server-express";

export const queries = gql`
  type Query {
    getAllDocs(token: String): [Doc!]
    findUser(token: String): Boolean!
  }
`;
