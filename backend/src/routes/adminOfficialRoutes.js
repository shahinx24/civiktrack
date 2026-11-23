const express = require("express");
const router = express.Router();

const {
  getPendingOfficialRequests,
  getAllOfficialRequests,
  getOfficialRequestById,
  approveOfficialRequest,
  rejectOfficialRequest,
} = require("../controllers/adminOfficialController");

const {
  protect,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Protect all routes with Admin authentication
router.use(protect, authorizeAdmin);

// Get pending official registration requests
router.get("/pending", getPendingOfficialRequests);

// Get all official requests
router.get("/", getAllOfficialRequests);

// Get a single official request
router.get("/:id", getOfficialRequestById);

// Approve an official registration request
router.put("/:id/approve", approveOfficialRequest);

// Reject an official registration request
router.put("/:id/reject", rejectOfficialRequest);

module.exports = router;
