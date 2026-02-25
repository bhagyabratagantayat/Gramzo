/* ─── Unsplash image URLs (stable, no auth needed) ─── */
const IMG = {
    haircut: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
    electrical: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    cleaning: 'https://images.unsplash.com/photo-1584622781867-1c5fe959d7f2?w=600&q=80',
    doctor: 'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=600&q=80',
    tomatoes: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600&q=80',
    milk: 'https://images.unsplash.com/photo-1550583724-125581f77033?w=600&q=80',
    bicycle: 'https://images.unsplash.com/photo-1485965120184-a220f721d03e?w=600&q=80',
    rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    healthCamp: 'https://images.unsplash.com/photo-1576089172869-4f5f6f315620?w=600&q=80',
    agriculture: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80',
    vaccination: 'https://images.unsplash.com/photo-1584036561566-baf245fec96b?w=600&q=80',
    powerCut: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80',
    jobPortal: 'https://images.unsplash.com/photo-1521791136366-3e44c5980df9?w=600&q=80',
    potato: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?w=600&q=80',
    tomato: 'https://images.unsplash.com/photo-1590779033100-9f60705a6781?w=600&q=80',
    onion: 'https://images.unsplash.com/photo-1580145032338-3f53835e5828?w=600&q=80',
    iphone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    samosa: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80'
};

export const demoServices = [
    {
        _id: 'demo-s1',
        title: 'Community Electrical Help',
        description: 'Verified electrician services for household repairs, wiring, and appliance setup.',
        price: 450,
        location: 'Patia, Bhubaneswar',
        agent: { name: 'Ram Singh' },
        imageUrl: IMG.electrical,
        category: { name: 'Electrical' }
    },
    {
        _id: 'demo-s2',
        title: 'General Physician Consultation',
        description: 'MBBS-qualified doctor available for home visits and general health checkups.',
        price: 500,
        location: 'Nayapalli, Bhubaneswar',
        agent: { name: 'Dr. Kumar' },
        imageUrl: IMG.doctor,
        category: { name: 'Professional' }
    },
    {
        _id: 'demo-s3',
        title: 'Men Haircut & Style',
        description: 'Modern haircut and grooming at your doorstep by professional barbers.',
        price: 199,
        location: 'Saheed Nagar, Bhubaneswar',
        agent: { name: 'Vikram Barua' },
        imageUrl: IMG.haircut,
        category: { name: 'Salon' }
    },
    {
        _id: 'demo-s4',
        title: 'Full Home Deep Cleaning',
        description: 'Thorough cleaning of all rooms, kitchen, and bathrooms using premium supplies.',
        price: 1999,
        location: 'Jayadev Vihar, Bhubaneswar',
        agent: { name: 'Clean Odisha' },
        imageUrl: IMG.cleaning,
        category: { name: 'Cleaning' }
    }
];

export const demoProducts = [
    {
        _id: 'demo-p1',
        title: 'Fresh Organic Tomatoes (1kg)',
        description: 'Naturally grown, succulent organic tomatoes from local Mandi.',
        price: 35,
        location: 'Unit 4 Market, BBSR',
        sellerName: 'Amit Mondal',
        phone: '9876543210',
        imageUrl: IMG.tomatoes,
        category: { name: 'Groceries' }
    },
    {
        _id: 'demo-p2',
        title: 'Hero Mountain Bike (Used)',
        description: '2-year-old mountain bike in excellent condition. New tires.',
        price: 4500,
        location: 'Puri Market',
        sellerName: 'Rajesh Swain',
        phone: '9123456780',
        imageUrl: IMG.bicycle,
        category: { name: 'Vehicles' }
    },
    {
        _id: 'demo-p3',
        title: 'Premium Basmati Rice (5kg)',
        description: 'Long-grain aromatic basmati rice, aged for 1 year.',
        price: 550,
        location: 'Cuttack Mandi',
        sellerName: 'Manoj Sahoo',
        phone: '9334455667',
        imageUrl: IMG.rice,
        category: { name: 'Groceries' }
    },
    {
        _id: 'demo-p4',
        title: 'Pure Cow Milk (1L)',
        description: 'Fresh milk delivered daily. No preservatives.',
        price: 60,
        location: 'Khandagiri, BBSR',
        sellerName: 'Dairy Fresh',
        phone: '9445566778',
        imageUrl: IMG.milk,
        category: { name: 'Groceries' }
    }
];

export const demoNotices = [
    {
        _id: 'demo-n1',
        title: 'Free Health Camp on Sunday',
        description: 'Free medical checkup, BP, and sugar tests for all villagers at Panchayat Hall.',
        location: 'Pipili, Puri',
        createdAt: new Date().toISOString(),
        imageUrl: IMG.healthCamp
    },
    {
        _id: 'demo-n2',
        title: 'Government Subsidy for Farmers',
        description: 'Apply for 50% subsidy on solar water pumps under the new Krishi Vikas Yojana.',
        location: 'District Agriculture Office, BBSR',
        createdAt: new Date().toISOString(),
        imageUrl: IMG.agriculture
    },
    {
        _id: 'demo-n3',
        title: 'Vaccination Drive: Phase 4',
        description: 'Join the pulse polio and routine immunization drive this Saturday at local clinic.',
        location: 'Health Center, Cuttack',
        createdAt: new Date().toISOString(),
        imageUrl: IMG.vaccination
    },
    {
        _id: 'demo-n4',
        title: 'Electricity Maintenance Alert',
        description: 'Planned power cut from 10 AM to 4 PM this Wednesday for line maintenance.',
        location: 'Nayapalli Area, BBSR',
        createdAt: new Date().toISOString(),
        imageUrl: IMG.powerCut
    },
    {
        _id: 'demo-n5',
        title: 'Job Opening: Local Retail Store',
        description: 'Looking for 2 delivery partners and 1 store manager. Contact 9000000001.',
        location: 'Market Building, BBSR',
        createdAt: new Date().toISOString(),
        imageUrl: IMG.jobPortal
    }
];

export const demoPrices = [
    {
        _id: 'demo-pr1',
        itemName: 'Potato',
        category: 'Vegetables',
        price: 20,
        location: 'Bhubaneswar Mandi',
        imageUrl: IMG.potato
    },
    {
        _id: 'demo-pr2',
        itemName: 'Tomato',
        category: 'Vegetables',
        price: 30,
        location: 'Unit 4 Market',
        imageUrl: IMG.tomato
    },
    {
        _id: 'demo-pr3',
        itemName: 'Mobile Phone',
        category: 'Electronics',
        price: 10000,
        location: 'Reliance Trends',
        imageUrl: IMG.iphone
    },
    {
        _id: 'demo-pr4',
        itemName: 'Samosa',
        category: 'Food',
        price: 10,
        location: 'Local Snack Stall',
        imageUrl: IMG.samosa
    }
];
