const mongoose = require("mongoose");

// OFFICIAL REQUEST SCHEMA
const officialRequestSchema = new mongoose.Schema(
  {
    // User who submitted the request
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Type of request submitted
    requestType: {
      type: String,
      enum: [
        "registration",
        "jurisdiction_change",
        "role_change",
        "permission_change",
      ],
      default: "registration",
      required: true,
    },

    // Role requested by the user
    requestedRole: {
      type: String,
      enum: ["authorized", "authorized_official"],
      required: true,
    },

    // Official designation
    designation: {
      type: String,
      trim: true,
    },

    // Department name
    department: {
      type: String,
      trim: true,
    },

    // Requested local body
    localBodyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
    },

    // Requested constituency (MLA)
    constituencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
    },

    // Requested areas or wards
    requestedAreaIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      },
    ],

    // Requested complaint categories
    requestedCategoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // Supporting documents
    documents: [
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

    // Request approval status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },

    // Admin or authorized reviewer who handled the request
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    // Reason for approval or rejection
    reviewReason: {
      type: String,
      trim: true,
    },

    // Date when request was reviewed
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES

// Find requests submitted by a user and their status
officialRequestSchema.index({
  userId: 1,
  status: 1,
});

// Find requests reviewed by an admin and their status
officialRequestSchema.index({
  reviewedBy: 1,
  status: 1,
});

// EXPORT MODEL
const OfficialRequest = mongoose.model(
  "OfficialRequest",
  officialRequestSchema
);

module.exports = OfficialRequest;
