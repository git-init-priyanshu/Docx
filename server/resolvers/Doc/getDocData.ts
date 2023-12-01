import { Doc } from "../../models/doc";

import { QueryResolvers } from "../../generatedGraphqlTypes/resolvers-types";

export const getDocData: QueryResolvers["getDocData"] = async (
  _parent,
  args,
  contextValue,
  _info
) => {
  const { docId } = args;

  if (docId === null) return;
  const doc = await Doc.findOne({ docId });
  if (!doc) throw new Error("Doc not found");
  return doc;
};
