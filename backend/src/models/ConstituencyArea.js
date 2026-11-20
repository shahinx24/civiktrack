const mongoose = require("mongoose");

const constituencyAreaSchema = new mongoose.Schema(
  {
    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
    },

    localBody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
      required: true,
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
      required: true,
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

// Prevent duplicate area assignments within a constituency
constituencyAreaSchema.index(
  { constituency: 1, area: 1 },
  { unique: true }
);

// Export ConstituencyArea model
module.exports = mongoose.model(
  "ConstituencyArea",
  constituencyAreaSchema
);
