import mongoose from "mongoose";

export default async function connectionDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sarahaApp", {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("DB Connected Successful");
  } catch (error) {
    console.log("DB Connected Failed");
  }
}

