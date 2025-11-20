import mongoose from "mongoose";

const DEFAULT_URI = "mongodb://127.0.0.1:27017/library";

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  const dbName = process.env.MONGODB_DB || undefined;

  try {
    await mongoose.connect(uri, {
      dbName,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default mongoose;
