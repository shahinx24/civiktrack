const express = require("express");

const { adminLogin } = require("../controllers/adminController");

const {
  protect,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Login (Public)
router.post("/login", adminLogin);

// Verify Admin Authentication (Protected)
router.get("/verify", protect, authorizeAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authentication verified!",
    admin: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
