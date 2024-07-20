import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import PropertyModel, { Property } from "../model/property.model";

export const createProperty = async (input: Partial<Property>) => {
  return PropertyModel.create(input);
};

export const getProperty = async (
  query: FilterQuery<Property>,
  options: QueryOptions
) => {
  return await PropertyModel.findOne(query, {}, options);
};

export const getPropertiesByAuthor = async (email: string) => {
  return await PropertyModel.find({ "author.email": email });
};

export const getAllProperties = async () => {
  return await PropertyModel.find();
};

export const updateProperty = async (
  query: FilterQuery<Property>,
  update: UpdateQuery<Property>,
  options: QueryOptions
) => {
  return await PropertyModel.findOneAndUpdate(query, update, options);
};

export const deleteProperty = async (
  query: FilterQuery<Property>,
  options: QueryOptions
) => {
  return PropertyModel.findOneAndDelete(query, options);
};
