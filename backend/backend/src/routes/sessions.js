// get api/sesions
import express from 'express';
import Session from '../models/Session.js';

const router = express.Router();

// get /api/sessions
router.get('/', async (req, res) =>{
  try {
    const {date, county, severity} = req.query;

    // filter function
    const filter = {};

    if (severity) {
      filter.severity = severity;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0,0,0,o);
      const end = new Date(date)
      end.setHours(23,59,59,999);
      filter.createdAt = {$gte: start, $lte: end};
    }

    const sessions = await Session.find(filter)
    .populate('patients')
    .populate('chp')
    .populate({
      path: 'alert',
      populate: {path: 'facility'}
    })
    .sort({ createdAt:-1}) // newest first

    res.json({ success: true, sessions});
  } catch (err) {
    console.error('Sessions route error:', err);
    res.status(500).json({success: false, error: err.message});
  }
});

// GET / api/sessions/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
    .populate('patient')
    .populate('chp')
    .populate({
      path: 'alert',
      populate: {path: 'facility'}
    });

    if (!session) {
      return res.status(404).json({ success:false, error: 'Session not found'});
    }

    res.json({ success: true, session});

  } catch (err) {
    res.status(500).json({ success:false, error: err.message});
  }
});
export default router;