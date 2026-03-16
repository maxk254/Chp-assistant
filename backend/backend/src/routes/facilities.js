// get/api/facilities
import express from 'express';
import Facility from '../models/Facility.js';

const router = express.Router();

// Get /api/facilities
router.get('/', async (req, res) => {
  try {
    const { county, type} = req.query;

    const filter = {};
    if (county) filter.county = county;
    if (type) filter.type = type;

    const facilities = await Facility.find(filter);

    res.json({ success: true, facilities});

  } catch (err) {
    res.status(500).json({ success: false, error: err.message});
  }
});
export default router;