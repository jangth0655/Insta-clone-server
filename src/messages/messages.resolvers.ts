import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id }) =>
      client.room
        .findUnique({
          where: {
            id,
          },
        })
        .users(),
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
      }),
    unreadTotal: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return await client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
  Message: {
    users: ({ id }) =>
      client.message
        .findUnique({
          where: {
            id,
          },
        })
        .user(),
  },
};

export default resolvers;
