import { MONGO_URL, NODE_ENV } from "../../config/env.js";
import mongoose from "mongoose";

if (!MONGO_URL) {
  throw new Error("Please Provide MONGO_URL connection string in .env file ");
}

const databaseConnection = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to database");
  } catch (error) {
    // const msg = NODE_ENV === "development" ? error.message : {};
    console.error(error.message);
    process.exit(1);
  }
};

export default databaseConnection;
