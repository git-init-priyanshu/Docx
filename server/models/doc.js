const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const Doc = new Schema({
  docId: {
    type: String,
    required: true,
    unique: true,
  },
  data: {
    type: Object,
  },
});

module.exports = model("Doc", Doc);
