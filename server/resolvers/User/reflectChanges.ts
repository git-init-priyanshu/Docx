import { withFilter } from "graphql-subscriptions";

import { SubscriptionResolvers } from "../../generatedGraphqlTypes/resolvers-types";

export const reflectChanges: SubscriptionResolvers["reflectChanges"] = {
  // @ts-ignore
  subscribe: withFilter(
    (_parent, _args, contextValue, _info) => {
      return contextValue.pubsub.asyncIterator(["CHANGE_TEXT"]);
    },
    (payload, variables) => {
      return payload.docId === variables.docId;
    }
  ),
};
