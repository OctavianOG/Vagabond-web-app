import { TRPCError } from "@trpc/server";
import { PropertyState, PropertyType } from "../model/property.model";
import { Context } from "../server";
import { findUserById } from "../services/user.service";
import {
  CreatePropertyInput,
  ParamsInput,
  UpdatePropertyInput,
} from "../schemas/property.schema";
import {
  createProperty,
  getProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
  getPropertiesByAuthor,
} from "../services/property.services";

export const createPropertyHandler = async ({
  input,
  ctx,
}: {
  input: CreatePropertyInput;
  ctx: Context;
}) => {
  try {
    const userId = ctx.user!.id;
    const user = await findUserById(userId);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in,to create property",
      });
    }
    const property = await createProperty({
      type: input.type as PropertyType,
      state: input.state as PropertyState,
      price: input.price,
      address: input.address,
      area: input.area,
      rooms: input.rooms,
      floor: input.floor,
      images: input.images,
      author: {
        email: user?.email,
        name: user?.name,
        surname: user?.surname,
        phonenumber: user?.phonenumber,
      },
      info: input.info,
    });

    return {
      status: "success",
      data: {
        property,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "CONFLICT",
      message: error.message,
    });
  }
};

export const getPropertyHandler = async ({
  paramsInput,
}: {
  paramsInput: ParamsInput;
}) => {
  try {
    const property = await getProperty(
      { _id: paramsInput.propertyId },
      { lean: true }
    );

    if (!property) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property doesn't exist",
      });
    }

    return {
      status: "success",
      data: {
        property,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error.message,
    });
  }
};

export const getPropertiesHandler = async () => {
  try {
    const properties = await getAllProperties();

    return {
      status: "success",
      data: {
        properties,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
};

export const getPropertiesByAuthorHandler = async (input: {
  email: string;
}) => {
  try {
    const properties = await getPropertiesByAuthor(input.email);
    return {
      status: "success",
      data: {
        properties,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
};

export const updatePropertyHandler = async ({
  paramsInput,
  input,
}: {
  paramsInput: ParamsInput;
  input: UpdatePropertyInput;
}) => {
  try {
    const property = await updateProperty(
      { _id: paramsInput.propertyId },
      input,
      {
        lean: true,
      }
    );
    if (!property) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property doesn't exist",
      });
    }

    return {
      status: "success",
      data: {
        property,
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "CONFLICT",
      message: error.message,
    });
  }
};

export const deletePropertyHandler = async ({
  paramsInput,
}: {
  paramsInput: ParamsInput;
}) => {
  try {
    const property = await deleteProperty(
      { _id: paramsInput.propertyId },
      { lean: true }
    );

    if (!property) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Property doesn't exist",
      });
    }

    return {
      status: "success",
      data: null,
    };
  } catch (error) {
    throw new TRPCError({
      code: "CONFLICT",
      message: error.message,
    });
  }
};
