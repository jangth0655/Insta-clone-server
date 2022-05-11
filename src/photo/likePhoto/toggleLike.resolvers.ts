import { Resolvers } from "../../types";
import { protectResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    toggleLike: protectResolver(async (_, { id }, { client, loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
        },
      });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found.",
        };
      }
      const likeWhere = {
        userId_photoId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      };
      const like = await client.like.findUnique({
        where: likeWhere,
        select: {
          id: true,
        },
      });
      if (like) {
        await client.like.delete({
          where: likeWhere,
        });
      } else {
        await client.like.create({
          data: {
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            photo: {
              connect: {
                id: photo.id,
              },
            },
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};

export default resolvers;
