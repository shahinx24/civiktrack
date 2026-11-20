const mongoose = require("mongoose");

const constituencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    constituencyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    mla: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
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

// Export Constituency model
module.exports = mongoose.model("Constituency", constituencySchema);
