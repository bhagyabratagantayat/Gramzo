const express = require('express');
const router = express.Router();
const { addPrice, getPrices, getPriceByItem } = require('../controllers/priceController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/add', protect, authorize('Agent', 'Admin'), addPrice);
router.get('/', getPrices);
router.get('/item/:name', getPriceByItem);

module.exports = router;
