const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// const { Doc } = require("./doc");

const User = new Schema({
  email: {
    type: Object,
  },
  password: {
    type: String,
  },
  docs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doc",
    },
  ],
});

module.exports = model("User", User);
