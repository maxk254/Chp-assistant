import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Importing USSD route
import ussdHandler from "./ussd/handler.js";

// Importing API routes
import sessionsRoutes from "./routes/sessions.js";
import alertsRoutes from "./routes/alerts.js";
import facilitiesRoutes from "./routes/facilities.js";
import statsRoute from "./routes/stats.js";
import whatsappRoutes from "./routes/whatsapp.js";

// Importing auth route
import authRoutes from "./routes/auth.js"; // <-- new line, make sure this file exists

const app = express();
const mongoUri = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connecting to MongoDB when configured
if (mongoUri) {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error", err));
} else {
  console.warn(
    "MONGODB_URI is not set; starting API without database connection.",
  );
}

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "awake",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// USSD Routes
app.post("/ussd", ussdHandler);

// API Routes
app.use("/api/sessions", sessionsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/facilities", facilitiesRoutes);
app.use("/api/stats", statsRoute);
app.use("/api/whatsapp", whatsappRoutes);

// **Auth Routes**
app.use("/api/auth", authRoutes); // <-- new line added for auth

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
