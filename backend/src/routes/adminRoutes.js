
const express = require("express");

const { adminLogin } = require("../controllers/adminController");

const {
  protect,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin login (Public route)
router.post("/login", adminLogin);

// Verify Admin authentication (Protected route)
router.get("/verify", protect, authorizeAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authentication verified!",
    admin: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

module.exports = router;
