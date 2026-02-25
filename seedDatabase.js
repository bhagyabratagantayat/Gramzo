const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load models
const Category = require('./models/Category');
const Service = require('./models/Service');
const Agent = require('./models/Agent');
const Product = require('./models/Product');

/* ─── Unsplash image URLs (stable, no auth needed) ─── */
const IMG = {
    // Services
    haircut: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
    hairStyle: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    electrical: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    ac: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    fan: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    mobile: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    appliance: 'https://images.unsplash.com/photo-1626806787461-102c1f0d3b1b?w=600&q=80',
    cleaning: 'https://images.unsplash.com/photo-1584622781867-1c5fe959d7f2?w=600&q=80',
    pest: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&q=80',
    painting: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&q=80',
    doctor: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&q=80',
    tuition: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    wedding: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&q=80',
    birthday: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
    plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80',
    gardening: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    carpenter: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&q=80',

    // Marketplace
    tomatoes: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600&q=80',
    milk: 'https://images.unsplash.com/photo-1550583724-125581f77033?w=600&q=80',
    usedMobile: 'https://images.unsplash.com/photo-1556656793-062ff9f1b74b?w=600&q=80',
    wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
    rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    bicycle: 'https://images.unsplash.com/photo-1485965120184-a220f721d03e?w=600&q=80',
    tv: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80',
    fruits: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80',
    eggs: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&q=80',
    honey: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
    sofa: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    car: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80',
    guitar: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80',
    watch: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
};

/* ─── Categories ─── */
const categoriesData = [
    // Service Types
    { name: 'Salon & Beauty', type: 'service' },
    { name: 'Electrical', type: 'service' },
    { name: 'Mobile & Appliance', type: 'service' },
    { name: 'Home Cleaning', type: 'service' },
    { name: 'Professional', type: 'service' },
    { name: 'Events', type: 'service' },
    { name: 'Plumbing', type: 'service' },
    { name: 'Gardening', type: 'service' },
    { name: 'Carpentry', type: 'service' },
    // Marketplace Types
    { name: 'Groceries', type: 'market' },
    { name: 'Electronics', type: 'market' },
    { name: 'Home & Living', type: 'market' },
    { name: 'Vehicles', type: 'market' },
    { name: 'Fashion', type: 'market' },
    { name: 'Hobbies', type: 'market' },
];

/* ─── Services (19 listings) ─── */
const servicesData = [
    {
        categoryName: 'Salon & Beauty',
        title: 'Men Haircut & Beard Trim',
        description: 'Professional salon-grade haircut with premium scissors, beard shaping, and a relaxing head massage.',
        price: 199,
        locationName: 'Nayapalli, Bhubaneswar',
        latitude: 20.2917, longitude: 85.8200,
        requiresAppointment: true,
        imageUrl: IMG.haircut,
    },
    {
        categoryName: 'Salon & Beauty',
        title: 'Women Hair Styling & Blowout',
        description: 'Blow dry, ironing, curling, or any custom style. Includes a nourishing hair serum treatment.',
        price: 499,
        locationName: 'Jayadev Vihar, Bhubaneswar',
        latitude: 20.3015, longitude: 85.8272,
        requiresAppointment: true,
        imageUrl: IMG.hairStyle,
    },
    {
        categoryName: 'Salon & Beauty',
        title: 'Facial & Skin Cleanup Package',
        description: 'Deep-pore cleansing facial with D-tan, skin brightening pack, and sunscreen finish.',
        price: 799,
        locationName: 'Saheed Nagar, Bhubaneswar',
        latitude: 20.2872, longitude: 85.8427,
        requiresAppointment: true,
        imageUrl: IMG.facial,
    },
    {
        categoryName: 'Electrical',
        title: 'Electric Wiring Fix & Safety Check',
        description: 'Detect and repair loose wiring, short circuits, and faulty sockets. Full home safety inspection included.',
        price: 450,
        locationName: 'Patia, Bhubaneswar',
        latitude: 20.3533, longitude: 85.8267,
        requiresAppointment: false,
        imageUrl: IMG.electrical,
    },
    {
        categoryName: 'Electrical',
        title: 'AC Installation & Gas Refill',
        description: 'Certified technician will install your split or window AC, set up drainage piping, and do a full gas pressure top-up.',
        price: 1299,
        locationName: 'Link Road, Cuttack',
        latitude: 20.4497, longitude: 85.8821,
        requiresAppointment: true,
        imageUrl: IMG.ac,
    },
    {
        categoryName: 'Electrical',
        title: 'Fan & Light Fitting Service',
        description: 'Installation of ceiling fans, LED fixtures, tube lights, or decorative lamps.',
        price: 250,
        locationName: 'Badambadi, Cuttack',
        latitude: 20.4563, longitude: 85.8752,
        requiresAppointment: false,
        imageUrl: IMG.fan,
    },
    {
        categoryName: 'Mobile & Appliance',
        title: 'Mobile Screen Replacement',
        description: 'Original or premium quality screen for all brands — Samsung, Redmi, Vivo, Oppo, iPhone.',
        price: 799,
        locationName: 'Puri Market, Puri',
        latitude: 19.8135, longitude: 85.8312,
        requiresAppointment: false,
        imageUrl: IMG.mobile,
    },
    {
        categoryName: 'Mobile & Appliance',
        title: 'Washing Machine Repair at Home',
        description: 'Expert repair of top-load and front-load machines — drum noise, water leakage, or board-level faults.',
        price: 650,
        locationName: 'Nayapalli, Bhubaneswar',
        latitude: 20.2917, longitude: 85.8200,
        requiresAppointment: false,
        imageUrl: IMG.appliance,
    },
    {
        categoryName: 'Home Cleaning',
        title: 'Full House Deep Cleaning',
        description: 'End-to-end cleaning including bathroom scrubbing, kitchen degreasing, and window wiping.',
        price: 2499,
        locationName: 'Chandrasekharpur, Bhubaneswar',
        latitude: 20.3281, longitude: 85.8204,
        requiresAppointment: true,
        imageUrl: IMG.cleaning,
    },
    {
        categoryName: 'Home Cleaning',
        title: 'Pest Control Service (Home)',
        description: 'Chemical-free or standard pest control for cockroaches, mosquitoes, bed bugs, and rodents.',
        price: 1799,
        locationName: 'Saheed Nagar, Bhubaneswar',
        latitude: 20.2872, longitude: 85.8427,
        requiresAppointment: true,
        imageUrl: IMG.pest,
    },
    {
        categoryName: 'Home Cleaning',
        title: 'Home Painting (Per Room)',
        description: 'Fresh coat of interior emulsion or texture paint per room. Includes wall putty and primer coat.',
        price: 3999,
        locationName: 'Jayadev Vihar, Bhubaneswar',
        latitude: 20.3015, longitude: 85.8272,
        requiresAppointment: true,
        imageUrl: IMG.painting,
    },
    {
        categoryName: 'Professional',
        title: 'Doctor Home Consultation',
        description: 'MBBS-qualified general physician visits your home for minor illness or general health check.',
        price: 499,
        locationName: 'Puri Town, Puri',
        latitude: 19.8003, longitude: 85.8322,
        requiresAppointment: true,
        imageUrl: IMG.doctor,
    },
    {
        categoryName: 'Professional',
        title: 'Math & Science Tuition',
        description: 'One-on-one home tuition for Class 6–12 by experienced teachers. Covers CBSE/ICSE curriculum.',
        price: 299,
        locationName: 'Janpath, Bhubaneswar',
        latitude: 20.2604, longitude: 85.8407,
        requiresAppointment: true,
        imageUrl: IMG.tuition,
    },
    {
        categoryName: 'Professional',
        title: 'Legal Document Consultation',
        description: 'Qualified advocate consultation for agreements, affidavits, or consumer cases.',
        price: 999,
        locationName: 'High Court Square, Cuttack',
        latitude: 20.4745, longitude: 85.8794,
        requiresAppointment: true,
        imageUrl: IMG.legal,
    },
    {
        categoryName: 'Events',
        title: 'Wedding Photography Package',
        description: 'Full-day wedding shoot, 500+ edited photos, highlight video, and online album delivery.',
        price: 14999,
        locationName: 'Bhubaneswar City',
        latitude: 20.2961, longitude: 85.8245,
        requiresAppointment: true,
        imageUrl: IMG.wedding,
    },
    {
        categoryName: 'Events',
        title: 'Birthday Event Setup & Decor',
        description: 'Full birthday setup including themed balloons, backdrop, and cake table decor.',
        price: 4999,
        locationName: 'Khandagiri, Bhubaneswar',
        latitude: 20.2490, longitude: 85.7742,
        requiresAppointment: true,
        imageUrl: IMG.birthday,
    },
    {
        categoryName: 'Plumbing',
        title: 'Emergency Pipe Leakage Repair',
        description: 'Burst pipes or tank overflow — our plumber is at your door within 60 minutes.',
        price: 349,
        locationName: 'Nayapalli, Bhubaneswar',
        latitude: 20.2917, longitude: 85.8200,
        requiresAppointment: false,
        imageUrl: IMG.plumbing,
    },
    {
        categoryName: 'Gardening',
        title: 'Garden Maintenance & Pruning',
        description: 'Lawn mowing, hedge trimming, and seasonal flower planting.',
        price: 799,
        locationName: 'Patia, Bhubaneswar',
        latitude: 20.3533, longitude: 85.8267,
        requiresAppointment: true,
        imageUrl: IMG.gardening,
    },
    {
        categoryName: 'Carpentry',
        title: 'Custom Furniture Repair',
        description: 'Fix broken hinges, wardrobe doors, and apply fresh polish to existing furniture.',
        price: 699,
        locationName: 'Puri Road, Bhubaneswar',
        latitude: 20.2525, longitude: 85.8358,
        requiresAppointment: false,
        imageUrl: IMG.carpenter,
    },
];

/* ─── Marketplace Products (20 listings) ─── */
const productsData = [
    {
        categoryName: 'Groceries',
        title: 'Fresh Organic Tomatoes (1kg)',
        description: 'Farm-fresh, chemical-free organic tomatoes. Perfect for everyday cooking.',
        price: 40,
        sellerName: 'Odisha Farms',
        phone: '9876543210',
        location: 'Bhubaneswar Market',
        imageUrl: IMG.tomatoes
    },
    {
        categoryName: 'Groceries',
        title: 'Pure Organic Cow Milk (1L)',
        description: 'Fresh milk delivered daily. No preservatives, high cream content.',
        price: 65,
        sellerName: 'Dairy Fresh',
        phone: '9876543211',
        location: 'Patia, Bhubaneswar',
        imageUrl: IMG.milk
    },
    {
        categoryName: 'Groceries',
        title: 'Premium Sharbati Wheat (5kg)',
        description: 'High-quality wheat grains from MP. Cleaned and ready for milling.',
        price: 240,
        sellerName: 'Grain Mart',
        phone: '9876543212',
        location: 'Cuttack Road',
        imageUrl: IMG.wheat
    },
    {
        categoryName: 'Groceries',
        title: 'Basmati Rice - Long Grain (5kg)',
        description: 'Aromatic long-grain basmati rice. Aged for 1 year for perfect texture.',
        price: 550,
        sellerName: 'Rice King',
        phone: '9876543213',
        location: 'Nayapalli',
        imageUrl: IMG.rice
    },
    {
        categoryName: 'Groceries',
        title: 'Farm Fresh Fruits Basket (2kg)',
        description: 'Assorted seasonal fruits including apples, bananas, and oranges.',
        price: 180,
        sellerName: 'Fruit Haven',
        phone: '9876543214',
        location: 'Unit 4 Market',
        imageUrl: IMG.fruits
    },
    {
        categoryName: 'Groceries',
        title: 'Country Eggs (Pack of 12)',
        description: 'High-protein country eggs from local poultry farms.',
        price: 120,
        sellerName: 'Poultry Express',
        phone: '9876543215',
        location: 'Saheed Nagar',
        imageUrl: IMG.eggs
    },
    {
        categoryName: 'Groceries',
        title: 'Natural Raw Honey (500g)',
        description: 'Unprocessed, wild-forest honey. Pure and healthy.',
        price: 320,
        sellerName: 'Nature Best',
        phone: '9876543216',
        location: 'Puri Market',
        imageUrl: IMG.honey
    },
    {
        categoryName: 'Electronics',
        title: 'iPhone 13 (Used - Excellent)',
        description: 'Used iPhone 13, 128GB, Midnight color. No scratches, 90% battery health.',
        price: 35000,
        sellerName: 'Rahul Gadgets',
        phone: '9876543217',
        location: 'Jayadev Vihar',
        imageUrl: IMG.usedMobile
    },
    {
        categoryName: 'Electronics',
        title: 'Mi LED TV 43 inch (Used)',
        description: '3-year-old smart TV in great condition. 4K resolution, Netflix/Prime supported.',
        price: 12000,
        sellerName: 'Aman Electronics',
        phone: '9876543218',
        location: 'Cuttack',
        imageUrl: IMG.tv
    },
    {
        categoryName: 'Electronics',
        title: 'Dell Latitude Laptop (Refurbished)',
        description: 'Intel i5, 8GB RAM, 256GB SSD. Perfect for students and professional work.',
        price: 22000,
        sellerName: 'Laptop Hub',
        phone: '9876543219',
        location: 'Bhubaneswar',
        imageUrl: IMG.laptop
    },
    {
        categoryName: 'Electronics',
        title: 'Canon EOS 1500D Camera',
        description: 'DSLR camera with 18-55mm kit lens. Barely used, includes bag and SD card.',
        price: 28000,
        sellerName: 'Snap Studio',
        phone: '9876543220',
        location: 'Saheed Nagar',
        imageUrl: IMG.camera
    },
    {
        categoryName: 'Electronics',
        title: 'LG 24-inch Monitor',
        description: 'IPS panel, Full HD monitor. Ideal for dual-screen setup.',
        price: 5500,
        sellerName: 'PC World',
        phone: '9876543221',
        location: 'Unit 9',
        imageUrl: IMG.monitor
    },
    {
        categoryName: 'Home & Living',
        title: '3-Seater Sofa (Dark Green)',
        description: 'Soft velvet upholstery, 1-year old. Very comfortable for living rooms.',
        price: 8500,
        sellerName: 'Home Style',
        phone: '9876543222',
        location: 'Khandagiri',
        imageUrl: IMG.sofa
    },
    {
        categoryName: 'Vehicles',
        title: 'Hercules Mountain Bike (Used)',
        description: 'Well-maintained bicycle with 21 shimano gears. New tires installed.',
        price: 4500,
        sellerName: 'Vicky Cycles',
        phone: '9876543223',
        location: 'Patia',
        imageUrl: IMG.bicycle
    },
    {
        categoryName: 'Vehicles',
        title: 'Maruti Wagoneer (2018 Model)',
        description: 'CNG+Petrol, 45k km driven. Insurance valid till 2025.',
        price: 320000,
        sellerName: 'Car Bazar',
        phone: '9876543224',
        location: 'Rasulgarh',
        imageUrl: IMG.car
    },
    {
        categoryName: 'Hobbies',
        title: 'Acoustics Guitar (Fender)',
        description: 'Beginner-friendly guitar with bag and picks. Great condition.',
        price: 3800,
        sellerName: 'Musician Hub',
        phone: '9876543225',
        location: 'Unit 4',
        imageUrl: IMG.guitar
    },
    {
        categoryName: 'Fashion',
        title: 'Titan Regalia Men Watch',
        description: 'Classic gold-plated analogs watch. 2 years old, original box included.',
        price: 2500,
        sellerName: 'Time Collection',
        phone: '9876543226',
        location: 'Bhubaneswar',
        imageUrl: IMG.watch
    },
    {
        categoryName: 'Fashion',
        title: 'Nike Air Max Shoes (Size 9)',
        description: 'Red/Black colorway. Used only for 2 months, original price 12k.',
        price: 4000,
        sellerName: 'Sneaker Head',
        phone: '9876543227',
        location: 'Nayapalli',
        imageUrl: IMG.shoes
    }
];

/* ─── Seed runner ─── */
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear old data
        await Category.deleteMany({});
        await Service.deleteMany({});
        await Product.deleteMany({});
        console.log('🗑  Cleared existing Categories, Services, and Products');

        // Ensure a master agent exists
        let agent = await Agent.findOne({ isApproved: true });
        if (!agent) {
            agent = await Agent.create({
                name: 'Gramzo Demo Agent',
                phone: '9000000001',
                location: 'Bhubaneswar',
                isApproved: true,
            });
            console.log('👤 Created demo agent');
        }

        // Insert categories
        const cats = await Category.insertMany(categoriesData);
        console.log(`📂 Inserted ${cats.length} categories`);
        const catMap = Object.fromEntries(cats.map(c => [c.name, c._id]));

        // Build and insert services
        const services = servicesData.map(({ categoryName, ...rest }) => ({
            ...rest,
            location: rest.locationName, // backward-compat
            category: catMap[categoryName],
            agent: agent._id,
        }));
        await Service.insertMany(services);
        console.log(`🛠  Inserted ${services.length} realistic service listings`);

        // Build and insert products
        const products = productsData.map(({ categoryName, ...rest }) => ({
            ...rest,
            category: catMap[categoryName],
            agent: agent._id,
        }));
        await Product.insertMany(products);
        console.log(`📦 Inserted ${products.length} realistic marketplace products`);

        console.log('\n✨ Seed complete! Refresh your browser to see the data.\n');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seedDB();
