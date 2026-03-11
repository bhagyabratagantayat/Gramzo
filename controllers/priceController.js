const Price = require('../models/Price');
const User = require('../models/User');

// @desc    Add market price
// @route   POST /api/prices/add
exports.addPrice = async (req, res) => {
    try {
        const { item, price, location } = req.body;

        // Check requester status (from protect middleware)
        if (req.user.role === 'Agent') {
            if (!req.user.isApproved) {
                return res.status(403).json({ success: false, error: 'Access denied. Agent not approved.' });
            }
            if (req.user.isBlocked) {
                return res.status(403).json({ success: false, error: 'Access denied. Account blocked.' });
            }
        }

        const newPrice = await Price.create({
            item,
            price,
            location,
            agent: req.user._id
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
