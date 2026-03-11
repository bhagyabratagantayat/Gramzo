const express = require('express');
const router = express.Router();
const {
    getDashboardSummary,
    getAgentServices,
    getAgentBookings,
    getAgentEarnings
} = require('../controllers/agentDashboardController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Agent', 'Admin'));

router.get('/dashboard', getDashboardSummary);
router.get('/services', getAgentServices);
router.get('/bookings', getAgentBookings);
router.get('/earnings', getAgentEarnings);

module.exports = router;
