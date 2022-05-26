import { Resolvers } from "../../types";
import { protectResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectResolver(
      async (_, { offset }, { client, loggedInUser }) => {
        return await client.photo.findMany({
          take: 2,
          skip: offset,
          where: {
            OR: [
              {
                user: {
                  followers: {
                    some: {
                      id: loggedInUser.id,
                    },
                  },
                },
              },
              {
                userId: loggedInUser.id,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        });
      }
    ),
  },
};

export default resolvers;
