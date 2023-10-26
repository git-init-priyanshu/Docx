import { MutationResolvers } from "../../generatedGraphqlTypes/resolvers-types";
import { Doc, InterfaceDoc } from "../../models/doc";

export const createDoc: MutationResolvers["createDoc"] = async (
  _parent,
  args,
  _contextValue,
  _info
) => {
  const { docId, emailId } = args.data;
  try {
    // @Todo: Validate the user

    const doc = new Doc<InterfaceDoc>({
      docId,
      email: [emailId],
      data: { data: "" },
      thumbnail: "",
    });
    await doc.save();

    return true;
  } catch (error) {
    throw "Internal server error";
  }
};
