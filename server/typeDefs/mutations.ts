import { gql } from "apollo-server-express";

export const mutations = gql`
  type Mutation {
    createDoc(data: docInput): Boolean!
    addDoc(data: docInput): Boolean!
    saveThumbnail(docId: String!, thumbnail: String!): Boolean!

    login(data: userInput!): Boolean!
    signup(data: userInput!): Boolean!
  }
`;
