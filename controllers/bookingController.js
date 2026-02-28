const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Notification = require('../models/Notification');


// @desc    Create a booking
// @route   POST /api/bookings/create
exports.createBooking = async (req, res) => {
    try {
        const { userName, phone, serviceId, date, time } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }

        const amount = service.price;
        const platformFee = amount * 0.1;
        const agentEarning = amount - platformFee;

        const booking = await Booking.create({
            userName,
            phone,
            userId: phone, // Mapping phone as userId for this app's logic
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
            message: `New booking for ${service.title} from ${userName}`,
            type: 'booking_request',
            recipientRole: 'Agent',
            recipientId: service.agentId,
            bookingId: booking._id
        });

    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all bookings (Admin) or own bookings by phone (User)
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
    try {
        const filter = {};
        if (req.query.phone) filter.phone = req.query.phone;
        if (req.query.agentId) filter.agent = req.query.agentId;

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
            const Agent = require('../models/Agent');
            await Agent.findByIdAndUpdate(booking.agent, { $inc: { earnings: booking.agentEarning } });
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
        const agentIdHeader = req.headers['x-agent-id'];
        const userRole = req.headers['x-user-role'];

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Status must be "accepted" or "rejected"' });
        }

        const booking = await Booking.findById(req.params.id).populate('service');
        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Ownership check: Only the agent for this booking or Admin can respond
        if (userRole !== 'Admin' && booking.agent.toString() !== agentIdHeader) {
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
            message: `Your booking for ${booking.service?.title || 'item'} (ID: ${booking.service?._id || booking.service || 'N/A'}) has been ${status}.`,
            type: 'booking_update',
            recipientRole: 'User',
            recipientPhone: booking.phone,
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


