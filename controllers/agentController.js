const Agent = require('../models/Agent');

// @desc    Add or Get agent (Login/Signup for demo)
// @route   POST /api/agents/add
exports.addAgent = async (req, res) => {
    try {
        const { name, phone, location, category } = req.body;

        // Find existing agent by phone
        let agent = await Agent.findOne({ phone });

        if (agent) {
            return res.status(200).json({ success: true, data: agent });
        }

        agent = await Agent.create({ name, phone, location, category });
        res.status(201).json({ success: true, data: agent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Approve agent
// @route   PATCH /api/agents/approve/:id
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

// @desc    Get all agents
// @route   GET /api/agents
exports.getAgents = async (req, res) => {
    try {
        const agents = await Agent.find().populate('category');
        res.status(200).json({ success: true, data: agents });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Block/Unblock agent
// @route   PATCH /api/agents/block/:id
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

// @desc    Get agent earnings
// @route   GET /api/agents/earnings/:id
exports.getEarnings = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id).select('earnings');

        if (!agent) {
            return res.status(404).json({ success: false, error: 'Agent not found' });
        }

        res.status(200).json({ success: true, data: { earnings: agent.earnings } });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
