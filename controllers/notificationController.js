const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

// @desc    Get notifications based on role
// @route   GET /api/notifications
exports.getNotifications = async (req, res) => {
    try {
        const { role, userId, agentId } = req.query;
        let query = {};

        if (role === 'Admin') {
            // Admin sees everything
            query = {};
        } else if (role === 'Agent') {
            // Agent sees Admin notices + bookings/orders related to them
            query = {
                $or: [
                    { recipientRole: 'All' },
                    { recipientRole: 'Agent', recipientId: agentId },
                    { type: 'admin_notice' }
                ]
            };
        } else {
            // User sees Admin notices + their own updates (by ID or Phone)
            query = {
                $or: [
                    { recipientRole: 'All' },
                    { recipientRole: 'User', recipientId: userId },
                    { recipientRole: 'User', recipientPhone: req.query.phone },
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
        const { title, message, type, recipientRole, recipientId, bookingId, role } = req.body;

        if (type === 'admin_notice' && role !== 'Admin') {
            return res.status(403).json({ success: false, error: 'Only admins can create notices' });
        }

        const notification = await Notification.create({
            title,
            message,
            type,
            recipientRole,
            recipientId,
            bookingId,
            senderId: req.body.senderId // or from auth middleware if available
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
        const { role } = req.body;
        if (role !== 'Admin') {
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
