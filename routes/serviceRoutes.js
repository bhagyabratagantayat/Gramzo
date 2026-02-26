const express = require('express');
const router = express.Router();
const { addService, getServices, getAgentServices, deleteService } = require('../controllers/serviceController');
const { authorize } = require('../middleware/auth');

router.post('/add', authorize(['Agent', 'Admin']), addService);
router.get('/', getServices);
router.get('/agent/:agentId', getAgentServices);
router.delete('/:id', authorize(['Agent', 'Admin']), deleteService);

module.exports = router;
