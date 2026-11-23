const mongoose = require("mongoose");

// ISSUE SCHEMA
const issueSchema = new mongoose.Schema(
  {
    // Unique complaint reference number
    issueNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Basic issue information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Resident who reported the issue
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Category of the reported issue
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Location information
    localBodyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
      required: true,
    },

    areaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // Geographic coordinates
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },

    // Uploaded issue images
    images: [
      {
        url: {
          type: String,
          trim: true,
        },

        publicId: {
          type: String,
          trim: true,
        },
      },
    ],

    // Current issue status
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "assigned",
        "under_inspection",
        "in_progress",
        "awaiting_resources",
        "resolved",
        "rejected",
      ],
      default: "submitted",
      required: true,
    },

    // Official currently handling the issue
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin or official who assigned the issue
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "assignedByModel",
      default: null,
    },

    assignedByModel: {
      type: String,
      enum: ["Admin", "User"],
      default: null,
    },

    // Rejection information
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

    // Resolution information
    resolutionNote: {
      type: String,
      trim: true,
    },

    resolutionEvidence: [
      {
        url: {
          type: String,
          trim: true,
        },

        publicId: {
          type: String,
          trim: true,
        },
      },
    ],

    // Important issue dates
    submittedAt: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES

// Find issues reported by a particular resident
issueSchema.index({ reportedBy: 1, status: 1 });

// Find issues assigned to an official
issueSchema.index({ assignedTo: 1, status: 1 });

// Filter issues by location
issueSchema.index({ localBodyId: 1, areaId: 1 });

// Filter issues by category
issueSchema.index({ categoryId: 1, status: 1 });

// Filter issues by submission date
issueSchema.index({ submittedAt: -1 });

// EXPORT MODEL
const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
