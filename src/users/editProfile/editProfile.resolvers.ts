import * as bcrypt from "bcrypt";
import { protectResolver } from "../user.utils";
import { Resolvers } from "../../types";
import { GraphQLUpload } from "graphql-upload";
import { ReadStream, WriteStream, createWriteStream } from "fs";

const resolvers: Resolvers = {
  Upload: GraphQLUpload as any,

  Mutation: {
    editProfile: protectResolver(
      async (
        _: any,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser, client }
      ) => {
        let avatarUrl = null;
        if (avatar) {
          const { filename, createReadStream } = await avatar;
          const newFilename = `${
            loggedInUser.id
          } - ${Date.now()} - ${filename}`;
          const readSteam: ReadStream = createReadStream();
          const writeStream: WriteStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readSteam.pipe(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFilename}`;
        }

        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updateUser = await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
          },
        });
        if (updateUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "Could not update profile.",
          };
        }
      }
    ),
  },
};

export default resolvers;
