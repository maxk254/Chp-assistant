// get/api/status
import express from 'express';
import Session from '../models/Session.js';
import Alert from '../models/Alert.js';
import Chp from '../models/Chp.js';


const router = express.Router();

// Get /api/stats
router.get('/', async (req, res) => {
  try {
    // Get today's date range
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const todayFilter = {createdAt: {$gte: start, $lte:end}};

    // Run all queries at the same time
    const [
      totalSessions,
      emergencies,
      referrals,
      activeChps,
      lowCount,
      mediumCount,
      highCount,
      emergencyCount
    ] = await Promise.all([
      Session.countDocuments(todayFilter),
      Session.countDocuments({...todayFilter, severity: 'EMERGENCY'}),
      Session.countDocuments({...todayFilter, referToFacility:true}),
      Session.distinct('chw', todayFilter).then(r => r.length),
      Session.countDocuments({ ...todayFilter, severity: 'LOW' }),
      Session.countDocuments({ ...todayFilter, severity: 'MEDIUM' }),
      Session.countDocuments({ ...todayFilter, severity: 'HIGH' }),
      Session.countDocuments({ ...todayFilter, severity: 'EMERGENCY' }),
    ]);

    res.json({
      success: true,
      totalSessions,
      emergencies,
      referrals,
      activeChps,
      bySeverity: {
        LOW: lowCount,
        MEDIUM: mediumCount,
        HIGH: highCount,
        EMERGENCY: emergencyCount
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message});
  }
});
export default router;