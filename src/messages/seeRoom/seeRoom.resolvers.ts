import { Resolvers } from "../../types";
import { protectResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectResolver(async (_, { id }, { loggedInUser, client }) => {
      return await client.room.findFirst({
        where: {
          id,
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      });
    }),
  },
};

export default resolvers;
