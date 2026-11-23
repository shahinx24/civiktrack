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

    // Department responsible for the issue
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    // Complaint location
    constituencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
    },

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

    // Automatically identified responsibility records
    responsibilityIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Responsibility",
      },
    ],

    // Responsible persons who receive the complaint
    responsiblePersonIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Current issue status
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
      default: "submitted",
      required: true,
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
      maxlength: 500,
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

    // Complaint dates
    submittedAt: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    expiredAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    // MLA-authorized reopening information
    reopenedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reopenedAt: {
      type: Date,
      default: null,
    },

    reopenReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// DATABASE INDEXES

// Find issues reported by a resident
issueSchema.index({
  reportedBy: 1,
  status: 1,
});

// Find complaints received by responsible persons
issueSchema.index({
  responsiblePersonIds: 1,
  status: 1,
});

// Filter complaints by location
issueSchema.index({
  constituencyId: 1,
  localBodyId: 1,
  areaId: 1,
});

// Filter complaints by department and status
issueSchema.index({
  departmentId: 1,
  status: 1,
});

// Find complaints approaching or passing their deadlines
issueSchema.index({
  status: 1,
  dueDate: 1,
});

// Filter by submission date
issueSchema.index({
  submittedAt: -1,
});

// EXPORT MODEL
const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
