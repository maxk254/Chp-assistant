import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["chw", "facility", "supervisor"],
      required: true,
    },
    phone: { type: String, unique: true, sparse: true }, // For CHW/Facility
    email: { type: String, unique: true, sparse: true }, // For Supervisor
    password: { type: String }, // hashed password for Supervisor
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
