const Agent = require('../models/Agent');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Validation helper
const validateAgent = async (agentId) => {
    const agent = await Agent.findById(agentId);
    if (!agent) return { error: 'Agent not found', status: 404 };
    if (!agent.isApproved) return { error: 'Access denied. Agent not approved.', status: 403 };
    if (agent.isBlocked) return { error: 'Access denied. Contact admin', status: 403 };
    return { agent };
};

// @desc    Get agent dashboard summary
// @route   GET /api/agent/dashboard/:agentId
exports.getDashboardSummary = async (req, res) => {
    try {
        const { error, status, agent } = await validateAgent(req.params.agentId);
        if (error) return res.status(status).json({ success: false, error });

        const servicesCount = await Service.countDocuments({ agentId: agent._id });
        const bookingsCount = await Booking.countDocuments({ agent: agent._id });

        res.status(200).json({
            success: true,
            data: {
                agent,
                totalEarnings: agent.earnings,
                servicesCount,
                bookingsCount
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent services
// @route   GET /api/agent/services/:agentId
exports.getAgentServices = async (req, res) => {
    try {
        const { error, status } = await validateAgent(req.params.agentId);
        if (error) return res.status(status).json({ success: false, error });

        const services = await Service.find({ agentId: req.params.agentId });
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent bookings
// @route   GET /api/agent/bookings/:agentId
exports.getAgentBookings = async (req, res) => {
    try {
        const { error, status } = await validateAgent(req.params.agentId);
        if (error) return res.status(status).json({ success: false, error });

        const bookings = await Booking.find({ agent: req.params.agentId }).populate('service');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent earnings and recent bookings
// @route   GET /api/agent/earnings/:agentId
exports.getAgentEarnings = async (req, res) => {
    try {
        const { error, status, agent } = await validateAgent(req.params.agentId);
        if (error) return res.status(status).json({ success: false, error });

        const recentBookings = await Booking.find({
            agent: req.params.agentId,
            status: 'completed'
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                totalEarnings: agent.earnings,
                recentBookings
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
