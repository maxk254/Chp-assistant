// get/ api/alerts
import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('facility')
      .populate({
        paths: 'sessions',
        populate: [
          { path: 'patient'},
          { path: 'chp'}
        ]
      })
      .sort({ cretedAt: -1});

      res.json({ success: true, alerts});

  } catch (err) {
    res.status(500).json({ success: false, error: err.message})
  }
});
export default router;