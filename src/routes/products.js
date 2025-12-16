const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');

// Reference to products collection
const productsCollection = db.collection('products');

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    // Create product object
    const productData = {
      name,
      price: parseFloat(price),
      category: category || 'product',
      description: description || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add to Firestore
    const docRef = await productsCollection.add(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: docRef.id,
        ...productData
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await productsCollection.get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get a single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await productsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

module.exports = router;