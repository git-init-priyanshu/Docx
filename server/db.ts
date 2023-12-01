import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

export const connectToMongoDB = () => {
  mongoose.connect(mongoURI);

  const db = mongoose.connection;
  db.on("error", () => {
    console.log("Conenction Error");
  });
  db.once("open", () => {
    console.log("Connected to database successfully");
  });
};
