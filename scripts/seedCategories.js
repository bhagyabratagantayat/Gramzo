const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Category = require('../models/Category');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const categories = [
    { "name": "Salon", "type": "service" },
    { "name": "Electrician", "type": "service" },
    { "name": "Plumber", "type": "service" },
    { "name": "Mobile Repair", "type": "service" },
    { "name": "AC Repair", "type": "service" },
    { "name": "Carpenter", "type": "service" },
    { "name": "Cleaning Service", "type": "service" },

    { "name": "Event Management", "type": "service" },
    { "name": "Tent House", "type": "service" },
    { "name": "Catering", "type": "service" },
    { "name": "Photography", "type": "service" },

    { "name": "Property Dealer", "type": "service" },
    { "name": "House Rent", "type": "service" },
    { "name": "Land Sale", "type": "service" },

    { "name": "Vegetables", "type": "product" },
    { "name": "Fruits", "type": "product" },
    { "name": "Groceries", "type": "product" },
    { "name": "Second Hand Items", "type": "product" },

    { "name": "Farming Tools", "type": "product" },
    { "name": "Seeds & Fertilizers", "type": "product" },
    { "name": "Dairy Products", "type": "product" }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        const ops = categories.map(cat => ({
            updateOne: {
                filter: { name: cat.name },
                update: { $set: cat },
                upsert: true
            }
        }));

        const result = await Category.bulkWrite(ops);
        console.log(`Categories operation completed:`);
        console.log(`- Matched: ${result.nMatched}`);
        console.log(`- Upserted: ${result.nUpserted}`);
        console.log(`- Modified: ${result.nModified}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
