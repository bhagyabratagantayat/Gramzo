const express = require('express');
const router = express.Router();
const {
    addOrUpdatePrice,
    getAllPrices,
    getPricesByCategory,
    seedMarketItems,
    updatePrice
} = require('../controllers/marketController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/add', protect, authorize('Agent', 'Admin'), addOrUpdatePrice);
router.post('/update', protect, authorize('Agent', 'Admin'), updatePrice);
router.get('/', getAllPrices);
router.get('/category/:category', getPricesByCategory);
router.post('/seed', protect, authorize('Admin'), seedMarketItems);

module.exports = router;
