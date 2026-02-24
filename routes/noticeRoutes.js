const express = require('express');
const router = express.Router();
const { addNotice, getNotices, deleteNotice } = require('../controllers/noticeController');

router.post('/add', addNotice);
router.get('/', getNotices);
router.delete('/:id', deleteNotice);

module.exports = router;
