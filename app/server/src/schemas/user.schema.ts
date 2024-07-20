import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Invalid email")
    .trim()
    .toLowerCase(),
  password: string({ required_error: "Password is required" })
    .trim()
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string({
    required_error: "Please, confirm your password",
  }).trim(),
  name: string({ required_error: "Name is required" }).trim(),
  surname: string({ required_error: "Surname is required" }).trim(),
  phonenumber: string({ required_error: "Phone number is required" })
    .length(13, "Phone number must be 12 digits only")
    .regex(/^[\d+]+$/, {
      message: "Only plus at the beginning and numbers are allowed",
    })
    .transform(
      (val) =>
        `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 9)}-${val.slice(
          9,
          11
        )}-${val.slice(11)}`
    ),
  info: string()
    .max(500, "Info must be less than or equal to 500 characters")
    .optional(),
  profilepic: string().optional(),
  featured: string().array().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords don't match",
});

export const loginUserSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Wrong email or password")
    .trim()
    .toLowerCase(),
  password: string({ required_error: "Password is required" })
    .trim()
    .min(8, "Wrong email or password"),
});

export const userParams = object({
  email: string().email(),
});

export const updateUserSchema = object({
  userParams,
  body: object({
    password: string()
      .trim()
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    passwordConfirm: string().trim(),
    name: string().trim(),
    surname: string().trim(),
    phonenumber: string()
      .length(13, "Phone number must be 12 digits only")
      .regex(/^[\d+]+$/, {
        message: "Only plus at the beginning and numbers are allowed",
      })
      .transform(
        (val) =>
          `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 9)}-${val.slice(
            9,
            11
          )}-${val.slice(11)}`
      ),
    info: string()
      .max(500, "Info must be less than or equal to 500 characters")
      .optional(),
    profilepic: string(),
    featured: string().array(),
  }).partial(),
}).refine((data) => data.body.password === data.body.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords don't match",
});

export const addToFeaturedSchema = object({
  userParams,
  body: object({
    propertyId: string(),
  }),
});

export type AddToFeaturedInput = TypeOf<typeof addToFeaturedSchema>["body"];
export type UserParamsInput = TypeOf<typeof userParams>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>["body"];
export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type LoginUserInput = TypeOf<typeof loginUserSchema>;
