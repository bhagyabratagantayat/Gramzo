const MarketPrice = require('../models/MarketPrice');

// @desc    Add or Update Market Price
// @route   POST /api/market/add
// @access  Public (Demo)
exports.addOrUpdatePrice = async (req, res) => {
    try {
        const { itemName, category, price, image, location, updatedBy, role } = req.body;

        if (!itemName || !category || !price) {
            return res.status(400).json({ success: false, error: 'Please provide itemName, category, and price' });
        }

        // Find existing item by name and category (simple upsert logic)
        let marketItem = await MarketPrice.findOne({ itemName, category });

        if (marketItem) {
            // Update existing
            marketItem.price = price;
            marketItem.image = image || marketItem.image;
            marketItem.location = location || marketItem.location;
            marketItem.updatedBy = updatedBy || marketItem.updatedBy;
            marketItem.role = role || marketItem.role;
            marketItem.createdAt = Date.now(); // Update timestamp
            await marketItem.save();
            return res.status(200).json({ success: true, message: 'Price updated', data: marketItem });
        }

        // Create new
        marketItem = await MarketPrice.create({
            itemName,
            category,
            price,
            image,
            location,
            updatedBy,
            role
        });

        res.status(201).json({ success: true, message: 'New item added', data: marketItem });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all market prices
// @route   GET /api/market
exports.getAllPrices = async (req, res) => {
    try {
        const prices = await MarketPrice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: prices.length, data: prices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get prices by category
// @route   GET /api/market/category/:category
exports.getPricesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const prices = await MarketPrice.find({ category: new RegExp(category, 'i') }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: prices.length, data: prices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
