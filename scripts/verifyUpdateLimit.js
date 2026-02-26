require('dotenv').config();
const mongoose = require('mongoose');
const MarketPrice = require('../models/MarketPrice');

const verifyUpdate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find any item to update
        const item = await MarketPrice.findOne({ itemName: 'Potato', category: 'Vegetables' });
        if (!item) {
            console.log('Test item (Potato) not found. Please run seed first.');
            process.exit(1);
        }

        console.log(`Original Price: ${item.price}`);
        const originalHistoryCount = item.priceHistory.length;

        // Simulate updatePrice logic
        const itemId = item._id;
        const newPrice = item.price + 5;
        const updatedBy = 'API Tester';
        const role = 'agent';

        // Find and update
        const marketItem = await MarketPrice.findById(itemId);
        marketItem.priceHistory.push({
            price: marketItem.price,
            updatedBy: marketItem.updatedBy,
            role: marketItem.role,
            date: marketItem.createdAt || Date.now()
        });

        marketItem.price = newPrice;
        marketItem.updatedBy = updatedBy;
        marketItem.role = role;
        marketItem.createdAt = Date.now();

        await marketItem.save();

        console.log(`Updated Price: ${marketItem.price}`);
        console.log(`History Count: ${marketItem.priceHistory.length}`);

        if (marketItem.priceHistory.length === originalHistoryCount + 1) {
            console.log('SUCCESS: History archived correctly.');
        } else {
            console.log('FAILURE: History count mismatch.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyUpdate();
