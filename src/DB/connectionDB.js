import mongoose from "mongoose";
<<<<<<< HEAD
=======
import { connectRedis } from "./redis.connection.js";
>>>>>>> master

export default async function connectionDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sarahaApp", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("DB Connected Successful");
<<<<<<< HEAD
=======
      await connectRedis();
>>>>>>> master
  } catch (error) {
    console.log("DB Connected Failed");
  }
}

