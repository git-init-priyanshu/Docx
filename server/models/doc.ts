import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

export interface InterfaceDoc {
  name: string;
  docId: string;
  email: [string];
  data: object;
  thumbnail: string;
  creator: string;
  createdAt: Date;
  isShared: boolean;
}

const DocSchema = new Schema<InterfaceDoc>({
  name: {
    type: String,
    required: true,
  },
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
  creator: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  isShared: {
    type: Boolean,
  }
});

export const Doc = model<InterfaceDoc>("Doc", DocSchema);
