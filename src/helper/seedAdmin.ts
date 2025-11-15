import dotenv from "dotenv";
dotenv.config(); // Load .env BEFORE anything else

import mongoose from "mongoose";
import User from "../model/user.model";
import { envConfig } from "../config/config";

const createFirstAdmin = async () => {
  try {
    console.log("⏳ Connecting to database...");

    // Use the atlas connection string directly (it already contains DB name)
    const dbUri = envConfig.mongodb_uri;
    console.log("DB URI:", dbUri);

    if (!dbUri) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }

    await mongoose.connect(dbUri);
    console.log("✔ Database connected");

    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("✔ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create the first admin
    const newAdmin = new User({
      userName: "superadmin",
      email: "admin@example.com",
      password: process.env.ADMIN_PASSWORD || "admin123",
      phoneNumber: "98090908765",
      role: "admin",
    });

    await newAdmin.save();

    console.log("🔥 FIRST ADMIN CREATED SUCCESSFULLY!");
    console.log("Email:", newAdmin.email);
    console.log("Password:", process.env.ADMIN_PASSWORD);

    process.exit(0);
  } 
  catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createFirstAdmin();
