import { gql } from "@apollo/client";

export const GET_ALL_DOCS_QUERY = gql`
  query GetAllDocs($token: String) {
    getAllDocs(token: $token) {
      _id
      name
      docId
      email
      thumbnail
      createdAt
      isShared
    }
  }
`;

export const FIND_USER_QUERY = gql`
  query FindUser($token: String) {
    findUser(token: $token)
  }
`;

export const GET_DOC_DATA_QUERY = gql`
  query GetDocData($docId: String!) {
    getDocData(docId: $docId) {
      data
    }
  }
`;
