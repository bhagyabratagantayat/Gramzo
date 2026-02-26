require('dotenv').config();
const mongoose = require('mongoose');
const MarketPrice = require('../models/MarketPrice');

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

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

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
                        role: "agent"
                    });
                    addedCount++;
                    console.log(`Added: ${itemName} (${category})`);
                } else {
                    existingCount++;
                }
            }
        }

        console.log(`\nSeeding Summary:`);
        console.log(`Added: ${addedCount}`);
        console.log(`Existing: ${existingCount}`);
        console.log(`Total: ${addedCount + existingCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
