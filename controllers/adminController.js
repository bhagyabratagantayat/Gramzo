const Agent = require('../models/Agent');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Product = require('../models/Product');

// @desc    Get all agents for admin
// @route   GET /api/admin/agents
exports.getAgents = async (req, res) => {
    try {
        const agents = await Agent.find().populate('category');
        res.status(200).json({ success: true, data: agents });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Approve agent
// @route   PATCH /api/admin/approve/:id
exports.approveAgent = async (req, res) => {
    try {
        const agent = await Agent.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true, runValidators: true }
        );

        if (!agent) {
            return res.status(404).json({ success: false, error: 'Agent not found' });
        }

        res.status(200).json({ success: true, data: agent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Block/Unblock agent
// @route   PATCH /api/admin/block/:id
exports.blockAgent = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            return res.status(404).json({ success: false, error: 'Agent not found' });
        }

        agent.isBlocked = !agent.isBlocked;
        await agent.save();

        res.status(200).json({ success: true, data: agent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all bookings for admin
// @route   GET /api/admin/bookings
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

// @desc    Platform overview stats
// @route   GET /api/admin/overview
exports.getOverview = async (req, res) => {
    try {
        const totalAgents = await Agent.countDocuments();
        const totalServices = await Service.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalAgents,
                totalServices,
                totalBookings,
                totalProducts
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
