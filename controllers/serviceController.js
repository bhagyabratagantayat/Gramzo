const Service = require('../models/Service');
const Agent = require('../models/Agent');

// @desc    Add service
// @route   POST /api/services/add
exports.addService = async (req, res) => {
    try {
        const { title, description, price, category, agent, availableTime, location } = req.body;

        // Check if agent exists and is approved
        const agentData = await Agent.findById(agent);
        if (!agentData) {
            return res.status(404).json({ success: false, error: 'Agent not found' });
        }

        if (!agentData.isApproved) {
            return res.status(403).json({ success: false, error: 'Access denied. Agent is not approved.' });
        }

        if (agentData.isBlocked) {
            return res.status(403).json({ success: false, error: 'Access denied. Contact admin' });
        }

        const service = await Service.create({
            title,
            description,
            price,
            category,
            agent,
            availableTime,
            location
        });

        res.status(201).json({ success: true, data: service });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all services
// @route   GET /api/services
exports.getServices = async (req, res) => {
    try {
        let query = {};
        if (req.query.agent) {
            query.agent = req.query.agent;
        }

        const services = await Service.find(query).populate('category').populate('agent');
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({ success: false, error: 'Service not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
