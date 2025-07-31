const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// List all products with pagination support
router.get('/products', getProducts);

// Get product by id
router.get('/products/:id', getProductById);

module.exports = router;
