const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // User who receives the notification
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification type
    type: {
      type: String,
      enum: [
        "issue_submitted",
        "issue_routed",
        "issue_status_changed",
        "issue_resolved",
        "issue_rejected",
        "issue_expired",
        "issue_reopened",

        "official_request_submitted",
        "official_request_approved",
        "official_request_rejected",

        "responsibility_created",
        "responsibility_updated",
        "responsibility_deactivated",

        "official_blacklisted",
        "official_unblacklisted",
        "performance_warning",

        "general",
      ],
      required: true,
    },

    // Notification heading
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    // Notification message
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Related issue
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    // Related official request
    officialRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfficialRequest",
      default: null,
    },

    // Related responsibility
    responsibilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Responsibility",
      default: null,
    },

    // Read status
    isRead: {
      type: Boolean,
      default: false,
    },

    // Date notification was read
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
});

// Export model
const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;
