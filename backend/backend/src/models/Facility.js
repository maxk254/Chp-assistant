// src/models/Facility.js
const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["dispensary", "health_centre", "hospital"] },
  county: { type: String },
  ward: { type: String },
  phone: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
});

module.exports = mongoose.model("Facility", FacilitySchema);
