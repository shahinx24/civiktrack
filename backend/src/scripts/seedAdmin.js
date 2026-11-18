
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
  try {
    await connectDB();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin environment variables are missing");
    }

    // Find the old Admin account
    const existingAdmin = await Admin.findOne({
      email: "admin@civictrack.in",
    });

    if (existingAdmin) {
      existingAdmin.name = ADMIN_NAME;
      existingAdmin.email = ADMIN_EMAIL;
      existingAdmin.password = ADMIN_PASSWORD;

      await existingAdmin.save();

      console.log("Existing Admin updated successfully!");
    } else {
      await Admin.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      console.log("Initial Admin created successfully!");
    }

  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exitCode = 1;

  } finally {
    await mongoose.connection.close();
  }
};

seedAdmin();
