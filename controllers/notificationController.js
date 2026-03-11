const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

// @desc    Get notifications based on role
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
    try {
        const { role, _id } = req.user;
        let query = {};

        if (role === 'Admin') {
            query = {};
        } else if (role === 'Agent') {
            query = {
                $or: [
                    { recipientRole: 'All' },
                    { recipientRole: 'Agent', recipientId: _id },
                    { type: 'admin_notice' }
                ]
            };
        } else {
            // User
            query = {
                $or: [
                    { recipientRole: 'All' },
                    { recipientRole: 'User', recipientId: _id },
                    { recipientRole: 'User', recipientPhone: req.user.phone },
                    { type: 'admin_notice' }
                ]
            };
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Create a notification/notice (Admin only for notices)
// @route   POST /api/notifications/create
exports.createNotification = async (req, res) => {
    try {
        const { title, message, type, recipientRole, recipientId, bookingId } = req.body;

        if (type === 'admin_notice' && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'Only admins can create notices' });
        }

        const notification = await Notification.create({
            title,
            message,
            type,
            recipientRole,
            recipientId,
            bookingId,
            senderId: req.user._id
        });

        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete notification (Admin only)
// @route   DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'Only admins can delete notifications' });
        }

        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
