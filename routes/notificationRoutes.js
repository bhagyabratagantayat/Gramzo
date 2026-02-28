const express = require('express');
const router = express.Router();
const { getNotifications, createNotification, deleteNotification } = require('../controllers/notificationController');

router.get('/', getNotifications);
router.post('/create', createNotification);
router.delete('/:id', deleteNotification);

module.exports = router;
