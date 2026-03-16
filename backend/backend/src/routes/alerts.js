// get/ api/alerts
// src/routes/alerts.js
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ alerts: [] }));
export default router;