import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchUser: async (_, { keyword }, { client }) =>
      await client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(),
          },
        },
      }),
  },
};

export default resolvers;
