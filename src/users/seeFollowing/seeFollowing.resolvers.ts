import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }, { client }) => {
      const existUser = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!existUser) {
        return {
          ok: false,
          error: "Could not found username.",
        };
      }
      const pageSize = 5;
      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: pageSize,
          skip: lastId ? 1 : 0,
          ...(lastId && { cursor: { id: lastId } }),
        });
      /* const following = await client.user.findUnique({
        where: {
          username,
        },
        select: {
          following: {
            take: pageSize,
            skip: lastId ? 1 : 0,
            ...(lastId && { cursor: { id: lastId } }),
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      }); */
      return {
        ok: true,
        following,
      };
    },
  },
};

export default resolvers;
