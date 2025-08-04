import mongoose from "mongoose";

export const connectDB = async () => {
    if(!process.env.MONGO_URI){
        console.error("error:MONGO_URI is not set in .env")
        process.exit(1)
    }
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB is Connected")
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
};
