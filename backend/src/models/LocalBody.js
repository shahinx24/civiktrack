const mongoose = require("mongoose");

const localBodySchema = new mongoose.Schema(
  {
    // Local body name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    // Local body type
    type: {
      type: String,
      required: true,
      enum: [
        "Grama Panchayat",
        "Municipality",
        "Municipal Corporation",
      ],
    },

    // Unique local body code
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    // Constituency containing this local body
    constituencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
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

    // Local body status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Find active local bodies within a constituency
localBodySchema.index({
  constituencyId: 1,
  isActive: 1,
});

// EXPORT MODEL
const LocalBody = mongoose.model("LocalBody", localBodySchema);

module.exports = LocalBody;
