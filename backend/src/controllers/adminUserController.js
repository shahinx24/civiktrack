const mongoose = require("mongoose");
const User = require("../models/User");

// Get all registered users with search, filtering and pagination
const getAllUsers = async (req, res) => {
  try {
    const {
      search,
      role,
      accountStatus,
      page = 1,
      limit = 10,
    } = req.query;

    // Build user filter
    const filter = {
      deletedAt: null,
    };

    // Filter by user role
    if (role) {
      filter.role = role;
    }

    // Filter by account status
    if (accountStatus) {
      filter.accountStatus = accountStatus;
    }

    // Search users by name, email or phone
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Pagination settings
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(
      100,
      Math.max(1, parseInt(limit, 10) || 10)
    );

    const skip = (currentPage - 1) * perPage;

    // Fetch users
    const users = await User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    // Count total matching users
    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
        pagination: {
          totalUsers,
          currentPage,
          totalPages: Math.ceil(totalUsers / perPage),
          limit: perPage,
        },
      },
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// Get individual user details
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user excluding deleted accounts
    const user = await User.findOne({
      _id: userId,
      deletedAt: null,
    }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};

// Update user account status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Allowed account statuses
    const allowedStatuses = [
      "pending",
      "active",
      "blocked",
      "suspended",
    ];

    if (!allowedStatuses.includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account status",
        allowedStatuses,
      });
    }

    // Find and update user
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        deletedAt: null,
      },
      {
        $set: {
          accountStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User account status updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update User Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

// Soft delete user account
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { deletionReason } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user
    const user = await User.findOne({
      _id: userId,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Soft delete user account
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    user.deletionReason = deletionReason || "Deleted by admin";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user account",
    });
  }
};

// Export Admin User Controllers
module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
