import { gql } from "apollo-server-express";

export const mutations = gql`
  type Mutation {
    createDoc(data: docInput): Boolean!
    addDoc(data: docInput): Boolean!
    saveThumbnail(docId: String!, thumbnail: String!): Boolean!
    saveDoc(docId: String!, data: JSON!): Boolean!
    changeText(docId: String!, userEmail: String!, data: JSON!): Boolean!

    login(data: userInput!): userOutput!
    signup(data: userInput!): userOutput!
  }
`;
