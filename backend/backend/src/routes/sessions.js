// get api/sesions
// src/routes/sessions.js
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ sessions: [] }));
export default router;