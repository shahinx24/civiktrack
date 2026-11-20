const express = require("express");
const router = express.Router();

// Import Admin Dashboard Controller
const {
  getAdminDashboardStats,
} = require("../controllers/adminDashboardController");

// Import Authentication Middleware
const {
  protect,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Admin Dashboard Statistics Route
router.get(
  "/stats",
  protect,
  authorizeAdmin,
  getAdminDashboardStats
);

// Export Admin Dashboard Routes
module.exports = router;
