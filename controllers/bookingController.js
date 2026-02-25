const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create a booking
// @route   POST /api/bookings/create
exports.createBooking = async (req, res) => {
    try {
        const { userName, phone, serviceId, date } = req.body;

        // Find service to get the agent
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
            service: serviceId,
            agent: service.agent,
            date,
            amount,
            platformFee,
            agentEarning
        });

        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('service')
            .populate('agent');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/status/:id
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const allowedStatuses = ["pending", "accepted", "completed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Credit agent if marked as completed
        if (status === "completed" && booking.status !== "completed") {
            const Agent = require('../models/Agent');
            await Agent.findByIdAndUpdate(booking.agent, {
                $inc: { earnings: booking.agentEarning }
            });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Simulate payment
// @route   PATCH /api/bookings/pay/:id
exports.payBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: "paid" },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
