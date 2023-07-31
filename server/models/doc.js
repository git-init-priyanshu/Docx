const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const Doc = new Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
  },
  thumbnail: {
    type: String,
  },
});

module.exports = model("Doc", Doc);
