const express = require('express');
const router = express.Router();
const {
    addOrUpdatePrice,
    getAllPrices,
    getPricesByCategory,
    seedMarketItems,
    updatePrice
} = require('../controllers/marketController');

router.post('/add', addOrUpdatePrice);
router.post('/update', updatePrice);
router.get('/', getAllPrices);
router.get('/category/:category', getPricesByCategory);
router.post('/seed', seedMarketItems);

module.exports = router;
