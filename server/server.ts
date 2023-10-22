import { connectToMongoDB } from "./db";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import { socketIO } from "./socket/index";

connectToMongoDB();
dotenv.config();

const app = express();
const httpServer = createServer(app);

// middlewares
app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: [
      process.env.VERCEL_URL,
      "http://localhost:80",
      "http://localhost:4173",
      "http://localhost:5173",
    ],
  },
});
socketIO(io, app);

// Available Routes
// app.use("/api/doc", require("./routes/docRoutes"));
// app.use("/api/auth", require("./routes/authRoutes"));

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(process.env.VERCEL_URL);
  console.log(`Server listening on ${PORT}`);
});
