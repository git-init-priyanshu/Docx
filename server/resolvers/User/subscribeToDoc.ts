import { withFilter } from "graphql-subscriptions";

import { SubscriptionResolvers } from "../../generatedGraphqlTypes/resolvers-types";

export const subscribeToDoc: SubscriptionResolvers["subscribeToDoc"] = {
  // @ts-ignore
  subscribe: withFilter(
    (_parent, _args, contextValue, _info) => {
      return contextValue.pubsub.asyncIterator(["SUBSCRIBE_DOC"]);
    },
    (payload) => {
      return payload?.docData.doc;
    }
  ),
};
