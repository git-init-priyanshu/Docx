const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const User = new Schema({
  email: {
    type: Object,
  },
  password: {
    type: String,
  },
});

module.exports = model("User", User);
