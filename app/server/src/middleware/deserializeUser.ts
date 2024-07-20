import { TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import redisClient from "../utils/connectRedis";
import { findUserById } from "../services/user.service";
import { verifyJwt } from "../utils/jws";

export const deserializeUser = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  try {
    let access_token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      return {
        req,
        res,
        user: null,
      };
    }

    const decodedToken = verifyJwt<{ sub: string }>(
      access_token,
      "accessTokenPublicKey"
    );

    if (!decodedToken) {
      return {
        req,
        res,
        user: null,
      };
    }

    const sessionValidation = await redisClient.get(decodedToken.sub);

    if (!sessionValidation) {
      return {
        req,
        res,
        user: null,
      };
    }

    const user = await findUserById(JSON.parse(sessionValidation)._id);

    if (!user) {
      return {
        req,
        res,
        user: null,
      };
    }

    return {
      req,
      res,
      user: { ...user, id: user._id.toString() },
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid JSON data",
      });
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error occurred",
      });
    }
  }
};
