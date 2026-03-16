// conecting with the mongoose
import mongoose  from "mongoose";
// patients schema/ data to be saved in the mongodb 
const PatientSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  age:       { type: Number, required: true },
  gender:    { type: String, enum: ['male','female'], required: true },
  phone:     { type: String },
  ward:      { type: String },
  county:    { type: String },
}, { timestamps: true });

export default mongoose.model('Patient', PatientSchema);