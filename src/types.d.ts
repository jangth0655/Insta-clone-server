import { PrismaClient, User } from "@prisma/client";

export type Resolver = (
  root: any,
  args: any,
  context: Context,
  info: any
) => any;

export type Context = {
  loggedInUser?: User;
  client?: PrismaClient;
};

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};
