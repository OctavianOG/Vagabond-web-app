import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import connectDB from "./utils/connectDB";
import createHttpError, { isHttpError } from "http-errors";
import customConfig from "./config/default";
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import cookieParser from "cookie-parser";
import {
  addToFeaturedSchema,
  createUserSchema,
  loginUserSchema,
  updateUserSchema,
  userParams,
} from "./schemas/user.schema";
import { deserializeUser } from "./middleware/deserializeUser";
import {
  addToFeaturedHandler,
  getUserHandler,
  updateUserHandler,
} from "./controllers/user.controller";
import {
  registerHandler,
  refreshAccessTokenHandler,
  loginHandler,
  logoutHandler,
} from "./controllers/auth.controller";
import {
  createPropertySchema,
  getPropertiesByAuthorSchema,
  params,
  updatePropertySchema,
} from "./schemas/property.schema";
import {
  createPropertyHandler,
  getPropertyHandler,
  getPropertiesHandler,
  updatePropertyHandler,
  deletePropertyHandler,
  getPropertiesByAuthorHandler,
} from "./controllers/property.controller";

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) =>
  deserializeUser({ req, res });

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const authRouter = t.router({
  userRegister: t.procedure
    .input(createUserSchema)
    .mutation(({ input }) => registerHandler({ input })),
  userLogin: t.procedure
    .input(loginUserSchema)
    .mutation(({ input, ctx }) => loginHandler({ input, ctx })),
  userLogout: t.procedure.mutation(({ ctx }) => logoutHandler({ ctx })),
  refreshToken: t.procedure.query(({ ctx }) =>
    refreshAccessTokenHandler({ ctx })
  ),
});

const isAuthorized = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to have access!",
    });
  }
  return next();
});

const isAuthorizedProcedure = t.procedure.use(isAuthorized);

const userRouter = t.router({
  getUser: isAuthorizedProcedure.query(({ ctx }) => getUserHandler({ ctx })),
  updateUser: isAuthorizedProcedure
    .input(updateUserSchema)
    .mutation(({ input, ctx }) =>
      updateUserHandler({
        userParamsInput: input.userParams,
        input: input.body,
        ctx,
      })
    ),
  addToFeatured: isAuthorizedProcedure
    .input(addToFeaturedSchema)
    .mutation(({ input, ctx }) =>
      addToFeaturedHandler({
        userParamsInput: input.userParams,
        input: { propertyId: input.body.propertyId },
        ctx,
      })
    ),
});

const propertyRouter = t.router({
  createProperty: t.procedure
    .input(createPropertySchema)
    .mutation(({ input, ctx }) => createPropertyHandler({ input, ctx })),
  getProperties: t.procedure.query(() => getPropertiesHandler()),
  getProperty: t.procedure
    .input(params)
    .query(({ input }) => getPropertyHandler({ paramsInput: input })),
  updateProperty: isAuthorizedProcedure
    .input(updatePropertySchema)
    .mutation(({ input }) =>
      updatePropertyHandler({ paramsInput: input.params, input: input.body })
    ),
  deleteProperty: isAuthorizedProcedure
    .input(params)
    .mutation(({ input }) => deletePropertyHandler({ paramsInput: input })),
  getPropertiesByAuthor: isAuthorizedProcedure
    .input(getPropertiesByAuthorSchema)
    .query(({ input }) => getPropertiesByAuthorHandler({ email: input.email })),
});

const appRouter = t.mergeRouters(authRouter, userRouter, propertyRouter);

export type AppRouter = typeof appRouter;

const app = express();
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use(cookieParser());

app.use(
  cors({
    origin: [customConfig.origin, "http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  "/api",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found!"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occured!";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

const PORT = customConfig.port;
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);

  connectDB();
});
