require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const Notice = require('../models/Notice');
const MarketPrice = require('../models/MarketPrice');
const User = require('../models/User');

const cleanupDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        console.log('Clearing Appointments/Bookings...');
        await Booking.deleteMany({});

        console.log('Clearing Services...');
        await Service.deleteMany({});

        console.log('Clearing Products...');
        await Product.deleteMany({});

        console.log('Clearing Notifications...');
        await Notification.deleteMany({});

        console.log('Clearing Notices...');
        await Notice.deleteMany({});

        console.log('Clearing Market Prices...');
        await MarketPrice.deleteMany({});

        // Keep users but maybe clear non-demo users?
        // For now, let's just clear these specific models as requested.

        console.log('Cleanup complete!');
        process.exit();
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

cleanupDB();
