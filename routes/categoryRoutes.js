const express = require('express');
const router = express.Router();
const { addCategory, getCategories } = require('../controllers/categoryController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/add', protect, authorize('Admin'), addCategory);
router.get('/', getCategories);

module.exports = router;
