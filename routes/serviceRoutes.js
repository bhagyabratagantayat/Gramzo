const express = require('express');
const router = express.Router();
const { addService, getServices, getAgentServices, deleteService, getServiceById } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/add', protect, authorize('Agent', 'Admin'), addService);
router.get('/', getServices);
router.get('/:id', getServiceById);
router.get('/agent/:agentId', getAgentServices);
router.delete('/:id', protect, authorize('Agent', 'Admin'), deleteService);

module.exports = router;
