import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc } from "../../models/doc";

export const saveDoc: MutationResolvers["saveDoc"] = async (
  _parent: any,
  args: any,
  _contextValue: any,
  _info: any
) => {
  const { docId, data } = args;
  try {
    if (!docId) return;
    await Doc.findOneAndUpdate({ docId }, { data });
    return true;
  } catch (error) {
    return false;
  }
};
