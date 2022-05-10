import { protectResolver } from "../../users/user.utils";
import { processHashtags } from "../photos.utils";
import { Resolvers } from "./../../types.d";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectResolver(
      async (_, { file, caption }, { client, loggedInUser }) => {
        let hashtagsObj = null;
        if (caption) {
          processHashtags(caption);
        }

        return client.photo.create({
          data: {
            file,
            caption,
            ...(hashtagsObj.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagsObj,
              },
            }),
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
          },
        });
      }
    ),
  },
};

export default resolvers;
