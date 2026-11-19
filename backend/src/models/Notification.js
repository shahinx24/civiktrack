const mongoose = require("mongoose");

// NOTIFICATION SCHEMA
const notificationSchema = new mongoose.Schema(
  {
    // User who receives this notification
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of notification
    type: {
      type: String,
      enum: [
        "issue_submitted",
        "issue_assigned",
        "issue_status_changed",
        "issue_resolved",
        "issue_rejected",
        "official_request_submitted",
        "official_request_approved",
        "official_request_rejected",
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

    // Related issue, if applicable
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },

    // Related official request, if applicable
    officialRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OfficialRequest",
      default: null,
    },

    // Whether the notification has been read
    isRead: {
      type: Boolean,
      default: false,
    },

    // Date when the notification was read
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES

// Find notifications belonging to a particular user
notificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

// Find unread notifications for a user
notificationSchema.index({
  recipientId: 1,
  isRead: 1,
});

// EXPORT MODEL

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

module.exports = Notification;
