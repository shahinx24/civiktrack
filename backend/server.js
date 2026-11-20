const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const adminRoutes = require("./src/routes/adminRoutes");
const adminDashboardRoutes = require("./src/routes/adminDashboardRoutes");

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// Admin Routes
app.use("/api/admin", adminRoutes);

// Admin Dashboard Routes
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CivicTrack API is running!",
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
