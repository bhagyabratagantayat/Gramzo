const Price = require('../models/Price');
const Agent = require('../models/Agent');

// @desc    Add market price
// @route   POST /api/prices/add
exports.addPrice = async (req, res) => {
    try {
        const { item, price, location, agentId } = req.body;

        // Find agent to check approval status
        const agent = await Agent.findById(agentId);
        if (!agent) {
            return res.status(404).json({ success: false, error: 'Agent not found' });
        }

        if (!agent.isApproved) {
            return res.status(400).json({ success: false, error: 'Agent not approved' });
        }

        const newPrice = await Price.create({
            item,
            price,
            location,
            agent: agentId
        });

        res.status(201).json({ success: true, data: newPrice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all market prices
// @route   GET /api/prices
exports.getPrices = async (req, res) => {
    try {
        const prices = await Price.find().populate('agent');
        res.status(200).json({ success: true, data: prices });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get prices by item name
// @route   GET /api/prices/item/:name
exports.getPriceByItem = async (req, res) => {
    try {
        const prices = await Price.find({ item: new RegExp(req.params.name, 'i') }).populate('agent');
        res.status(200).json({ success: true, data: prices });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
