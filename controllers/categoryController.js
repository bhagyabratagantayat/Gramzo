const Category = require('../models/Category');

// @desc    Add new category
// @route   POST /api/categories/add
exports.addCategory = async (req, res) => {
    try {
        const { name, type } = req.body;
        const category = await Category.create({ name, type });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
