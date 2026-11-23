
const express = require("express");
const router = express.Router();

// Import Admin Official Controllers
const {
  getPendingOfficialRequests,
  getAllOfficialRequests,
  getOfficialRequestById,
  approveOfficialRequest,
  rejectOfficialRequest,
} = require("../controllers/adminOfficialController");

// Import Authentication Middleware
const {
  protect,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Apply Admin authentication to all routes
router.use(protect, authorizeAdmin);

// GET all pending official registration requests
router.get("/pending", getPendingOfficialRequests);

// GET all official requests
router.get("/", getAllOfficialRequests);

// GET a single official request by ID
router.get("/:id", getOfficialRequestById);

// APPROVE an official registration request
router.put("/:id/approve", approveOfficialRequest);

// REJECT an official registration request
router.put("/:id/reject", rejectOfficialRequest);

// Export Router
module.exports = router;
