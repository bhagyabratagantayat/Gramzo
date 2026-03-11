const Notice = require('../models/Notice');

// @desc    Add notice  (admin only)
// @route   POST /api/notices
exports.addNotice = async (req, res) => {
    try {
        const { title, description, location } = req.body;

        if (!title || !description || !location) {
            return res.status(400).json({ success: false, error: 'Title, description, and location are required.' });
        }

        // Role guard — only admin may post notices (handled by protect/authorize middleware, but double check here)
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'Forbidden: only admins can post notices.' });
        }

        const notice = await Notice.create({ title, description, location });
        res.status(201).json({ success: true, data: notice });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all notices
// @route   GET /api/notices
exports.getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notices });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete notice  (admin only)
// @route   DELETE /api/notices/:id
exports.deleteNotice = async (req, res) => {
    try {
        // Role guard
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'Forbidden: only admins can delete notices.' });
        }

        const notice = await Notice.findByIdAndDelete(req.params.id);
        if (!notice) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
