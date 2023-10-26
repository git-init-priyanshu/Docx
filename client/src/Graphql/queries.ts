import { gql } from "@apollo/client";

export const GET_ALL_DOCS_QUERY = gql`
  query GetAllDocs($token: String) {
    getAllDocs(token: $token) {
      _id
      thumbnail
    }
  }
`;

export const FIND_USER_QUERY = gql`
  query FindUser($token: String) {
    findUser(token: $token)
  }
`;
