require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

const connectToMongoDB = () => {
  mongoose.connect(mongoURI);

  const db = mongoose.connection;
  db.on("error", () => {
    console.log("Conenction Error");
  });
  db.once("open", () => {
    console.log("Connected to database successfully");
  });
};

module.exports = connectToMongoDB;