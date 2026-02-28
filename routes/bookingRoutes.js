const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, respondToBooking, payBooking } = require('../controllers/bookingController');
const { authorize } = require('../middleware/auth');

router.post('/create', createBooking);
router.get('/', getBookings);
router.patch('/status/:id', authorize(['Admin']), updateBookingStatus);
router.patch('/:id/status', authorize(['Agent', 'Admin']), respondToBooking);
router.patch('/respond/:id', authorize(['Agent', 'Admin']), respondToBooking);
router.patch('/pay/:id', payBooking);

module.exports = router;
