import mongoose from "mongoose";


export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("db connected");

    } catch (error) {
        console.log("Error Connecting to db",error);
        process.exit(1);
    }
}