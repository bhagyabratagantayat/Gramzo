const MarketPrice = require('../models/MarketPrice');

// @desc    Add or Update Market Price
// @route   POST /api/market/add
// @access  Public (Demo)
exports.addOrUpdatePrice = async (req, res) => {
    try {
        const { itemName, category, price, image, location, updatedBy, role } = req.body;

        if (!itemName || !category || !price) {
            return res.status(400).json({ success: false, error: 'Please provide itemName, category, and price' });
        }

        // Find existing item by name and category (simple upsert logic)
        let marketItem = await MarketPrice.findOne({ itemName, category });

        if (marketItem) {
            // Push old price to history (Keep last 50 for scalability)
            marketItem.priceHistory.unshift({
                price: marketItem.price,
                updatedBy: marketItem.updatedBy,
                date: marketItem.updatedAt || Date.now()
            });

            // Limit history size
            if (marketItem.priceHistory.length > 50) {
                marketItem.priceHistory = marketItem.priceHistory.slice(0, 50);
            }

            // Update existing
            marketItem.price = price;
            marketItem.image = image || marketItem.image;
            marketItem.location = location || marketItem.location;
            marketItem.updatedBy = updatedBy || marketItem.updatedBy;
            marketItem.role = role || marketItem.role;
            await marketItem.save();
            return res.status(200).json({ success: true, message: 'Price updated', data: marketItem });
        }

        // Create new
        marketItem = await MarketPrice.create({
            itemName,
            category,
            price,
            image,
            location,
            updatedBy,
            role
        });

        res.status(201).json({ success: true, message: 'New item added', data: marketItem });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all market prices
// @route   GET /api/market
exports.getAllPrices = async (req, res) => {
    try {
        const prices = await MarketPrice.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: prices.length, data: prices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get prices by category
// @route   GET /api/market/category/:category
exports.getPricesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const prices = await MarketPrice.find({ category: new RegExp(category, 'i') }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: prices.length, data: prices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
// @desc    Seed market items (200+ items)
// @route   POST /api/market/seed
exports.seedMarketItems = async (req, res) => {
    try {
        const seedData = {
            "Vegetables": ["Potato", "Tomato", "Onion", "Ginger", "Garlic", "Carrot", "Cabbage", "Cauliflower", "Spinach", "Bhindi", "Brinjal", "Capsicum", "Green Peas", "Radish", "Cucumber", "Pumpkin", "Bottle Gourd", "Bitter Gourd", "Corn", "Mushroom"],
            "Fruits": ["Apple", "Banana", "Mango", "Orange", "Grapes", "Pineapple", "Papaya", "Pomegranate", "Watermelon", "Guava", "Coconut", "Kiwi", "Dragon Fruit", "Strawberry", "Blueberry", "Pear", "Plum", "Peach", "Custard Apple", "Jackfruit"],
            "Groceries": ["Aashirvaad Atta", "Basmati Rice", "Tur Dal", "Moong Dal", "Sugar", "Salt", "Refined Oil", "Ghee", "Tea Powder", "Coffee", "Turmeric Powder", "Red Chili Powder", "Coriander Powder", "Maggi Noodles", "Pasta", "Besan", "Maida", "Poha", "Dalia", "Peanut Butter"],
            "Dairy": ["Milk", "Curd", "Paneer", "Butter", "Cheese Slices", "Amul Mithai Mate", "Fresh Cream", "Greek Yogurt", "Buttermilk", "Condensed Milk", "Milk Powder", "Probiotic Drink", "Flavored Milk", "Margarine", "Soy Milk", "Almond Milk", "Tofu", "Lassi", "Rabri", "Khoya"],
            "Fast Food": ["Burger", "Pizza", "French Fries", "Momos", "Chowmein", "Spring Roll", "Samosa", "Vada Pav", "Pav Bhaji", "Dosa", "Idli", "Sandwich", "Pasta", "Nuggets", "Patties", "Rolls", "Taco", "Nachos", "Garlic Bread", "Manchurian"],
            "Electronics": ["Smartphone", "Laptop", "Wireless Mouse", "Keyboard", "Headphones", "Earbuds", "Power Bank", "USB Cable", "Charger Adapter", "Smart Watch", "Tablet", "Monitor", "Webcam", "Speaker", "Hard Drive", "Pendrive", "Router", "CPU Fan", "Graphics Card", "Motherboard"],
            "Clothes": ["T-Shirt", "Jeans", "Shirt", "Trousers", "Saree", "Kurta", "Leggings", "Sweatshirt", "Jacket", "Trackpants", "Shorts", "Skirt", "Scarf", "Belt", "Socks", "Gloves", "Cap", "Tie", "Innerwear", "Raincoat"],
            "Stationery": ["Ball Pen", "Gel Pen", "HB Pencil", "Eraser", "Sharpener", "Ruler", "Notebook", "Glue Stick", "Scissors", "Calculator", "Highlighter", "Marker", "Stapler", "Correction Tape", "Sketch Pens", "Oil Pastels", "Crayons", "Drawing Book", "File Folder", "Diary"],
            "Hardware": ["Hammer", "Screwdriver", "Wrench", "Pliers", "Nails Pack", "Screws Pack", "Drill Machine", "Saw", "Measuring Tape", "Paint Brush", "Sandpaper", "Glue Gun", "Ladder", "Padlock", "Level Tool", "Toolbox", "Flashlight", "Rope", "Duct Tape", "Vise"],
            "Medicines": ["Paracetamol", "Ibuprofen", "Cough Syrup", "Vitamin C", "Multivitamin", "Antiseptic Cream", "Band-Aid", "Hand Sanitizer", "Pain Relief Spray", "Antacid", "Digitial Thermometer", "Face Mask", "Vaporub", "Glucose Powder", "ORS", "Inhaler", "Eye Drops", "Ear Drops", "Ointment", "First Aid Kit"],
            "Household": ["Dishwash Liquid", "Detergent Powder", "Floor Cleaner", "Toilet Cleaner", "Glass Cleaner", "Air Freshener", "Broom", "Mop", "Bucket", "Garbage Bags", "Kitchen Towels", "Tissue Paper", "Mosquito Repellent", "Candles", "Light Bulb", "Battery Cell", "Extension Cord", "Storage Box", "Water Bottel", "Plastic Mat"]
        };

        const priceRanges = {
            "Vegetables": [10, 80],
            "Fruits": [40, 300],
            "Groceries": [20, 1000],
            "Dairy": [30, 500],
            "Fast Food": [50, 600],
            "Electronics": [100, 50000],
            "Clothes": [200, 3000],
            "Stationery": [5, 500],
            "Hardware": [20, 5000],
            "Medicines": [10, 2000],
            "Household": [15, 1000]
        };

        let addedCount = 0;
        let existingCount = 0;

        for (const category of Object.keys(seedData)) {
            const items = seedData[category];
            const [min, max] = priceRanges[category];

            for (const itemName of items) {
                const existing = await MarketPrice.findOne({ itemName, category });
                if (!existing) {
                    const randomPrice = Math.floor(Math.random() * (max - min + 1)) + min;
                    await MarketPrice.create({
                        itemName,
                        category,
                        price: randomPrice,
                        image: `https://source.unsplash.com/300x200/?${itemName.replace(/\s+/g, ',')},${category.replace(/\s+/g, ',')}`,
                        location: "Puri Market",
                        updatedBy: "System Seed",
                        role: "Agent"
                    });
                    addedCount++;
                } else {
                    existingCount++;
                }
            }
        }

        res.status(200).json({
            success: true,
            message: "Market items seeding completed",
            data: {
                added: addedCount,
                existing: existingCount,
                total: addedCount + existingCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update specific market price by ID
// @route   POST /api/market/update
exports.updatePrice = async (req, res) => {
    try {
        const { itemId, newPrice, updatedBy, role } = req.body;

        if (!itemId || newPrice === undefined) {
            return res.status(400).json({ success: false, error: 'Please provide itemId and newPrice' });
        }

        const marketItem = await MarketPrice.findById(itemId);

        if (!marketItem) {
            return res.status(404).json({ success: false, error: 'Market item not found' });
        }

        // Push current state to history (Keep last 50 for scalability)
        marketItem.priceHistory.unshift({
            price: marketItem.price,
            updatedBy: marketItem.updatedBy,
            date: marketItem.updatedAt || Date.now()
        });

        // Limit history size
        if (marketItem.priceHistory.length > 50) {
            marketItem.priceHistory = marketItem.priceHistory.slice(0, 50);
        }

        // Update current state
        marketItem.price = newPrice;
        marketItem.updatedBy = updatedBy || marketItem.updatedBy;
        marketItem.role = role || marketItem.role;

        await marketItem.save();

        res.status(200).json({
            success: true,
            message: 'Market price updated successfully',
            data: marketItem
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

