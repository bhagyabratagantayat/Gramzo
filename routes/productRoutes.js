const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getAgentProducts, deleteProduct, getProductById } = require('../controllers/productController');
const { authorize } = require('../middleware/auth');

router.post('/add', authorize(['Agent', 'Admin']), addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/agent/:agentId', getAgentProducts);
router.delete('/:id', authorize(['Agent', 'Admin']), deleteProduct);

module.exports = router;
