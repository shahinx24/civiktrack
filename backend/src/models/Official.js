const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const officialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    constituency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Constituency",
      required: true,
    },

    localBody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LocalBody",
      default: null,
    },

    area: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
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

// Hash password before saving
officialSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare entered password with hashed password
officialSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export Official model
module.exports = mongoose.model("Official", officialSchema);
