import { gql } from "@apollo/client";

export const SUB_TO_DOC_SUBSCRIPTION = gql`
  subscription SubscribeToDoc {
    subscribeToDoc {
      data
    }
  }
`;

export const REFLECT_CHANGES_SUBSCRIPTION = gql`
  subscription ReflectChanges($docId: String!, $userEmail: String!) {
    reflectChanges(docId: $docId, userEmail: $userEmail)
  }
`;
