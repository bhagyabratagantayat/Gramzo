const express = require('express');
const router = express.Router();
const { addPrice, getPrices, getPriceByItem } = require('../controllers/priceController');

router.post('/add', addPrice);
router.get('/', getPrices);
router.get('/item/:name', getPriceByItem);

module.exports = router;
