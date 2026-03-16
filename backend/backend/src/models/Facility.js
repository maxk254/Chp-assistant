// src/models/Facility.js
import mongoose from "mongoose";

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["dispensary", "health_centre", "hospital"] },
  county: { type: String },
  ward: { type: String },
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});

export default mongoose.model("Facility", FacilitySchema);
