const mongoose = require("mongoose");

const constituencySchema = new mongoose.Schema(
  {
    // Constituency name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // District information
    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // State information
    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Unique constituency identification code
    constituencyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Assigned MLA (authorized_official User)
    mla: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Constituency status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// INDEXES
const Constituency = mongoose.model(
  "Constituency",
  constituencySchema
);

module.exports = Constituency;
