require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Category = require('../models/Category');

const productCategories = [
    'Vegetables', 'Electronics', 'Clothes', 'Grocery', 'Pharmacy',
    'Home Essentials', 'Mobile Accessories', 'Construction Materials', 'Furniture', 'Agricultural Tools'
];

const serviceCategories = [
    'Beauty', 'Repairs', 'Electrician', 'Plumbing', 'Cleaning',
    'AC Repair', 'Computer Repair', 'Home Maintenance', 'Real Estate Consultation', 'Delivery Services'
];

const seedLargeDemoData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // 1. Ensure Demo Agent exists
        let agent = await User.findOne({ email: 'agent@gramzo.com' });
        if (!agent) {
            agent = await User.create({
                name: 'Demo Agent',
                email: 'agent@gramzo.com',
                password: 'agent123',
                phone: '2345678901',
                role: 'Agent',
                location: 'Chicago',
                isApproved: true
            });
            console.log('Created Demo Agent.');
        } else {
            console.log('Demo Agent found.');
        }

        // 2. Ensure Categories
        console.log('Ensuring all categories exist...');
        const catMap = {};
        for (const catName of productCategories) {
            let cat = await Category.findOne({ name: catName, type: 'product' });
            if (!cat) {
                cat = await Category.create({ name: catName, type: 'product' });
            }
            catMap[catName] = cat._id;
        }
        for (const catName of serviceCategories) {
            let cat = await Category.findOne({ name: catName, type: 'service' });
            if (!cat) {
                cat = await Category.create({ name: catName, type: 'service' });
            }
            catMap[catName] = cat._id;
        }

        // 3. Clear existing Products and Services to avoid duplicates/bloat
        await Product.deleteMany({ agentId: agent._id });
        await Service.deleteMany({ agentId: agent._id });
        console.log('Cleared existing agent listings.');

        // 4. Create 10 Products per category
        console.log('Seeding 100 Products...');
        const productsToInsert = [];
        for (const catName of productCategories) {
            for (let i = 1; i <= 10; i++) {
                productsToInsert.push({
                    title: `${catName} Item ${i}`,
                    description: `This is a high-quality ${catName} product, perfect for your daily needs. Durable and reliable.`,
                    category: catMap[catName],
                    price: Math.floor(Math.random() * 500) + 10,
                    image: `https://source.unsplash.com/featured/?${catName.replace(' ', ',')},${i}`,
                    location: i % 2 === 0 ? 'New York' : 'Chicago',
                    agentId: agent._id
                });
            }
        }
        await Product.insertMany(productsToInsert);

        // 5. Create 10 Services per category
        console.log('Seeding 100 Services...');
        const servicesToInsert = [];
        for (const catName of serviceCategories) {
            for (let i = 1; i <= 10; i++) {
                servicesToInsert.push({
                    title: `${catName} Professional ${i}`,
                    description: `Expert ${catName} service provided by certified professionals. 100% satisfaction guaranteed.`,
                    category: catMap[catName],
                    price: Math.floor(Math.random() * 200) + 20, // using price as requested in Step 5 description
                    image: `https://source.unsplash.com/featured/?${catName.replace(' ', ',')},service,${i}`,
                    location: i % 2 === 0 ? 'Miami' : 'New York',
                    agentId: agent._id,
                    availableTime: '9:00 AM - 6:00 PM'
                });
            }
        }
        await Service.insertMany(servicesToInsert);

        console.log('Large-scale seeding complete!');
        console.log(`Summary: 100 Products and 100 Services seeded for agent ${agent.email}`);
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedLargeDemoData();
