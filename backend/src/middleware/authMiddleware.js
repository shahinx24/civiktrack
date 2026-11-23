
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// VERIFY ADMIN AUTHENTICATION
const protect = async (req, res, next) => {
  try {
    // Check JWT configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
    }

    // Get token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify token role
    if (decoded.role !== "admin" || !decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    // Find current Admin account
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    // Check current account status
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is deactivated.",
      });
    }

    // Attach authenticated Admin information
    req.user = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return next();

  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token.",
      });
    }

    console.error("Admin Authentication Error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

// AUTHORIZE ADMIN ROLE
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required.",
  });
};

// EXPORT MIDDLEWARE
module.exports = {
  protect,
  authorizeAdmin,
};
