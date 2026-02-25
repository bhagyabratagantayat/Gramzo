const express = require('express');
const router = express.Router();
const { getUserBookings, getUserDashboardSummary } = require('../controllers/userController');

router.get('/bookings/:phone', getUserBookings);
router.get('/dashboard/:phone', getUserDashboardSummary);

module.exports = router;
