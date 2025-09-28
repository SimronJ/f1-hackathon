const express = require('express');
const router = express.Router();
const { getEngagementService } = require('../services/engagementService');

router.get('/', (req, res) => {
  try {
    const engagementService = getEngagementService();
    const pulseScores = engagementService ? engagementService.getAllPulseScores() : {};
    
    res.json({
      success: true,
      pulseScores,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Pulse API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;