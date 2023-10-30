import { connectToMongoDB } from "./db";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

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

const PORT = 8000;

(async () => {
  // @Todo: Set the context value of token
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Graphql server ready at: ${url}graphql`);
})();

httpServer.listen(PORT, () => {
  console.log(`🚀  Server ready at: http://localhost:${PORT}`);
});

// (async () => {
//   await server.start();
//   server.applyMiddleware({ app });

//   const PORT = 4000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server listening on: http://localhost:${PORT}/graphql`);
//   });
// })();
