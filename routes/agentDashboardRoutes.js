const express = require('express');
const router = express.Router();
const {
    getDashboardSummary,
    getAgentServices,
    getAgentBookings,
    getAgentEarnings
} = require('../controllers/agentDashboardController');

router.get('/dashboard/:agentId', getDashboardSummary);
router.get('/services/:agentId', getAgentServices);
router.get('/bookings/:agentId', getAgentBookings);
router.get('/earnings/:agentId', getAgentEarnings);

module.exports = router;
