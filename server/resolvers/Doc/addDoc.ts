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

  if(doc.email.includes(emailId)) throw new Error("Doc already exists.")

  // Updating doc
  try {
    const emailArray = doc.email;
    emailArray.push(emailId);

    await Doc.findOneAndUpdate(
      { docId },
      { email: emailArray, isShared: true }
    );

    return true;
  } catch (error) {
    throw "Internal server error";
  }
};
