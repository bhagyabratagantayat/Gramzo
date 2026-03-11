require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedUsers = async () => {
    try {
        await connectDB();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@gramzo.com',
                password: 'admin123',
                role: 'Admin',
                phone: '1234567890',
                isApproved: true
            },
            {
                name: 'Agent User',
                email: 'agent@gramzo.com',
                password: 'agent123',
                role: 'Agent',
                phone: '1234567891',
                isApproved: true
            },
            {
                name: 'Regular User',
                email: 'user@gramzo.com',
                password: 'user123',
                role: 'User',
                phone: '1234567892',
                isApproved: true
            }
        ];

        for (const userData of users) {
            const userExists = await User.findOne({ email: userData.email });
            if (!userExists) {
                await User.create(userData);
                console.log(`User created: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        console.log('Seeding complete');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedUsers();
