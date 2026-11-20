const User = require("../models/User");
const OfficialRequest = require("../models/OfficialRequest");
const Issue = require("../models/Issue");

// Get Admin Dashboard Statistics
const getAdminDashboardStats = async (req, res) => {
  try {
    // Get total registered users (excluding deleted users)
    const totalUsers = await User.countDocuments({
      deletedAt: null,
    });

    // Get total complaints
    const totalIssues = await Issue.countDocuments();

    // Get pending complaints (all issues not resolved or rejected)
    const pendingIssues = await Issue.countDocuments({
      status: {
        $nin: ["resolved", "rejected"],
      },
    });

    // Get resolved complaints
    const resolvedIssues = await Issue.countDocuments({
      status: "resolved",
    });

    // Get total official registration requests
    const totalOfficialRequests = await OfficialRequest.countDocuments();

    // Get pending official registration requests
    const pendingOfficialRequests = await OfficialRequest.countDocuments({
      status: "pending",
    });

    // Get complaint statistics grouped by status
    const issueStatistics = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Send dashboard statistics
    return res.status(200).json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",

      data: {
        totalUsers,
        totalIssues,
        pendingIssues,
        resolvedIssues,
        totalOfficialRequests,
        pendingOfficialRequests,
        issueStatistics,
      },
    });
  } catch (error) {
    // Handle dashboard errors
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
      error: error.message,
    });
  }
};

// Export Admin Dashboard Controller
module.exports = {
  getAdminDashboardStats,
};
