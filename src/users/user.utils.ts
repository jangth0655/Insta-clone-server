import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

type Token = {
  id: number;
};

export const getUser = async (token: string) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = (await jwt.verify(token, process.env.SECRET_KEY)) as Token;
    const user = await client.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const protectResolver =
  (resolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Log in pls",
        };
      }
    }
    return resolver(root, args, context, info);
  };
