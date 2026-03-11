const express = require('express');
const router = express.Router();
const { addNotice, getNotices, deleteNotice } = require('../controllers/noticeController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('Admin'), addNotice);
router.get('/', getNotices);
router.delete('/:id', protect, authorize('Admin'), deleteNotice);

module.exports = router;
