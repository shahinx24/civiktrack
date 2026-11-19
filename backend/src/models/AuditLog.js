const mongoose = require("mongoose");

// AUDIT LOG SCHEMA

const auditLogSchema = new mongoose.Schema(
  {
    // User or admin who performed the action
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "performedByModel",
    },

    // Collection containing the person who performed the action
    performedByModel: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
    },

    // Type of action performed
    action: {
      type: String,
      enum: [
        "user_registered",
        "user_updated",
        "user_blocked",
        "user_unblocked",
        "user_deleted",
        "official_request_submitted",
        "official_request_approved",
        "official_request_rejected",
        "issue_submitted",
        "issue_assigned",
        "issue_reassigned",
        "issue_status_changed",
        "issue_resolved",
        "issue_rejected",
        "admin_login",
        "admin_logout",
        "general",
      ],
      required: true,
    },

    // Related database record, if applicable
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Type of record being affected
    targetModel: {
      type: String,
      enum: [
        "User",
        "Admin",
        "OfficialRequest",
        "Issue",
        "IssueAssignment",
        "IssueUpdate",
        "Notification",
      ],
      default: null,
    },

    // Short description of the activity
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Previous values before the action
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // New values after the action
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // IP address of the person performing the action
    ipAddress: {
      type: String,
      trim: true,
    },

    // Browser or device information
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES

// Find activities performed by a particular user
auditLogSchema.index({
  performedBy: 1,
  createdAt: -1,
});

// Find activities related to a particular record
auditLogSchema.index({
  targetId: 1,
  targetModel: 1,
});

// Filter activities by action type
auditLogSchema.index({
  action: 1,
  createdAt: -1,
});

// EXPORT MODEL

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

module.exports = AuditLog;
