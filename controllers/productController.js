const Product = require('../models/Product');

// @desc    Add product
// @route   POST /api/products/add
exports.addProduct = async (req, res) => {
    try {
        const { title, description, price, category, sellerName, phone, location, agentId } = req.body;

        // Check agent status if agentId is provided (assuming agents list products)
        if (agentId) {
            const Agent = require('../models/Agent');
            const agent = await Agent.findById(agentId);
            if (!agent) {
                return res.status(404).json({ success: false, error: 'Agent not found' });
            }
            if (!agent.isApproved || agent.isBlocked) {
                return res.status(403).json({ success: false, error: 'Access denied. Contact admin' });
            }
        }

        const product = await Product.create({
            title,
            description,
            price,
            category,
            sellerName,
            phone,
            location,
            agent: agentId,
            imageUrl
        });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        let query = {};
        if (req.query.phone) {
            query.phone = req.query.phone;
        }

        const products = await Product.find(query).populate('category');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
