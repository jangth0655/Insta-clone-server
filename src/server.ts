import { getUser } from "./users/user.utils";
import "dotenv/config";
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import client from "./client";

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      client,
    };
  },
});

const PORT = process.env.PORT;

server
  .listen()
  .then(() =>
    console.log(`🚀 Server is running on http://localhost:${PORT}/ ✅`)
  );
