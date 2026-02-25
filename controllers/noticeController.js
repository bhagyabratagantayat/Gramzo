const Notice = require('../models/Notice');

// @desc    Add notice  (admin only)
// @route   POST /api/notices/add
exports.addNotice = async (req, res) => {
    try {
        const { title, description, location, role } = req.body;

        // Role guard — only admin may post notices
        if (role !== 'admin') {
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
        const { role } = req.body;
        if (role !== 'admin') {
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
