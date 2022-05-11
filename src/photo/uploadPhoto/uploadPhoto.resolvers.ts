import { uploadToS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../users/user.utils";
import { processHashtags } from "../photos.utils";
import { Resolvers } from "./../../types.d";

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectResolver(
      async (_, { file, caption }, { client, loggedInUser }) => {
        let hashtagsObj = null;
        if (caption) {
          hashtagsObj = processHashtags(caption);
        }
        const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
        return client.photo.create({
          data: {
            file: fileUrl,
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
