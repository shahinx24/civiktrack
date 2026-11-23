const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// OFFICIAL DETAILS SCHEMA
const officialDetailsSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "officialDetails.approvedByModel",
      default: null,
    },

    approvedByModel: {
      type: String,
      enum: ["Admin", "User"],
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    // BASIC INFORMATION
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
      set: (value) => {
        if (typeof value !== "string") return value;
        return value.trim() || undefined;
      },
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    // USER ROLE
    role: {
      type: String,
      enum: ["resident", "authorized", "authorized_official"],
      default: "resident",
      required: true,
    },

    // ACCOUNT STATUS
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

    // MANAGEMENT RELATIONSHIP
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

    // MLA / RESPONSIBLE PERSON DETAILS
    officialDetails: {
      type: officialDetailsSchema,
      default: undefined,
    },

    // BLACKLIST STATUS
    isBlacklisted: {
      type: Boolean,
      default: false,
    },

    blacklistReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    blacklistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "blacklistedByModel",
      default: null,
    },

    blacklistedByModel: {
      type: String,
      enum: ["User", "Admin"],
      default: null,
    },

    blacklistedAt: {
      type: Date,
      default: null,
    },

    // SOFT DELETION
    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "deletedByModel",
      default: null,
    },

    deletedByModel: {
      type: String,
      enum: ["User", "Admin"],
      default: null,
    },

    deletionReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// MANAGEMENT REFERENCE VALIDATION
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

// BLACKLIST METADATA IS PRESERVED
// Do not clear historical blacklist information here.
// Unblacklisting should be recorded through AuditLog / PerformanceRecord.

// SOFT DELETION VALIDATION
userSchema.pre("validate", function () {
  if (!this.deletedAt) {
    this.deletedBy = null;
    this.deletedByModel = null;
    this.deletionReason = undefined;
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
userSchema.index({ deletedAt: 1 });

// EXPORT MODEL
const User = mongoose.model("User", userSchema);

module.exports = User;
