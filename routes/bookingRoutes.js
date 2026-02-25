const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, payBooking, respondToBooking } = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/', getBookings);
router.patch('/status/:id', updateBookingStatus);
router.patch('/respond/:id', respondToBooking);   // Agent: accept / reject
router.patch('/pay/:id', payBooking);

module.exports = router;

