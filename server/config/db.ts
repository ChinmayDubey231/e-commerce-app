import "dotenv/config";
import mongoose from "mongoose";

mongoose.set("debug", true);

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });

  await mongoose.connect(process.env.MONGODB_URI as string);
};

export default connectDB;
