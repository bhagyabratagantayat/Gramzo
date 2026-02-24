const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Price', priceSchema);
