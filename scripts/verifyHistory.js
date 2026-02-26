require('dotenv').config();
const mongoose = require('mongoose');
const MarketPrice = require('../models/MarketPrice');

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const itemName = 'Potato';
        const category = 'Vegetables';

        // 1. Initial State
        let item = await MarketPrice.findOne({ itemName, category });
        if (!item) {
            console.log('Item not found, creating one...');
            item = await MarketPrice.create({
                itemName,
                category,
                price: 30,
                updatedBy: 'Initial',
                role: 'agent'
            });
        }
        console.log('Initial Price:', item.price);
        console.log('History Before Update:', item.priceHistory.length);

        // 2. Mock Update #1
        const oldPrice = item.price;
        const oldUpdatedBy = item.updatedBy;
        const oldRole = item.role;
        const oldDate = item.createdAt;

        item.priceHistory.push({
            price: oldPrice,
            updatedBy: oldUpdatedBy,
            role: oldRole,
            date: oldDate
        });

        item.price = 35;
        item.updatedBy = 'Admin';
        item.role = 'agent';
        item.createdAt = Date.now();
        await item.save();

        console.log('Updated Price:', item.price);
        console.log('History After Update 1:', item.priceHistory.length);
        console.log('Last History entry:', item.priceHistory[item.priceHistory.length - 1]);

        // 3. Mock Update #2 (Simulate multiple updates)
        const currentPrice = item.price;
        item.priceHistory.push({
            price: currentPrice,
            updatedBy: item.updatedBy,
            role: item.role,
            date: item.createdAt
        });
        item.price = 40;
        item.updatedBy = 'User';
        item.role = 'user';
        item.createdAt = Date.now();
        await item.save();

        console.log('Final Price:', item.price);
        console.log('History After Update 2:', item.priceHistory.length);

        process.exit(0);
    } catch (e) {
        console.error('Verification failed:', e);
        process.exit(1);
    }
};

verify();
