import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

import { createServer } from "http";

import { getUser } from "./users/user.utils";
import schema, { typeDefs, resolvers } from "./schema";
import client from "./client";
//import * as logger from "morgan";

const PORT = process.env.PORT;

const app = express();
const httpServer = createServer(app);
app.use("/static", express.static("uploads"));
app.use(graphqlUploadExpress());
//app.use(logger("tiny"));

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer(
  {
    schema,
    context: async ({ connectionParams: { token } }) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedInUser = await getUser(token as string);
      return { loggedInUser };
    },
    onConnect: async (ctx) => {
      const { token } = ctx.connectionParams;
      if (!token) {
        throw new Error("You can't listen.");
      }
    },
  },
  wsServer
);

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token as any),
          client,
        };
      }
    },
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
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

  await apollo.start();
  apollo.applyMiddleware({ app });

  httpServer.listen(PORT);
  console.log(
    `🚀 Server is running on http://localhost:${PORT}${apollo.graphqlPath} ✅`
  );
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}${apollo.graphqlPath}`
  );
};

startServer();
