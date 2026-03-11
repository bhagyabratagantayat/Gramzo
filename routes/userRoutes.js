const express = require('express');
const router = express.Router();
const { getUserBookings, getUserDashboardSummary } = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/bookings', getUserBookings);
router.get('/dashboard', getUserDashboardSummary);

module.exports = router;
