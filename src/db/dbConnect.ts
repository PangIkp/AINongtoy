import mongoose from "mongoose";
import 'dotenv/config'


let isConnected = false;

export const dbConnect = async () => {
    mongoose.set("strictQuery", true);
    if (isConnected) return;

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("Please define MONGO_URI");

    try {
        await mongoose.connect(MONGO_URI, { bufferCommands: false });
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};