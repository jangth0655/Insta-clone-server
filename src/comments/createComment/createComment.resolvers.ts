import { Resolvers } from "../../types";
import { protectResolver } from "../../users/user.utils";

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectResolver(
      async (_, { photoId, payload }, { client, loggedInUser }) => {
        const ok = await client.photo.findUnique({
          where: {
            id: photoId,
          },
          select: {
            id: true,
          },
        });
        if (!ok) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }
        const newComment = await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photoId,
              },
            },
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
        return {
          ok: true,
          id: newComment.id,
        };
      }
    ),
  },
};

export default resolvers;
