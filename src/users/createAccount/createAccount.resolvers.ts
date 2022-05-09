import * as bcrypt from "bcrypt";
import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                email,
              },
              {
                username,
              },
            ],
          },
          select: {
            id: true,
          },
        });
        if (existingUser) {
          throw new Error("this username is already taken.");
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return user;
      } catch (e) {
        throw new Error(`find ${e}`);
      }
    },
  },
};

export default resolvers;
