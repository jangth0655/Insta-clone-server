import client from "../client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export default {
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
    login: async (_, { username, password }) => {
      try {
        const user = await client.user.findFirst({
          where: { username },
          select: { id: true, password: true, username: true, email: true },
        });
        if (!user) {
          return {
            ok: false,
            error: "User not found.",
          };
        }
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          return {
            ok: false,
            error: "Incorrect Password",
          };
        }
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return {
          ok: true,
          token,
        };
      } catch (e) {
        console.log(e);
        return;
      }
    },
  },
};
