const mongoose = require('mongoose');
const MarketPrice = require('../models/MarketPrice');

// @desc    Add or Update Market Price
// @route   POST /api/market/add
exports.addOrUpdatePrice = async (req, res) => {
    try {
        let { itemName, category, price, image, location, updatedBy, role } = req.body;

        console.log('Add/Update Price Attempt:', { itemName, category, price });

        if (!itemName || !category || price === undefined) {
            return res.status(400).json({ success: false, error: 'itemName, category, and price are required' });
        }

        // Normalize role to Match Schema Enum (User, Agent, Admin)
        if (role) {
            role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        }

        // Find existing item by name and category (simple upsert logic)
        let marketItem = await MarketPrice.findOne({ itemName, category });

        if (marketItem) {
            // Initialize priceHistory if missing (safety check)
            if (!Array.isArray(marketItem.priceHistory)) {
                marketItem.priceHistory = [];
            }

            // Capture previous state for history
            const historicalEntry = {
                price: marketItem.price,
                updatedBy: marketItem.updatedBy || 'Previous Record',
                date: marketItem.updatedAt || Date.now()
            };

            // Push to history (Keep last 50)
            marketItem.priceHistory.unshift(historicalEntry);
            if (marketItem.priceHistory.length > 50) {
                marketItem.priceHistory = marketItem.priceHistory.slice(0, 50);
            }

            // Update existing
            marketItem.price = Number(price);
            marketItem.image = image || marketItem.image;
            marketItem.location = location || marketItem.location;
            marketItem.updatedBy = updatedBy || marketItem.updatedBy;
            marketItem.role = role || marketItem.role;

            await marketItem.save();
            return res.status(200).json({ success: true, message: `Updated ${itemName} price`, data: marketItem });
        }

        // Create new
        marketItem = await MarketPrice.create({
            itemName,
            category,
            price: Number(price),
            image,
            location,
            updatedBy,
            role
        });

        res.status(201).json({ success: true, message: `Added new item: ${itemName}`, data: marketItem });
    } catch (error) {
        console.error('Add/Update Price Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Server error during item processing' });
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

        // 1. Validate request body
        if (!itemId || newPrice === undefined || isNaN(Number(newPrice))) {
            return res.status(400).json({
                success: false,
                message: "itemId and valid newPrice are required"
            });
        }

        // Validate ObjectId format to prevent CastError
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Item ID format"
            });
        }

        // 2. Find item safely
        const marketItem = await MarketPrice.findById(itemId);
        if (!marketItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        // 3. Store old price before update (for history)
        const historicalEntry = {
            price: marketItem.price,
            updatedBy: marketItem.updatedBy || 'Previous Record',
            date: marketItem.updatedAt || Date.now()
        };

        // 4. Update price
        marketItem.price = Number(newPrice);

        // 5. Update history if exists
        if (Array.isArray(marketItem.priceHistory)) {
            marketItem.priceHistory.unshift(historicalEntry);
            // Limit history size to 50
            if (marketItem.priceHistory.length > 50) {
                marketItem.priceHistory = marketItem.priceHistory.slice(0, 50);
            }
        }

        // Normalize additional metadata if provided
        if (updatedBy) marketItem.updatedBy = updatedBy;
        if (role) {
            marketItem.role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        }

        // 6. Save data properly
        await marketItem.save();

        // 7. Success response
        return res.status(200).json({
            success: true,
            message: "Price updated successfully",
            data: marketItem
        });

    } catch (error) {
        console.error("Error updating price:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
