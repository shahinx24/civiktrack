const express = require("express");
const { adminLogin } = require("../controllers/adminController");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

module.exports = router;
