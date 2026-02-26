const express = require('express');
const router = express.Router();
const { addProduct, getProducts, deleteProduct } = require('../controllers/productController');
const { authorize } = require('../middleware/auth');

router.post('/add', authorize(['Agent', 'Admin']), addProduct);
router.get('/', getProducts);
router.get('/agent/:agentId', getAgentProducts);
router.delete('/:id', authorize(['Agent', 'Admin']), deleteProduct);

module.exports = router;
