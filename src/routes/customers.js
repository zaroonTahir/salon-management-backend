const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerById
} = require('../controllers/customerController');

// POST /customers/create - Create a new customer
router.post('/create', createCustomer);

// GET /customers/ - Get all customers
router.get('/', getAllCustomers);

// GET /customers/:id - Get single customer
router.get('/:id', getCustomerById);

module.exports = router;