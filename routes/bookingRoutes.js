const { authorize } = require('../middleware/auth');

router.post('/create', createBooking); // Anyone can try to book
router.get('/', getBookings); // Filtered by phone in controller for users
router.patch('/status/:id', authorize(['Admin']), updateBookingStatus);
router.patch('/respond/:id', authorize(['Agent', 'Admin']), respondToBooking);
router.patch('/pay/:id', payBooking);

module.exports = router;

