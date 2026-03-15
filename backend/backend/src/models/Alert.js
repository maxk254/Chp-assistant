
const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    session: {type: mongoose.Schema.Types.ObjectId,ref: "Session",required: true},
    facility: {type: mongoose.Schema.Types.ObjectId,ref: "Facility",required: true},
    smsSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Alert", AlertSchema);
