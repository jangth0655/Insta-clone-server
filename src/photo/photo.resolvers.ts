import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: async ({ userId }) => {
      return await client.user.findUnique({
        where: {
          id: userId,
        },
      });
    },
    hashtags: async ({ id }) => {
      return await client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      });
    },
    likes: async ({ id }) =>
      client.like.count({
        where: {
          photoId: id,
        },
      }),
    commentNumber: ({ id }) =>
      client.comment.count({
        where: {
          photoId: id,
        },
      }),
    isMine: ({ userId }, {}, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser?.id;
    },
    isLiked: async ({ id }, {}, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: {
          userId_photoId: {
            photoId: id,
            userId: loggedInUser.id,
          },
        },
        select: {
          id: true,
        },
      });
      if (ok) {
        return true;
      }
      return false;
    },
    comments: ({ id }, {}, {}) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        include: {
          user: true,
        },
      }),
  },
  Hashtag: {
    photos: async ({ id }, { page }) => {
      return await client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos();
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
