const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// OFFICIAL DETAILS SCHEMA
const officialDetailsSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    constituencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
    },

    localBodyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
    },

    assignedAreaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],

    handledCategoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    approvedAt: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    // User Role
    role: {
      type: String,
      enum: ["resident", "authorized", "authorized_official"],
      default: "resident",
      required: true,
    },

    // Account Status
    accountStatus: {
      type: String,
      enum: ["pending", "active", "blocked", "suspended"],
      default: "active",
      required: true,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    // Management Relationship
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "managedByModel",
      default: null,
    },

    managedByModel: {
      type: String,
      enum: ["User", "Admin"],
      default: null,
    },

    // Official Information
    officialDetails: {
      type: officialDetailsSchema,
      default: undefined,
    },

    // Blacklist Management
    isBlacklisted: {
      type: Boolean,
      default: false,
    },

    blacklistReason: {
      type: String,
      trim: true,
    },

    blacklistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    blacklistedAt: {
      type: Date,
    },

    // Soft Deletion
    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    deletionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Set manager model according to user role
userSchema.pre("validate", function () {
  if (!this.managedBy) {
    this.managedByModel = null;
    return;
  }

  if (this.role === "authorized_official") {
    this.managedByModel = "Admin";
  } else {
    this.managedByModel = "User";
  }
});

// PASSWORD HASHING
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// PASSWORD COMPARISON
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// INDEXES
userSchema.index({ role: 1, accountStatus: 1 });

userSchema.index({ isBlacklisted: 1, role: 1 });

userSchema.index({ managedBy: 1, role: 1 });

// EXPORT MODEL
const User = mongoose.model("User", userSchema);

module.exports = User;
