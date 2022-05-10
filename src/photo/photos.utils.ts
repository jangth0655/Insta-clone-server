export const processHashtags = (caption: any) => {
  const hashtags = caption.match(/#[\w]+/g);
  return hashtags?.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
