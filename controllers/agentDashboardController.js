const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

// Validation helper
const validateAgent = async (user) => {
    console.log('Validating Agent for User ID:', user?._id);
    const agentId = user._id;
    const agent = await User.findOne({ _id: agentId, role: { $in: ['Agent', 'Admin'] } });
    if (!agent) {
        console.warn('Agent check failed: User not found or role mismatch');
        return { error: 'Agent not found', status: 404 };
    }
    if (user.role !== 'Admin') {
        if (!agent.isApproved) {
            console.warn('Agent check failed: Not approved');
            return { error: 'Access denied. Agent not approved.', status: 403 };
        }
        if (agent.isBlocked) {
            console.warn('Agent check failed: Blocked');
            return { error: 'Access denied. Contact admin', status: 403 };
        }
    }
    console.log('Agent validation successful');
    return { agent };
};

// @desc    Get agent dashboard summary
// @route   GET /api/agent/dashboard
exports.getDashboardSummary = async (req, res) => {
    console.log('GET /api/agent/dashboard - User:', req.user?._id);
    try {
        const { error, status, agent } = await validateAgent(req.user);
        if (error) return res.status(status).json({ success: false, error });

        const servicesCount = await Service.countDocuments({ agentId: agent._id });
        const bookingsCount = await Booking.countDocuments({ agent: agent._id });

        console.log(`Summary - Services: ${servicesCount}, Bookings: ${bookingsCount}`);
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
        console.error('Dashboard Summary Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent services
// @route   GET /api/agent/services
exports.getAgentServices = async (req, res) => {
    console.log('GET /api/agent/services - User:', req.user?._id);
    try {
        const { error, status } = await validateAgent(req.user);
        if (error) return res.status(status).json({ success: false, error });

        const services = await Service.find({ agentId: req.user._id });
        console.log(`Found ${services.length} services`);
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error('Agent Services Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent bookings
// @route   GET /api/agent/bookings
exports.getAgentBookings = async (req, res) => {
    console.log('GET /api/agent/bookings - User:', req.user?._id);
    try {
        const { error, status } = await validateAgent(req.user);
        if (error) return res.status(status).json({ success: false, error });

        const bookings = await Booking.find({ agent: req.user._id }).populate('service');
        console.log(`Found ${bookings.length} bookings`);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Agent Bookings Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent earnings and recent bookings
// @route   GET /api/agent/earnings
exports.getAgentEarnings = async (req, res) => {
    console.log('GET /api/agent/earnings - User:', req.user?._id);
    try {
        const { error, status, agent } = await validateAgent(req.user);
        if (error) return res.status(status).json({ success: false, error });

        const recentBookings = await Booking.find({
            agent: req.user._id,
            status: 'completed'
        })
            .sort({ createdAt: -1 })
            .limit(10);

        console.log(`Found ${recentBookings.length} recent bookings. Earnings: ${agent.earnings}`);
        res.status(200).json({
            success: true,
            data: {
                totalEarnings: agent.earnings,
                recentBookings
            }
        });
    } catch (error) {
        console.error('Agent Earnings Error:', error);
        res.status(400).json({ success: false, error: error.message });
    }
};
