const User = require("../models/User");
const OfficialRequest = require("../models/OfficialRequest");
const Issue = require("../models/Issue");

// GET ADMIN DASHBOARD STATISTICS
const getAdminDashboardStats = async (req, res) => {
  try {
    // USER STATISTICS
    const activeUsersFilter = {
      deletedAt: null,
    };

    const [
      totalUsers,
      totalResidents,
      totalAuthorizedPersons,
      totalAuthorizedOfficials,
      blacklistedUsers,
    ] = await Promise.all([
      User.countDocuments(activeUsersFilter),

      User.countDocuments({
        ...activeUsersFilter,
        role: "resident",
      }),

      User.countDocuments({
        ...activeUsersFilter,
        role: "authorized",
      }),

      User.countDocuments({
        ...activeUsersFilter,
        role: "authorized_official",
      }),

      User.countDocuments({
        ...activeUsersFilter,
        isBlacklisted: true,
      }),
    ]);

    // ISSUE STATISTICS
    const [
      totalIssues,
      pendingIssues,
      resolvedIssues,
      rejectedIssues,
      expiredIssues,
      reopenedIssues,
    ] = await Promise.all([
      Issue.countDocuments(),

      Issue.countDocuments({
        status: {
          $nin: ["resolved", "rejected", "expired"],
        },
      }),

      Issue.countDocuments({
        status: "resolved",
      }),

      Issue.countDocuments({
        status: "rejected",
      }),

      Issue.countDocuments({
        status: "expired",
      }),

      Issue.countDocuments({
        status: "reopened",
      }),
    ]);

    // OFFICIAL REQUEST STATISTICS
    const [
      totalOfficialRequests,
      pendingOfficialRequests,
      approvedOfficialRequests,
      rejectedOfficialRequests,
    ] = await Promise.all([
      OfficialRequest.countDocuments(),

      OfficialRequest.countDocuments({
        status: "pending",
      }),

      OfficialRequest.countDocuments({
        status: "approved",
      }),

      OfficialRequest.countDocuments({
        status: "rejected",
      }),
    ]);

    // ISSUE STATUS BREAKDOWN
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

    // RESPONSE
    return res.status(200).json({
      success: true,
      message: "Admin dashboard statistics fetched successfully",

      data: {
        users: {
          total: totalUsers,
          residents: totalResidents,
          authorizedPersons: totalAuthorizedPersons,
          authorizedOfficials: totalAuthorizedOfficials,
          blacklisted: blacklistedUsers,
        },

        issues: {
          total: totalIssues,
          pending: pendingIssues,
          resolved: resolvedIssues,
          rejected: rejectedIssues,
          expired: expiredIssues,
          reopened: reopenedIssues,
          statistics: issueStatistics,
        },

        officialRequests: {
          total: totalOfficialRequests,
          pending: pendingOfficialRequests,
          approved: approvedOfficialRequests,
          rejected: rejectedOfficialRequests,
        },
      },
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin dashboard statistics",
    });
  }
};

// EXPORT
module.exports = {
  getAdminDashboardStats,
};
