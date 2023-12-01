import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc } from "../../models/doc";

export const addDoc: MutationResolvers["addDoc"] = async (
  _parent: any,
  args: any,
  _contextValue: any,
  _info: any
) => {
  const { docId, emailId } = args.data;
  const doc = await Doc.findOne({ docId });

  // @Todo: Check if the doc already exist for the user

  // Updating doc
  try {
    const emailArray = doc.email;
    emailArray.push(emailId);

    await Doc.findOneAndUpdate({ docId }, { email: emailArray });

    return true;
  } catch (error) {
    throw "Internal server error";
  }
};
