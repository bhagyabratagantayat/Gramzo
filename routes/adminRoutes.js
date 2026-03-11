const express = require('express');
const router = express.Router();
const {
    getAgents,
    approveAgent,
    blockAgent,
    getBookings,
    getOverview
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply admin check to all routes
router.use(protect);
router.use(authorize('Admin'));

router.get('/agents', getAgents);
router.patch('/approve/:id', approveAgent);
router.patch('/block/:id', blockAgent);
router.get('/bookings', getBookings);
router.get('/overview', getOverview);

module.exports = router;
