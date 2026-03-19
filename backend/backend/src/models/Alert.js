import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    session: {type: mongoose.Schema.Types.ObjectId,ref: "Session",required: true},
    facility: {type: mongoose.Schema.Types.ObjectId,ref: "Facility",required: true},
    smsSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Alert", AlertSchema);
