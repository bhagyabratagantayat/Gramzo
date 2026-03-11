const Product = require('../models/Product');

// @desc    Add product
// @route   POST /api/products
exports.addProduct = async (req, res) => {
    try {
        const { title, description, price, category, image } = req.body;

        if (!title || !price) {
            return res.status(400).json({ success: false, error: 'Title and price are required' });
        }

        const product = await Product.create({
            title,
            description,
            price,
            category,
            sellerName: req.user.name,
            phone: req.user.phone,
            location: req.user.location,
            agentId: req.user._id,
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
        if (req.user.role !== 'Admin' && product.agentId?.toString() !== req.user._id.toString()) {
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
// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Ownership check
        if (req.user.role !== 'Admin' && product.agentId?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this product' });
        }

        const { title, description, price, category, image } = req.body;

        // Validation
        if (price && isNaN(price)) {
            return res.status(400).json({ success: false, error: 'Price must be a number' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('category');

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
