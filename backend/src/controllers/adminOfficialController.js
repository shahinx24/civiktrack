
const mongoose = require("mongoose");

const OfficialRequest = require("../models/OfficialRequest");
const User = require("../models/User");
const Constituency = require("../models/Constituency");

// GET ALL PENDING MLA REQUESTS
const getPendingOfficialRequests = async (req, res) => {
  try {
    const requests = await OfficialRequest.find({
      requestedRole: "authorized_official",
      status: "pending",
    })
      .populate("userId", "name email phone")
      .populate("constituencyId", "name district")
      .populate("localBodyId", "name type")
      .populate("requestedAreaIds", "name wardNumber")
      .populate("requestedCategoryIds", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get Pending Official Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending official requests.",
    });
  }
};

// GET ALL MLA REQUESTS
const getAllOfficialRequests = async (req, res) => {
  try {
    const requests = await OfficialRequest.find({
      requestedRole: "authorized_official",
    })
      .populate("userId", "name email phone")
      .populate("constituencyId", "name district")
      .populate("localBodyId", "name type")
      .populate("requestedAreaIds", "name wardNumber")
      .populate("requestedCategoryIds", "name")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get All Official Requests Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch official requests.",
    });
  }
};

// GET SINGLE MLA REQUEST
const getOfficialRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    const request = await OfficialRequest.findOne({
      _id: id,
      requestedRole: "authorized_official",
    })
      .populate("userId", "name email phone role accountStatus")
      .populate("constituencyId", "name district")
      .populate("localBodyId", "name type")
      .populate("requestedAreaIds", "name wardNumber")
      .populate("requestedCategoryIds", "name")
      .populate("reviewedBy", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Official request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("Get Official Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch official request.",
    });
  }
};

// APPROVE MLA REGISTRATION
const approveOfficialRequest = async (req, res) => {
  let session;

  try {
    const { id } = req.params;
    const reviewReason =
      typeof req.body.reviewReason === "string"
        ? req.body.reviewReason.trim()
        : "Approved by Admin";

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    session = await mongoose.startSession();

    let approvedRequest;

    await session.withTransaction(async () => {
      // Find pending MLA registration request
      const request = await OfficialRequest.findOne({
        _id: id,
        requestedRole: "authorized_official",
        status: "pending",
        requestType: "registration",
      }).session(session);

      if (!request) {
        const error = new Error(
          "Pending MLA registration request not found."
        );
        error.statusCode = 404;
        throw error;
      }

      // Find requesting user
      const user = await User.findById(request.userId).session(session);

      if (!user) {
        const error = new Error("Requesting user not found.");
        error.statusCode = 404;
        throw error;
      }

      if (
        user.deletedAt ||
        user.isBlacklisted ||
        user.accountStatus === "blocked" ||
        user.accountStatus === "suspended"
      ) {
        const error = new Error(
          "This user cannot be approved."
        );
        error.statusCode = 400;
        throw error;
      }

      if (user.role !== "resident") {
        const error = new Error(
          "Only a resident account can be approved for this registration."
        );
        error.statusCode = 400;
        throw error;
      }

      // Find requested constituency
      const constituency = await Constituency.findById(
        request.constituencyId
      ).session(session);

      if (!constituency) {
        const error = new Error(
          "Requested constituency not found."
        );
        error.statusCode = 404;
        throw error;
      }

      // Ensure only one MLA per constituency
      if (
        constituency.mla &&
        constituency.mla.toString() !== user._id.toString()
      ) {
        const error = new Error(
          "This constituency already has an assigned MLA."
        );
        error.statusCode = 409;
        throw error;
      }

      // Update user role
      user.role = "authorized_official";
      user.accountStatus = "active";

      // Save only fields supported by User.js
      user.officialDetails = {
        designation: request.designation,
        approvedBy: req.user._id,
        approvedByModel: "Admin",
        approvedAt: new Date(),
      };

      // Admin manages MLA
      user.managedBy = req.user._id;
      user.managedByModel = "Admin";

      await user.save({ session });

      // Connect MLA to constituency
      constituency.mla = user._id;

      await constituency.save({ session });

      // Update official request
      request.status = "approved";
      request.reviewedBy = req.user._id;
      request.reviewedByModel = "Admin";
      request.reviewReason = reviewReason;
      request.reviewedAt = new Date();

      await request.save({ session });

      approvedRequest = request;
    });

    return res.status(200).json({
      success: true,
      message: "MLA approved successfully.",
      request: approvedRequest,
    });
  } catch (error) {
    console.error("Approve Official Request Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode
          ? error.message
          : "Failed to approve official request.",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

// REJECT MLA REGISTRATION
const rejectOfficialRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewReason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID.",
      });
    }

    if (
      typeof reviewReason !== "string" ||
      !reviewReason.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejection.",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
      });
    }

    const request = await OfficialRequest.findOne({
      _id: id,
      requestedRole: "authorized_official",
      status: "pending",
      requestType: "registration",
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Pending MLA registration request not found.",
      });
    }

    request.status = "rejected";
    request.reviewedBy = req.user._id;
    request.reviewedByModel = "Admin";
    request.reviewReason = reviewReason.trim();
    request.reviewedAt = new Date();

    await request.save();

    return res.status(200).json({
      success: true,
      message: "MLA registration request rejected successfully.",
      request,
    });
  } catch (error) {
    console.error("Reject Official Request Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject official request.",
    });
  }
};

// EXPORT
module.exports = {
  getPendingOfficialRequests,
  getAllOfficialRequests,
  getOfficialRequestById,
  approveOfficialRequest,
  rejectOfficialRequest,
};
