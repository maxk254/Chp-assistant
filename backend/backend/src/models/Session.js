import mongoose from "mongoose";

// sesition data to save to mnogdb
const SessionSchema = new mongoose.Schema({
  patient:           { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  chp:               { type: mongoose.Schema.Types.ObjectId, ref: 'CHP', required: true },
  symptoms:          [{ type: String }],
  severity:          { type: String, enum: ['LOW','MEDIUM','HIGH','EMERGENCY'] },
  possibleConditions:[{ type: String }],
  immediateActions:  [{ type: String }],
  referToFacility:   { type: Boolean, default: false },
  facilityType:      { type: String },
  chwInstructions:   { type: String },
}, { timestamps: true});

export default mongoose.model("Session", SessionSchema);

