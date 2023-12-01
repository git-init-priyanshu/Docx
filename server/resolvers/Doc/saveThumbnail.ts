import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc } from "../../models/doc";

export const saveThumbnail: MutationResolvers["saveThumbnail"] = async (
  _parent,
  args,
  _contextValue,
  _info
) => {
  try {
    const { docId, thumbnail } = args;

    await Doc.findOneAndUpdate({ docId }, { thumbnail });
    return true;
  } catch (error) {
    throw "Internal server error";
  }
};
