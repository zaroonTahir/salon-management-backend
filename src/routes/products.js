const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { db, admin } = require('../config/firebase');

const productsCollection = db.collection('products');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/products - Get all products (all authenticated users)
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

// POST /api/products - Create product (admin only)
router.post('/', roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and price'
      });
    }

    const productData = {
      name,
      price: parseFloat(price),
      category: category || 'product',
      description: description || '',
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

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

// GET /api/products/:id - Get single product (all authenticated users)
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