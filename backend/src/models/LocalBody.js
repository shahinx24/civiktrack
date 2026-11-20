const mongoose = require("mongoose");

const localBodySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Grama Panchayat", "Municipality", "Municipal Corporation"],
    },

    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export LocalBody model
module.exports = mongoose.model("LocalBody", localBodySchema);
