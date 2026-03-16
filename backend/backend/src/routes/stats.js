// get/api/status
// src/routes/stats.js
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ stats: {} }));
export default router;