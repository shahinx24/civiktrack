const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    wardNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    localBody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
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

    pincode: {
      type: String,
      trim: true,
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

// Ensure ward numbers are unique within a local body
areaSchema.index(
  { localBody: 1, wardNumber: 1 },
  { unique: true }
);

// Export Area model
module.exports = mongoose.model("Area", areaSchema);
