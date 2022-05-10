import "dotenv/config";
import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";

import { getUser } from "./users/user.utils";
import schema, { typeDefs, resolvers } from "./schema";
import client from "./client";

import * as logger from "morgan";

const PORT = process.env.PORT;

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });

  await server.start();
  const app = express();
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads"));
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise<void>((r) => app.listen({ port: PORT }, r));
  console.log(
    `🚀 Server is running on http://localhost:${PORT}${server.graphqlPath} ✅`
  );
};

startServer();
