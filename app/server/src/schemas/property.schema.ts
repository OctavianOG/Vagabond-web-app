import { number, object, string, TypeOf, array } from "zod";

export const createPropertySchema = object({
  type: string({ required_error: "Type of property is required" }),
  state: string({ required_error: "State of property is required" }),
  price: string({ required_error: "Price is required" }),
  address: string({ required_error: "Address is required" }),
  area: string({ required_error: "Area of property is required" }),
  rooms: string({ required_error: "Quantity of rooms is required" }),
  floor: string({ required_error: "Floor is required" }),
  images: string({ required_error: "Images of property are required" }).array(),
  info: string().optional(),
});

export const params = object({
  propertyId: string(),
});

export const getPropertiesByAuthorSchema = object({
  email: string().email(),
});

export const updatePropertySchema = object({
  params,
  body: object({
    type: string().optional(),
    state: string().optional(),
    price: string().optional(),
    address: string().optional(),
    area: string().optional(),
    rooms: string().optional(),
    floor: string().optional(),
    images: string({ required_error: "Images of property are required" })
      .array()
      .optional(),
    info: string().optional(),
  }),
});

export type CreatePropertyInput = TypeOf<typeof createPropertySchema>;
export type ParamsInput = TypeOf<typeof params>;
export type UpdatePropertyInput = TypeOf<typeof updatePropertySchema>["body"];
