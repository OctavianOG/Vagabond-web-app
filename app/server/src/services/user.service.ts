import { omit } from "lodash";
import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import UserModel, { User } from "../model/user.model";
import customConfig from "../config/default";
import { signJwt } from "../utils/jws";
import redisClient from "../utils/connectRedis";

export const excludedFields = ["password"];

export const createUser = async (input: Partial<User>) => {
  const user = await UserModel.create(input);
  return omit(user.toJSON(), excludedFields);
};

export const findUserById = async (id: string) => {
  return await UserModel.findById(id).lean();
};

export const findAllUsers = async () => {
  return await UserModel.find();
};

export const findUserByField = async (
  query: FilterQuery<User>,
  options: QueryOptions = {}
) => {
  return await UserModel.findOne(query, {}, options).select("+password");
};

export const updateUser = async (
  query: FilterQuery<User>,
  update: UpdateQuery<User>,
  options: QueryOptions
) => {
  return await UserModel.findOneAndUpdate(query, { $set: update }, options);
};

export const addToFeatured = async (email: string, propertyId: string) => {
  const query = { email: email };

  const user = await UserModel.findOne(query);

  if (user) {
    const featuredIndex = user.featured.indexOf(propertyId);

    if (featuredIndex === -1) {
      user.featured.push(propertyId);
    } else {
      user.featured.splice(featuredIndex, 1);
    }

    return await user.save();
  }

  return null;
};

export const signToken = async (user: DocumentType<User>) => {
  const userId = user._id.toString();

  const access_token = signJwt({ sub: userId }, "accessTokenPrivateKey", {
    expiresIn: `${customConfig.accessTokenExpiresIn}m`,
  });

  const refresh_token = signJwt({ sub: userId }, "refreshTokenPrivateKey", {
    expiresIn: `${customConfig.refreshTokenExpiresIn}m`,
  });

  redisClient.set(userId, JSON.stringify(user), {
    EX: 60 * 60,
  });

  return { access_token, refresh_token };
};
