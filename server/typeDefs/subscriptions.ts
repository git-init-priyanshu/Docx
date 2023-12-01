import { gql } from "apollo-server-express";

export const subscriptions = gql`
  type Subscription {
    subscribeToDoc: Doc!
    reflectChanges(docId: String!, userEmail: String!): JSON!
  }
`;
