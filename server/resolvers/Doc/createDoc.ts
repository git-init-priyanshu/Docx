import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc, InterfaceDoc } from "../../models/doc";
import { User } from "../../models/users";

export const createDoc: MutationResolvers["createDoc"] = async (
  _parent,
  args,
  _contextValue,
  _info
) => {
  const { docId, emailId, docName } = args;
  try {
    const user = await User.find({ email: emailId });
    if (!user) throw new Error("Not Authorized");

    const doc = new Doc<InterfaceDoc>({
      name: docName,
      docId,
      email: [emailId],
      data: { data: "" },
      thumbnail: "",
      createdAt: new Date(),
      isShared: false,
    });
    await doc.save();

    return true;
  } catch (error) {
    throw "Internal server error";
  }
};
