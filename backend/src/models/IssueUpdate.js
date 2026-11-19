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

    // User or official who created this update
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // New status of the issue
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
      required: true,
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

// Retrieve all updates for an issue in chronological order
issueUpdateSchema.index({
  issueId: 1,
  createdAt: 1,
});

// Find updates created by a particular user
issueUpdateSchema.index({
  updatedBy: 1,
  createdAt: -1,
});

// EXPORT MODEL

const IssueUpdate = mongoose.model(
  "IssueUpdate",
  issueUpdateSchema
);

module.exports = IssueUpdate;
