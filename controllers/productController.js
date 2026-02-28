const Product = require('../models/Product');

// @desc    Add product
// @route   POST /api/products/add
exports.addProduct = async (req, res) => {
    try {
        const { title, description, price, category, sellerName, phone, location, agentId, image } = req.body;

        if (!title || !price) {
            return res.status(400).json({ success: false, error: 'Title and price are required' });
        }

        const product = await Product.create({
            title,
            description,
            price,
            category,
            sellerName,
            phone,
            location,
            agentId,
            image: image || "https://via.placeholder.com/300"
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
        const products = await Product.find().populate('category');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get agent's products
// @route   GET /api/products/agent/:agentId
exports.getAgentProducts = async (req, res) => {
    try {
        const products = await Product.find({ agentId: req.params.agentId }).populate('category');
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Ownership check
        const userRole = req.headers['x-user-role'];
        const agentIdHeader = req.headers['x-agent-id'];

        if (userRole !== 'Admin' && product.agentId?.toString() !== agentIdHeader) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this product' });
        }

        await product.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
