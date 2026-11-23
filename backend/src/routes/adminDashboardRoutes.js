const express = require("express");
const router = express.Router();

const {
  getAdminDashboardStats,
} = require("../controllers/adminDashboardController");

const {
  protect,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// ADMIN DASHBOARD STATISTICS
router.get(
  "/stats",
  protect,
  authorizeAdmin,
  getAdminDashboardStats
);

module.exports = router;
