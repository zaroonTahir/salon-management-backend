const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById
} = require('../controllers/customerController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /customers/create - Create customer (authenticated users)
router.post('/create', createCustomer);

// GET /customers/ - Get all customers (authenticated users)
router.get('/', getAllCustomers);

// GET /customers/:id - Get single customer (authenticated users)
router.get('/:id', getCustomerById);

module.exports = router;