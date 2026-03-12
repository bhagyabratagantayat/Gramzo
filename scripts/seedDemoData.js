require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Service = require('../models/Service');
const Category = require('../models/Category');

const seedDemoData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // 1. Create Demo Users
        console.log('Creating Demo Users...');
        const demoUsers = [
            { name: 'Admin User', email: 'admin@gramzo.com', password: 'admin123', phone: '1234567890', role: 'Admin', location: 'New York', isApproved: true },
            { name: 'Agent User', email: 'agent@gramzo.com', password: 'agent123', phone: '2345678901', role: 'Agent', location: 'Chicago', isApproved: true },
            { name: 'Regular User', email: 'user@gramzo.com', password: 'user123', phone: '3456789012', role: 'User', location: 'Miami', isApproved: true }
        ];

        for (const u of demoUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created ${u.role}: ${u.email}`);
            } else {
                console.log(`${u.role} already exists: ${u.email}`);
            }
        }

        const agent = await User.findOne({ email: 'agent@gramzo.com' });

        // 2. Create Categories
        console.log('Ensuring Categories...');
        const categories = [
            { name: 'Beauty', type: 'service' },
            { name: 'Repairs', type: 'service' },
            { name: 'Electronics', type: 'product' },
            { name: 'Grocery', type: 'product' },
            { name: 'Real Estate', type: 'service' },
            { name: 'Clothing', type: 'product' },
            { name: 'Pharmacy', type: 'product' }
        ];

        const categoryMap = {};
        for (const cat of categories) {
            let category = await Category.findOne({ name: cat.name });
            if (!category) {
                category = await Category.create(cat);
                console.log(`Created Category: ${cat.name}`);
            }
            categoryMap[cat.name] = category._id;
        }

        // 3. Create Demo Services (10-15)
        console.log('Creating Demo Services...');
        const services = [
            { title: 'Hair Styling & Spa', description: 'Premium hair styling and relaxation spa services.', price: 50, category: categoryMap['Beauty'], agentId: agent._id, location: 'New York', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035' },
            { title: 'AC Repair & Maintenance', description: 'Expert AC repair and gas refilling services.', price: 30, category: categoryMap['Repairs'], agentId: agent._id, location: 'Chicago', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789' },
            { title: 'Smartphone Repair', description: 'Quick screen replacement and battery fixes.', price: 40, category: categoryMap['Repairs'], agentId: agent._id, location: 'Chicago', image: 'https://images.unsplash.com/photo-1556656793-062ff98782ee' },
            { title: 'Luxury Apartment Rental', description: 'Beautiful 2BHK apartment in the city center.', price: 1500, category: categoryMap['Real Estate'], agentId: agent._id, location: 'Miami', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' },
            { title: 'House Cleaning', description: 'Deep cleaning for houses and offices.', price: 60, category: categoryMap['Repairs'], agentId: agent._id, location: 'New York', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac' },
            { title: 'Plumbing Services', description: 'Fixing leaks, pipes, and bathroom fittings.', price: 25, category: categoryMap['Repairs'], agentId: agent._id, location: 'Miami', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f963' },
            { title: 'Pest Control', description: 'Effective pest control for homes and businesses.', price: 45, category: categoryMap['Repairs'], agentId: agent._id, location: 'Chicago', image: 'https://images.unsplash.com/photo-1624990842277-c990a162b7ae' },
            { title: 'Bridal Makeup', description: 'Professional bridal makeup for your special day.', price: 200, category: categoryMap['Beauty'], agentId: agent._id, location: 'New York', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f' },
            { title: 'Electrician Services', description: 'Wiring, circuit fixing, and electrical repairs.', price: 35, category: categoryMap['Repairs'], agentId: agent._id, location: 'Miami', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e' },
            { title: 'Personal Gym Trainer', description: 'Certified trainer for customized workout plans.', price: 80, category: categoryMap['Beauty'], agentId: agent._id, location: 'New York', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' },
            { title: 'Commercial Property Sale', description: 'Prime commercial space for business setup.', price: 500000, category: categoryMap['Real Estate'], agentId: agent._id, location: 'Chicago', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' },
            { title: 'Nail Art & Manicure', description: 'Creative nail designs and relaxing manicure.', price: 20, category: categoryMap['Beauty'], agentId: agent._id, location: 'Miami', image: 'https://images.unsplash.com/photo-1604654894610-df490651e1ae' }
        ];

        await Service.deleteMany({}); // Final double check cleanup for services
        await Service.insertMany(services);
        console.log('Seeded 12 Demo Services.');

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDemoData();
