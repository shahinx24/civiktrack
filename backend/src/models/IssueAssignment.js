const mongoose = require("mongoose");

// ISSUE ASSIGNMENT SCHEMA

const issueAssignmentSchema = new mongoose.Schema(
  {
    // Issue being assigned to an official
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },

    // Official receiving the assignment
    officialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Admin or official who made the assignment
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

    // Current assignment status
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "reassigned",
        "completed",
      ],
      default: "pending",
      required: true,
    },

    // Reason provided if the official rejects the assignment
    rejectionReason: {
      type: String,
      trim: true,
    },

    // Reason for transferring the issue to another official
    reassignmentReason: {
      type: String,
      trim: true,
    },

    // Date when the official accepted the assignment
    acceptedAt: {
      type: Date,
      default: null,
    },

    // Date when the assignment was rejected
    rejectedAt: {
      type: Date,
      default: null,
    },

    // Date when the assignment was completed
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES
// Find all assignments related to an issue
issueAssignmentSchema.index({
  issueId: 1,
  createdAt: -1,
});

// Find assignments received by an official
issueAssignmentSchema.index({
  officialId: 1,
  status: 1,
});

// Find assignments created by an admin or official
issueAssignmentSchema.index({
  assignedBy: 1,
  createdAt: -1,
});

// EXPORT MODEL
const IssueAssignment = mongoose.model(
  "IssueAssignment",
  issueAssignmentSchema
);

module.exports = IssueAssignment;
