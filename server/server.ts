import express from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

import { connectToMongoDB } from "./db";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

connectToMongoDB();
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Whole code is copied from https://www.apollographql.com/docs/apollo-server/data/subscriptions
export const pubsub = new PubSub();
(async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async () => {
        return { pubsub };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      // Passing pubsub as a context value
      context: async () => {
        return { pubsub };
      },
    })
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
})();
