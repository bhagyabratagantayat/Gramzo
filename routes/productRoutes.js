const express = require('express');
const router = express.Router();
const { addProduct, getProducts, getAgentProducts, deleteProduct, getProductById, updateProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/add', protect, authorize('Agent', 'Admin'), addProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, authorize('Agent', 'Admin'), updateProduct);
router.get('/agent/:agentId', getAgentProducts);
router.delete('/:id', protect, authorize('Agent', 'Admin'), deleteProduct);

module.exports = router;
