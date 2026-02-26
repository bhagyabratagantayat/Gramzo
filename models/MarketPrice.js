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
        enum: ['User', 'Agent', 'Admin']
    },
    priceHistory: [{
        price: Number,
        updatedBy: String,
        date: { type: Date, default: Date.now }
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for scalable real-time queries
marketPriceSchema.index({ itemName: 1 });
marketPriceSchema.index({ category: 1 });
marketPriceSchema.index({ location: 1 });
marketPriceSchema.index({ updatedAt: -1 }); // For "recently updated" sorting

marketPriceSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
