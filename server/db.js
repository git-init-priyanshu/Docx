require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

const connectToMongoDB = () => {
  mongoose.connect(mongoURI);
};

module.exports = connectToMongoDB;
