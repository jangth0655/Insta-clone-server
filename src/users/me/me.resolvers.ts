import { Resolvers } from "../../types";
import { protectResolver } from "../user.utils";

const resolvers: Resolvers = {
  Query: {
    me: protectResolver((_, {}, { loggedInUser, client }) =>
      client.user.findUnique({
        where: {
          id: loggedInUser.id,
        },
      })
    ),
  },
};

export default resolvers;
