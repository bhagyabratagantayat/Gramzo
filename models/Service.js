const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    },
    availableTime: {
        type: String
    },
    location: {
        type: String
    },
    // Extended location fields — optional, backward-compatible
    locationName: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    requiresAppointment: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String  // Optional cover image for the service listing
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', serviceSchema);
