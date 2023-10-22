import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DocSchema = new Schema({
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

export const Doc = model("Doc", DocSchema);
