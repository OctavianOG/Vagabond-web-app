import mongoose from "mongoose";
import customConfig from "../config/default";

const dbUrl = customConfig.dbUri;

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl).then(() => {
      console.log("Database connected");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
