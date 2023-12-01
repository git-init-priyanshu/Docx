import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

export interface InterfaceDoc {
  docId: string;
  email: [string];
  data: object;
  thumbnail: string;
}

const DocSchema = new Schema<InterfaceDoc>({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: [String],
    required: true,
  },
  data: {
    type: Object,
  },
  thumbnail: {
    type: String,
  },
});

export const Doc = model<InterfaceDoc>("Doc", DocSchema);
