import client from "../../client";

export default {
  Query: {
    seeProfile: (_, { username }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          followers: {
            select: {
              username: true,
              id: true,
            },
          },
          following: {
            select: {
              username: true,
              id: true,
            },
          },
        },
      }),
  },
};
