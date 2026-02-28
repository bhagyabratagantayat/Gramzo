const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["admin_notice", "order_update", "booking_request", "booking_update"],
        required: true
    },
    recipientRole: {
        type: String,
        enum: ["User", "Agent", "Admin", "All"],
        default: "All"
    },
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipientPhone: {
        type: String
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    orderId: {
        type: String // Placeholder for future Order model
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
