import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, page }, { client }) => {
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
      const followers = await client.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          followers: {
            select: {
              username: true,
              id: true,
              avatar: true,
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
          },
        },
      });
      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: {
              username,
            },
          },
        },
      });

      return {
        ok: true,
        followers,
        totalPage: Math.ceil(totalFollowers / 5),
      };
    },
  },
};

export default resolvers;
