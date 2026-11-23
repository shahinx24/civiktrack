const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// ADMIN LOGIN
const adminLogin = async (req, res) => {
  try {
    // 1. Get credentials
    const { email, password } = req.body;

    // 2. Validate input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid email and password are required",
      });
    }

    // 3. Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // 4. Find Admin
    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    // 5. Check Admin existence
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 6. Check account status
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated",
      });
    }

    // 7. Compare password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 8. Generate JWT
    const token = jwt.sign(
      {
        id: admin._id.toString(),
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    // 9. Successful response
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { adminLogin };
