import { Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectResolver(
      async (_, { username }, { client, loggedInUser }) => {
        try {
          const ok = await client.user.findFirst({
            where: {
              username,
            },
            select: {
              id: true,
            },
          });
          if (!ok) {
            return {
              ok: false,
              error: "Could not found username",
            };
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                connect: {
                  username,
                },
              },
            },
          });
          return {
            ok: true,
          };
        } catch (e) {
          console.log(e);
          return {
            ok: false,
            error: `Could not following ${e}`,
          };
        }
      }
    ),
  },
};

export default resolvers;
