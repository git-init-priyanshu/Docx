import { gql } from "apollo-server-express";

export const mutations = gql`
  type Mutation {
    createDoc(docId: String!, emailId: String!, docName: String!): Boolean!
    addDoc(data: docInput): Boolean!
    saveThumbnail(docId: String!, thumbnail: String!): Boolean!
    saveDoc(docId: String!, data: JSON!): Boolean!
    changeText(docId: String!, userEmail: String!, data: JSON!): Boolean!
    changeDocName(docId: String!, userEmail: String!, newDocName: String!): Boolean!

    login(data: userInput!): userOutput!
    signup(data: userInput!): userOutput!
  }
`;
