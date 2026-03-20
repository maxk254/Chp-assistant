
// ai-services/src/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "AI service awake" });
});

// Diagnose route
import diagnoseHandler from "./diagnose.js";
app.post("/diagnose", diagnoseHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🧠 AI Service running on port ${PORT}`);
});