import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.DB_CONN_STRING as string;

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(URI);
    console.log("MongoDB Database Connected Successfully 🚀");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDatabase;
