const express = require('express');
const router = express.Router();
const {
    addOrUpdatePrice,
    getAllPrices,
    getPricesByCategory
} = require('../controllers/marketController');

router.post('/add', addOrUpdatePrice);
router.get('/', getAllPrices);
router.get('/category/:category', getPricesByCategory);

module.exports = router;
