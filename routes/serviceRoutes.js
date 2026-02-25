const express = require('express');
const router = express.Router();
const { addService, getServices, deleteService } = require('../controllers/serviceController');

router.post('/add', addService);
router.get('/', getServices);
router.delete('/:id', deleteService);

module.exports = router;
