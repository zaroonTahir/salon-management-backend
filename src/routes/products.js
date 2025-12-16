const express = require('express');
const router = express.Router();

// In-memory storage (temporary - we'll use a database later)
let products = [
  { id: 1, name: 'Haircut', price: 25, category: 'service' },
  { id: 2, name: 'Hair Dye', price: 50, category: 'service' },
  { id: 3, name: 'Shampoo', price: 15, category: 'product' }
];

// GET /api/products - Get all products
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// POST /api/products - Create a new product
router.post('/', (req, res) => {
  const { name, price, category } = req.body;
  
  // Simple validation
  if (!name || !price) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name and price'
    });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category: category || 'product'
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    data: newProduct
  });
});

// GET /api/products/:id - Get a single product by ID
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.json({
    success: true,
    data: product
  });
});

module.exports = router;