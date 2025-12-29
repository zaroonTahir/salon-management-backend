const { db } = require('../config/firebase');
const { validateCustomer } = require('../validators/customerValidator');

const customersCollection = db.collection('customers');

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Validate input
    const validation = validateCustomer(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if email already exists
    const existingCustomer = await customersCollection
      .where('email', '==', email)
      .get();

    if (!existingCustomer.empty) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }

    // Create customer object
    const customerData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address || '',
      createdAt: new Date().toISOString()
    };

    // Add to Firestore
    const docRef = await customersCollection.add(customerData);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: {
        id: docRef.id,
        ...customerData
      }
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating customer',
      error: error.message
    });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const snapshot = await customersCollection.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const customers = [];
    snapshot.forEach(doc => {
      customers.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers',
      error: error.message
    });
  }
};

// Get single customer by ID
const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await customersCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
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
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById
};