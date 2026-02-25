const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String // URL
    },
    location: {
        type: String
    },
    updatedBy: {
        type: String // user or agent name
    },
    role: {
        type: String,
        enum: ['user', 'agent']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
