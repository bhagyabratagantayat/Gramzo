const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a booking
// @route   POST /api/bookings/create
exports.createBooking = async (req, res) => {
    try {
        const { serviceId, date, time } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }

        const amount = service.price;
        const platformFee = amount * 0.1;
        const agentEarning = amount - platformFee;

        const booking = await Booking.create({
            userName: req.user.name,
            phone: req.user.phone,
            userId: req.user._id,
            service: serviceId,
            agent: service.agentId,
            date,
            ...(time !== undefined && { time }),
            amount,
            platformFee,
            agentEarning,
            status: "pending"
        });

        res.status(201).json({ success: true, data: booking });

        // Trigger notification for Agent
        await Notification.create({
            title: 'New Booking Request',
            message: `New booking for ${service.title} from ${req.user.name}`,
            type: 'booking_request',
            recipientRole: 'Agent',
            recipientId: service.agentId,
            bookingId: booking._id
        });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all bookings (Admin) or own bookings (User/Agent)
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
    try {
        const filter = {};

        // RBAC Filter
        if (req.user.role === 'User') {
            filter.userId = req.user._id;
        } else if (req.user.role === 'Agent') {
            filter.agent = req.user._id;
        }
        // Admin sees all

        const bookings = await Booking.find(filter)
            .populate('service')
            .populate('agent')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update booking status (Admin/Internal)
// @route   PATCH /api/bookings/status/:id
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        if (status === "completed" && booking.status !== "completed") {
            // Update earnings in User model for Agent
            await User.findByIdAndUpdate(booking.agent, { $inc: { earnings: booking.agentEarning } });
        }

        booking.status = status;
        await booking.save();
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Agent responds to a pending booking
// @route   PATCH /api/bookings/respond/:id
exports.respondToBooking = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Status must be "accepted" or "rejected"' });
        }

        const booking = await Booking.findById(req.params.id).populate('service');
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Ownership check: Only the agent for this booking or Admin can respond
        if (req.user.role !== 'Admin' && booking.agent.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized to respond to this booking' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, error: `Already ${booking.status}` });
        }

        booking.status = status;
        await booking.save();
        res.status(200).json({ success: true, data: booking });

        // Trigger notification for User/Admin
        await Notification.create({
            title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your booking for ${booking.service?.title || 'item'} has been ${status}.`,
            type: 'booking_update',
            recipientRole: 'User',
            recipientId: booking.userId,
            bookingId: booking._id
        });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Simulate payment
// @route   PATCH /api/bookings/pay/:id
exports.payBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { paymentStatus: "paid" }, { new: true });
        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


