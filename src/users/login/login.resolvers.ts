import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }, { client }) => {
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
        console.log("error");
        console.log(e);
        return;
      }
    },
  },
};

export default resolvers;
