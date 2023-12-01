import { gql } from "@apollo/client";

export const CREATE_DOC_MUTATION = gql`
  mutation CreateDoc($data: docInput!) {
    createDoc(data: $data)
  }
`;

export const ADD_DOC_MUTATION = gql`
  mutation AddDoc($data: docInput!) {
    addDoc(data: $data)
  }
`;

export const SAVE_THUMBNAIL_MUTATION = gql`
  mutation SaveThumbnail($docId: String!, $thumbnail: String!) {
    saveThumbnail(docId: $docId, thumbnail: $thumbnail)
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($data: userInput!) {
    login(data: $data) {
      success
      token
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($data: userInput!) {
    signup(data: $data) {
      success
      token
    }
  }
`;

export const SAVE_DOC_MUTATION = gql`
  mutation SaveDoc($docId: String!, $data: JSON!) {
    saveDoc(docId: $docId, data: $data)
  }
`;

export const CHANGE_TEXT_MUTATION = gql`
  mutation ChangeText($docId: String!, $userEmail: String!, $data: JSON!) {
    changeText(docId: $docId, userEmail: $userEmail, data: $data)
  }
`;
