const mongoose = require("mongoose");

// ISSUE UPDATE SCHEMA
const issueUpdateSchema = new mongoose.Schema(
  {
    // Issue related to this update
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    // User or admin who created this update
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "updatedByModel",
      required: true,
    },

    // Collection containing the person who created the update
    updatedByModel: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
    },

    // Type of update
    updateType: {
      type: String,
      enum: [
        "status_change",
        "inspection",
        "work_started",
        "progress",
        "delay",
        "resolution",
        "rejection",
        "expiry",
        "reopening",
        "general",
      ],
      default: "general",
      required: true,
    },

    // New status of the issue
    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "under_inspection",
        "in_progress",
        "awaiting_resources",
        "resolved",
        "rejected",
        "expired",
        "reopened",
      ],
      default: null,
    },

    // Description of the progress update
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    // Additional notes about the work
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    // Supporting images or documents
    attachments: [
      {
        type: {
          type: String,
          trim: true,
        },

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

    // Whether this update is visible to the public
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES

// Retrieve all updates for an issue chronologically
issueUpdateSchema.index({
  issueId: 1,
  createdAt: 1,
});

// Find updates created by a particular user
issueUpdateSchema.index({
  updatedBy: 1,
  createdAt: -1,
});

// Filter updates by type
issueUpdateSchema.index({
  updateType: 1,
  createdAt: -1,
});

// EXPORT MODEL
const IssueUpdate = mongoose.model(
  "IssueUpdate",
  issueUpdateSchema
);

module.exports = IssueUpdate;
