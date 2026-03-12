const Booking = require('../models/Booking');

// @desc    Get all bookings for the logged-in user
// @route   GET /api/user/bookings
exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('service')
            .populate('agent');

        const formattedBookings = bookings.map(b => ({
            _id: b._id,
            serviceName: b.service?.title || 'Unknown Service',
            agentName: b.agent?.name || 'Verified Agent',
            date: b.date,
            status: b.status,
            paymentStatus: b.paymentStatus,
            amount: b.amount
        }));

        res.status(200).json({ success: true, data: formattedBookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get user dashboard summary
// @route   GET /api/user/dashboard
exports.getUserDashboardSummary = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('service')
            .populate('agent')
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === 'completed').length;
        const pendingBookings = bookings.filter(b => b.status === 'pending').length;
        const totalAmountSpent = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                completedBookings,
                pendingBookings,
                totalAmountSpent,
                recentBookings: bookings.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
