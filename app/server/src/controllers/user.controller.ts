import { TRPCError } from "@trpc/server";
import { Context } from "../server";
import {
  AddToFeaturedInput,
  UpdateUserInput,
  UserParamsInput,
} from "../schemas/user.schema";
import { addToFeatured, updateUser } from "../services/user.service";

export const getUserHandler = ({ ctx }: { ctx: Context }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }
  try {
    const user = ctx.user;
    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
};

export const updateUserHandler = async ({
  userParamsInput,
  input,
  ctx,
}: {
  userParamsInput: UserParamsInput;
  input: UpdateUserInput;
  ctx: Context;
}) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }
  try {
    const user = await updateUser({ email: userParamsInput.email }, input, {
      lean: true,
    });
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User doesn't exist",
      });
    }
    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "CONFLICT",
      message: error.message,
    });
  }
};

export const addToFeaturedHandler = async ({
  userParamsInput,
  input,
  ctx,
}: {
  userParamsInput: UserParamsInput;
  input: AddToFeaturedInput;
  ctx: Context;
}) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not authenticated",
    });
  }
  try {
    const featured = await addToFeatured(
      userParamsInput.email,
      input.propertyId
    );
    if (!featured) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property doesn't exist",
      });
    }
    return {
      status: "success",
      data: {
        featured,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "CONFLICT",
      message: error.message,
    });
  }
};
