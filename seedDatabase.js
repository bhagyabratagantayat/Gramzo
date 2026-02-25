const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load models
const Category = require('./models/Category');
const Service = require('./models/Service');
const Agent = require('./models/Agent');

/* ─── Unsplash image URLs (stable, no auth needed) ─── */
const IMG = {
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
};

/* ─── Categories ─── */
const categoriesData = [
    { name: 'Salon & Beauty', type: 'service' },
    { name: 'Electrical', type: 'service' },
    { name: 'Mobile & Appliance', type: 'service' },
    { name: 'Home Cleaning', type: 'service' },
    { name: 'Professional', type: 'service' },
    { name: 'Events', type: 'service' },
    { name: 'Plumbing', type: 'service' },
    { name: 'Gardening', type: 'service' },
    { name: 'Carpentry', type: 'service' },
];

/* ─── Services (18 listings) ─── */
const servicesData = [
    /* ── Salon & Beauty ────────────────────── */
    {
        categoryName: 'Salon & Beauty',
        title: 'Men Haircut & Beard Trim',
        description: 'Professional salon-grade haircut with premium scissors, beard shaping, and a relaxing head massage — all at your doorstep.',
        price: 199,
        locationName: 'Nayapalli, Bhubaneswar',
        latitude: 20.2917, longitude: 85.8200,
        requiresAppointment: true,
        imageUrl: IMG.haircut,
    },
    {
        categoryName: 'Salon & Beauty',
        title: 'Women Hair Styling & Blowout',
        description: 'Blow dry, ironing, curling, or any custom style. Includes a nourishing hair serum treatment for salon-like results at home.',
        price: 499,
        locationName: 'Jayadev Vihar, Bhubaneswar',
        latitude: 20.3015, longitude: 85.8272,
        requiresAppointment: true,
        imageUrl: IMG.hairStyle,
    },
    {
        categoryName: 'Salon & Beauty',
        title: 'Facial & Skin Cleanup Package',
        description: 'Deep-pore cleansing facial with D-tan, skin brightening pack, and sunscreen finish. Organic products, zero side effects.',
        price: 799,
        locationName: 'Saheed Nagar, Bhubaneswar',
        latitude: 20.2872, longitude: 85.8427,
        requiresAppointment: true,
        imageUrl: IMG.facial,
    },
    /* ── Electrical ─────────────────────────── */
    {
        categoryName: 'Electrical',
        title: 'Electric Wiring Fix & Safety Check',
        description: 'Detect and repair loose wiring, short circuits, and faulty sockets. Full home safety inspection included. Same-day service.',
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
        description: 'Installation of ceiling fans, LED fixtures, tube lights, or decorative lamps with safety-rated wiring and switches.',
        price: 250,
        locationName: 'Badambadi, Cuttack',
        latitude: 20.4563, longitude: 85.8752,
        requiresAppointment: false,
        imageUrl: IMG.fan,
    },
    /* ── Mobile & Appliance ─────────────────── */
    {
        categoryName: 'Mobile & Appliance',
        title: 'Mobile Screen Replacement',
        description: 'Original or premium quality screen for all brands — Samsung, Redmi, Vivo, Oppo, iPhone. 30-day service guarantee.',
        price: 799,
        locationName: 'Puri Market, Puri',
        latitude: 19.8135, longitude: 85.8312,
        requiresAppointment: false,
        imageUrl: IMG.mobile,
    },
    {
        categoryName: 'Mobile & Appliance',
        title: 'Washing Machine Repair at Home',
        description: 'Expert repair of top-load and front-load machines — drum noise, water leakage, spin issues, or board-level faults.',
        price: 650,
        locationName: 'Nayapalli, Bhubaneswar',
        latitude: 20.2917, longitude: 85.8200,
        requiresAppointment: false,
        imageUrl: IMG.appliance,
    },
    /* ── Home Cleaning ──────────────────────── */
    {
        categoryName: 'Home Cleaning',
        title: 'Full House Deep Cleaning',
        description: 'End-to-end cleaning including bathroom scrubbing, kitchen degreasing, mopping, dusting, and window wiping. Ideal for new move-ins.',
        price: 2499,
        locationName: 'Chandrasekharpur, Bhubaneswar',
        latitude: 20.3281, longitude: 85.8204,
        requiresAppointment: true,
        imageUrl: IMG.cleaning,
    },
    {
        categoryName: 'Home Cleaning',
        title: 'Pest Control Service (Home)',
        description: 'Chemical-free or standard pest control for cockroaches, mosquitoes, bed bugs, and rodents. 3-month protection guarantee.',
        price: 1799,
        locationName: 'Saheed Nagar, Bhubaneswar',
        latitude: 20.2872, longitude: 85.8427,
        requiresAppointment: true,
        imageUrl: IMG.pest,
    },
    {
        categoryName: 'Home Cleaning',
        title: 'Home Painting (Per Room)',
        description: 'Fresh coat of interior emulsion or texture paint per room. Includes wall putty, primer coat, and 2 finish coats.',
        price: 3999,
        locationName: 'Jayadev Vihar, Bhubaneswar',
        latitude: 20.3015, longitude: 85.8272,
        requiresAppointment: true,
        imageUrl: IMG.painting,
    },
    /* ── Professional ───────────────────────── */
    {
        categoryName: 'Professional',
        title: 'Doctor Home Consultation',
        description: 'MBBS-qualified general physician visits your home for fever, BP, sugar check, or general illness. Available 8 AM – 8 PM.',
        price: 499,
        locationName: 'Puri Town, Puri',
        latitude: 19.8003, longitude: 85.8322,
        requiresAppointment: true,
        imageUrl: IMG.doctor,
    },
    {
        categoryName: 'Professional',
        title: 'Math & Science Tuition (Per Session)',
        description: 'One-on-one home tuition from Class 6–12 by experienced teachers. Covers CBSE, ICSE, and Odisha Board curriculum.',
        price: 299,
        locationName: 'Janpath, Bhubaneswar',
        latitude: 20.2604, longitude: 85.8407,
        requiresAppointment: true,
        imageUrl: IMG.tuition,
    },
    {
        categoryName: 'Professional',
        title: 'Legal Document Consultation',
        description: 'Qualified advocate consultation for property disputes, agreements, affidavits, or consumer cases. Strict confidentiality.',
        price: 999,
        locationName: 'High Court Square, Cuttack',
        latitude: 20.4745, longitude: 85.8794,
        requiresAppointment: true,
        imageUrl: IMG.legal,
    },
    /* ── Events ─────────────────────────────── */
    {
        categoryName: 'Events',
        title: 'Wedding Photography Package',
        description: 'Full-day wedding shoot with a 2-person team, 500+ edited photos, a 5-min highlight video, and online album delivery.',
        price: 14999,
        locationName: 'Bhubaneswar City',
        latitude: 20.2961, longitude: 85.8245,
        requiresAppointment: true,
        imageUrl: IMG.wedding,
    },
    {
        categoryName: 'Events',
        title: 'Birthday Event Setup & Decor',
        description: 'Full birthday setup including themed balloons, backdrop, cake table, and fairy lights. We handle everything in 2 hours.',
        price: 4999,
        locationName: 'Khandagiri, Bhubaneswar',
        latitude: 20.2490, longitude: 85.7742,
        requiresAppointment: true,
        imageUrl: IMG.birthday,
    },
    /* ── Plumbing ───────────────────────────── */
    {
        categoryName: 'Plumbing',
        title: 'Emergency Pipe Leakage Repair',
        description: 'Burst pipes, overhead tank overflow, or seepage — our plumber is at your door within 60 minutes. Available 24×7.',
        price: 349,
        locationName: 'Nayapalli, Bhubaneswar',
        latitude: 20.2917, longitude: 85.8200,
        requiresAppointment: false,
        imageUrl: IMG.plumbing,
    },
    /* ── Gardening ──────────────────────────── */
    {
        categoryName: 'Gardening',
        title: 'Garden Maintenance & Pruning',
        description: 'Lawn mowing, hedge trimming, pot plant care, seasonal flower planting, and organic composting. Monthly packages available.',
        price: 799,
        locationName: 'Patia, Bhubaneswar',
        latitude: 20.3533, longitude: 85.8267,
        requiresAppointment: true,
        imageUrl: IMG.gardening,
    },
    /* ── Carpentry ──────────────────────────── */
    {
        categoryName: 'Carpentry',
        title: 'Custom Furniture Repair & Polish',
        description: 'Fix wobbling furniture, broken hinges, wardrobe doors, and apply fresh PU polish for a brand-new look.',
        price: 699,
        locationName: 'Puri Road, Bhubaneswar',
        latitude: 20.2525, longitude: 85.8358,
        requiresAppointment: false,
        imageUrl: IMG.carpenter,
    },
];

/* ─── Seed runner ─── */
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear old service/category data
        await Category.deleteMany({});
        await Service.deleteMany({});
        console.log('🗑  Cleared existing Categories and Services');

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
        console.log('\n✨ Seed complete! Refresh your browser to see the data.\n');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seedDB();
