const express = require('express');
const router = express.Router();
const { addAgent, approveAgent, getAgents, blockAgent, getEarnings } = require('../controllers/agentController');

router.post('/add', addAgent);
router.patch('/approve/:id', approveAgent);
router.patch('/block/:id', blockAgent);
router.get('/earnings/:id', getEarnings);
router.get('/', getAgents);

module.exports = router;
