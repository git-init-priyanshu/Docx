import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc } from "../../models/doc";

export const changeDocName: MutationResolvers["changeDocName"] = async (
  _parent: any,
  args: any,
  _contextValue: any,
  _info: any
) => {
  const { docId, userEmail, newDocName } = args;
  const doc = await Doc.findOne({ docId });
console.log("here")
  if (!doc.email.includes(userEmail)) throw new Error("Not Authorized");

  // Updating doc
  try {
    await Doc.findOneAndUpdate({ docId }, { name: newDocName });

    return true;
  } catch (error) {
    throw "Internal server error";
  }
};
