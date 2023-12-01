import { QueryResolvers } from "../../generatedGraphqlTypes/resolvers-types";

export const changeText: QueryResolvers["changeText"] = async (
  _parent: any,
  args: { docId: string; data: any },
  contextValue: any,
  _info: any
) => {
  const { docId, data } = args;
  try {
    contextValue.pubsub.publish("CHANGE_TEXT", { reflectChanges: data, docId });
    return true;
  } catch (error) {
    return false;
  }
};
