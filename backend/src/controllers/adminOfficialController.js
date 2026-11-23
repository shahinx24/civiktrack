const OfficialRequest = require("../models/OfficialRequest");
const User = require("../models/User");

// GET ALL PENDING AUTHORIZED OFFICIAL REQUESTS
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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending official requests.",
            error: error.message,
        });
    }
};

// GET ALL AUTHORIZED OFFICIAL REQUESTS
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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch official requests.",
            error: error.message,
        });
    }
};

// GET SINGLE AUTHORIZED OFFICIAL REQUEST
const getOfficialRequestById = async (req, res) => {
    try {
        const request = await OfficialRequest.findOne({
            _id: req.params.id,
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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch official request.",
            error: error.message,
        });
    }
};

// APPROVE AUTHORIZED OFFICIAL REGISTRATION
const approveOfficialRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await OfficialRequest.findOne({
            _id: id,
            requestedRole: "authorized_official",
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Official request not found.",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This request has already been reviewed.",
            });
        }

        // This approval handler currently supports registration requests.
        if (request.requestType !== "registration") {
            return res.status(400).json({
                success: false,
                message: "This request type is not supported by this approval handler.",
            });
        }

        // Find the user who submitted the request
        const user = await User.findById(request.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Requesting user not found.",
            });
        }

        if (user.deletedAt || user.isBlacklisted) {
            return res.status(400).json({
                success: false,
                message: "This user cannot be approved.",
            });
        }

        // Update user role and official details
        user.role = "authorized_official";
        user.accountStatus = "active";

        user.officialDetails = {
            designation: request.designation,
            department: request.department,
            constituencyId: request.constituencyId,
            localBodyId: request.localBodyId,
            assignedAreaIds: request.requestedAreaIds,
            handledCategoryIds: request.requestedCategoryIds,

            // Record Admin who approved the official
            approvedBy: req.user._id,
            approvedAt: new Date(),
        };

        // Admin manages authorized officials
        user.managedBy = req.user._id;
        user.managedByModel = "Admin";

        await user.save();

        // Update the official request
        request.status = "approved";
        request.reviewedBy = req.user._id;
        request.reviewReason = req.body.reviewReason || "Approved by Admin";
        request.reviewedAt = new Date();

        await request.save();

        return res.status(200).json({
            success: true,
            message: "Authorized official approved successfully.",
            request,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to approve official request.",
            error: error.message,
        });
    }
};

// REJECT AUTHORIZED OFFICIAL REGISTRATION
const rejectOfficialRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewReason } = req.body;

        if (!reviewReason || !reviewReason.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a reason for rejection.",
            });
        }

        const request = await OfficialRequest.findOne({
            _id: id,
            requestedRole: "authorized_official",
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Official request not found.",
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "This request has already been reviewed.",
            });
        }

        // Update request status
        request.status = "rejected";
        request.reviewedBy = req.user._id;
        request.reviewReason = reviewReason.trim();
        request.reviewedAt = new Date();

        await request.save();

        return res.status(200).json({
            success: true,
            message: "Official request rejected successfully.",
            request,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reject official request.",
            error: error.message,
        });
    }
};

// EXPORT CONTROLLERS
module.exports = {
    getPendingOfficialRequests,
    getAllOfficialRequests,
    getOfficialRequestById,
    approveOfficialRequest,
    rejectOfficialRequest,
};
