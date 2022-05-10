import { Resolvers } from "../../types";
import { protectResolver } from "../../users/user.utils";
import { processHashtags } from "../photos.utils";

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectResolver(
      async (_, { id, caption }, { client, loggedInUser }) => {
        const oldPhoto = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          select: {
            id: true,
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });

        if (!oldPhoto) {
          return {
            ok: false,
            error: "Photo not found.",
          };
        }

        const photo = await client.photo.update({
          where: {
            id: oldPhoto.id,
          },
          data: {
            caption,
            hashtags: {
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
            },
          },
        });

        return {
          ok: true,
          photo,
        };
      }
    ),
  },
};

export default resolvers;
