
const mongoose = require("mongoose");

// CHP data the we get from frontend and is saved to the database
const CHPSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    ward: { type: String },
    county: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CHP", CHPSchema);
