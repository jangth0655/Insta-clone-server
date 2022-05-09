import * as bcrypt from "bcrypt";
import { protectResolver } from "../user.utils";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectResolver(
      async (
        _: any,
        { firstName, lastName, username, email, password: newPassword },
        { loggedInUser, client }
      ) => {
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
            ...(uglyPassword && { password: uglyPassword }),
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
