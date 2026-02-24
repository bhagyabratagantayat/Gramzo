const express = require('express');
const router = express.Router();
const { addAgent, approveAgent, getAgents } = require('../controllers/agentController');

router.post('/add', addAgent);
router.patch('/approve/:id', approveAgent);
router.get('/', getAgents);

module.exports = router;
