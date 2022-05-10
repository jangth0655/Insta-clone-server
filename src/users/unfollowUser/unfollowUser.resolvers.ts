import { Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectResolver(
      async (_, { username }, { client, loggedInUser }) => {
        const ok = await client.user.findUnique({
          where: {
            username,
          },
          select: { id: true },
        });
        if (!ok) {
          return {
            ok: false,
            error: "Can't unfollow user",
          };
        }
        await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            following: {
              disconnect: {
                username,
              },
            },
          },
        });
        return {
          ok: true,
        };
      }
    ),
  },
};

export default resolvers;
