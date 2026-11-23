const mongoose = require("mongoose");

// SUPPORTING DOCUMENT SCHEMA
const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      trim: true,
      required: true,
    },

    url: {
      type: String,
      trim: true,
      required: true,
    },

    publicId: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

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
      maxlength: 100,
    },

    // Department requested by the applicant
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // Requested jurisdiction level
    jurisdictionLevel: {
      type: String,
      enum: ["ward", "local_body", "constituency"],
      default: null,
    },

    // Requested constituency
    constituencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      default: null,
    },

    // Requested local body
    localBodyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
      default: null,
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
    documents: {
      type: [documentSchema],
      default: [],
    },

    // Request approval status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },

    // Admin or MLA who reviewed the request
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reviewedByModel",
      default: null,
    },

    // Collection containing the reviewer
    reviewedByModel: {
      type: String,
      enum: ["Admin", "User"],
      default: null,
    },

    // Reason for approval or rejection
    reviewReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Date when the request was reviewed
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// VALIDATE REQUEST DETAILS
officialRequestSchema.pre("validate", function () {
  // MLA applications must specify a constituency
  if (
    this.requestedRole === "authorized_official" &&
    !this.constituencyId
  ) {
    this.invalidate(
      "constituencyId",
      "A constituency is required for an authorized official request."
    );
  }

  // Responsible-person applications must specify a department
  if (this.requestedRole === "authorized") {
    if (!this.departmentId) {
      this.invalidate(
        "departmentId",
        "A department is required for an authorized person request."
      );
    }

    if (!this.jurisdictionLevel) {
      this.invalidate(
        "jurisdictionLevel",
        "A jurisdiction level is required."
      );
    }

    // Ward-level responsibility
    if (
      this.jurisdictionLevel === "ward" &&
      this.requestedAreaIds.length === 0
    ) {
      this.invalidate(
        "requestedAreaIds",
        "At least one area or ward is required."
      );
    }

    // Local-body-level responsibility
    if (
      this.jurisdictionLevel === "local_body" &&
      !this.localBodyId
    ) {
      this.invalidate(
        "localBodyId",
        "A local body is required."
      );
    }

    // Constituency-level responsibility
    if (
      this.jurisdictionLevel === "constituency" &&
      !this.constituencyId
    ) {
      this.invalidate(
        "constituencyId",
        "A constituency is required."
      );
    }
  }

  // Set reviewer collection according to the requested role
  if (!this.reviewedBy) {
    this.reviewedByModel = null;
    return;
  }

  if (this.requestedRole === "authorized_official") {
    this.reviewedByModel = "Admin";
  } else if (this.requestedRole === "authorized") {
    this.reviewedByModel = "User";
  }
});

// DATABASE INDEXES

// Find requests submitted by a user
officialRequestSchema.index({
  userId: 1,
  status: 1,
});

// Find requests by requested role and status
officialRequestSchema.index({
  requestedRole: 1,
  status: 1,
});

// Find requests reviewed by an admin or official
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
