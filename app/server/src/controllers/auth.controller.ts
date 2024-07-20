import { TRPCError } from "@trpc/server";
import { CookieOptions } from "express";
import customConfig from "../config/default";
import { Context } from "../server";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import {
  createUser,
  findUserByField,
  findUserById,
  signToken,
} from "../services/user.service";
import redisClient from "../utils/connectRedis";
import { signJwt, verifyJwt } from "../utils/jws";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

const accessTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(Date.now() + customConfig.accessTokenExpiresIn * 60 * 1000),
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  expires: new Date(
    Date.now() + customConfig.refreshTokenExpiresIn * 60 * 1000
  ),
};

export const registerHandler = async ({
  input,
}: {
  input: CreateUserInput;
}) => {
  try {
    const user = await createUser({
      email: input.email,
      password: input.password,
      name: input.name,
      surname: input.surname,
      phonenumber: input.phonenumber,
    });
    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "This email address already registered!",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while registering the user.",
    });
  }
};

export const loginHandler = async ({
  input,
  ctx,
}: {
  input: LoginUserInput;
  ctx: Context;
}) => {
  try {
    const user = await findUserByField({ email: input.email });

    if (
      !user ||
      !(await user.comparePasswords(user.password, input.password))
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Wrong email or password",
      });
    }

    const { access_token, refresh_token } = await signToken(user);

    ctx.res.cookie("access_token", access_token, accessTokenCookieOptions);
    ctx.res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    ctx.res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });
    return {
      status: "success",
      access_token,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while logging in.",
    });
  }
};

export const refreshAccessTokenHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const refresh_token = ctx.req.cookies.refresh_token as unknown as string;
    const message = "Couldn't refresh access token";

    if (!refresh_token) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    const decodedToken = verifyJwt<{ sub: string }>(
      refresh_token,
      "refreshTokenPublicKey"
    );

    if (!decodedToken) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    const sessionValidation = await redisClient.get(decodedToken.sub);
    if (!sessionValidation) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    const user = await findUserById(JSON.parse(sessionValidation)._id);

    if (!user) {
      throw new TRPCError({ code: "FORBIDDEN", message });
    }

    const access_token = signJwt({ sub: user?._id }, "accessTokenPrivateKey", {
      expiresIn: `${customConfig.accessTokenExpiresIn}m`,
    });

    ctx.res.cookie("access_token", access_token, accessTokenCookieOptions);
    ctx.res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return {
      status: "success",
      access_token,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while refreshing the access token.",
    });
  }
};

const logout = ({ ctx }: { ctx: Context }) => {
  ctx.res.cookie("access_token", "", { maxAge: -1 });
  ctx.res.cookie("refresh_token", "", { maxAge: -1 });
  ctx.res.cookie("logged_in", "", { maxAge: -1 });
};

export const logoutHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const user = ctx.user;
    await redisClient.del(user?._id.toString());
    logout({ ctx });
    return { status: "success" };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An error occurred while logging out.",
    });
  }
};
