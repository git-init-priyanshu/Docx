import { connectToMongoDB } from "./db";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { startStandaloneServer } from "@apollo/server/standalone";

import { socketIO } from "./socket/index";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();
  server.applyMiddleware({ app });
  
  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on: http://localhost:${PORT}/graphql`);
  });
};
startServer();

process.on('warning', e => console.warn(e.stack));
