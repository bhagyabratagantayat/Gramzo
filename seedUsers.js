const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedUsers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const demoUsers = [
            {
                name: 'Admin User',
                email: 'admin@gramzo.com',
                password: '123456',
                role: 'Admin',
                phone: '0000000001',
                location: 'Admin Office'
            },
            {
                name: 'Agent User',
                email: 'agent@gramzo.com',
                password: '123456',
                role: 'Agent',
                phone: '0000000002',
                location: 'Merchant District',
                isApproved: true
            },
            {
                name: 'Test User',
                email: 'user@gramzo.com',
                password: '123456',
                role: 'User',
                phone: '0000000003',
                location: 'Village Green'
            }
        ];

        for (const data of demoUsers) {
            const exists = await User.findOne({ email: data.email });
            if (!exists) {
                // Password hashing is handled by User.js pre-save hook
                await User.create(data);
                console.log(`✅ Created ${data.role}: ${data.email}`);
            } else {
                console.log(`ℹ️  Skipped (exists): ${data.role}: ${data.email}`);
            }
        }

        console.log('\n✨ Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedUsers();
