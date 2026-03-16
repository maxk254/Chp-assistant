// get/api/facilities
// src/routes/facilities.js
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ facilities: [] }));
export default router;