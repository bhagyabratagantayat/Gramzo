const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    phone: {
        type: String
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    },
    date: {
        type: Date
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "completed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
