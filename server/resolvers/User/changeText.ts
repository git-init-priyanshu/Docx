import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";

export const changeText: MutationResolvers["changeText"] = async (
  _parent: any,
  args: { docId: string; data: any; userEmail: string },
  contextValue: any,
  _info: any
) => {
  const { data, docId, userEmail } = args;
  try {
    contextValue.pubsub.publish("CHANGE_TEXT", {
      reflectChanges: data,
      docId,
      userEmail,
    });
    return true;
  } catch (error) {
    return false;
  }
};
