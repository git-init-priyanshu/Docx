import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc } from "../../models/doc";

export const deleteEmail: MutationResolvers["deleteEmail"] = async (
  _parent: any,
  args: { docId: string; deleteEmail: string; userEmail: string },
  _contextValue: any,
  _info: any
) => {
  const { deleteEmail, docId, userEmail } = args;
  try {
    if (userEmail === deleteEmail) throw new Error("Internal Server Error");

    const doc = await Doc.findOne({ docId });
    if (doc.creator !== userEmail) throw new Error("Not Authorized");

    let emails = doc.email;
    if (!emails.includes(deleteEmail)) throw new Error("Cannot be removed");

    const index = emails.indexOf(deleteEmail);
    emails.splice(index, 1);

    let isShared = true;
    if (emails.length === 1) isShared = false;

    await Doc.findOneAndUpdate({ docId }, { email: emails, isShared });
    return true;
  } catch (error) {
    return false;
  }
};
