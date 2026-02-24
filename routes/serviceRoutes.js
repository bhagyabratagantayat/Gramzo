const express = require('express');
const router = express.Router();
const { addService, getServices } = require('../controllers/serviceController');

router.post('/add', addService);
router.get('/', getServices);

module.exports = router;
