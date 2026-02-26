const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    sellerName: {
        type: String
    },
    phone: {
        type: String
    },
    location: {
        type: String
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agent"
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/300"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
