// get/api/whatsapp
// src/routes/whatsapp.js
import express from "express";
const router = express.Router();
router.get('/', (req, res) => res.json({whatsapp: {}}));
export default router;