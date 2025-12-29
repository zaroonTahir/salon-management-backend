const { db } = require('../config/firebase');
const { validateService } = require('../validators/serviceValidator');

const servicesCollection = db.collection('services');

/**
 * Create a new service (admin only)
 */
const createService = async (req, res) => {
  try {
    const { name, price, duration, description } = req.body;

    // Validate input
    const validation = validateService(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if service with same name already exists
    const existingService = await servicesCollection
      .where('name', '==', name.trim())
      .get();

    if (!existingService.empty) {
      return res.status(400).json({
        success: false,
        message: 'Service with this name already exists'
      });
    }

    // Create service object
    const serviceData = {
      name: name.trim(),
      price: parseFloat(price),
      duration: parseInt(duration),
      description: description ? description.trim() : '',
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    const docRef = await servicesCollection.add(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        id: docRef.id,
        ...serviceData
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message
    });
  }
};

/**
 * Get all services (authenticated users)
 */
const getAllServices = async (req, res) => {
  try {
    const snapshot = await servicesCollection
      .orderBy('name', 'asc')
      .get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const services = [];
    snapshot.forEach(doc => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message
    });
  }
};

/**
 * Get single service by ID (authenticated users)
 */
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await servicesCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
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
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message
    });
  }
};

/**
 * Update service (admin only)
 */
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, description } = req.body;

    // Validate input
    const validation = validateService(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if service exists
    const serviceDoc = await servicesCollection.doc(id).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if new name conflicts with existing service
    if (name.trim() !== serviceDoc.data().name) {
      const existingService = await servicesCollection
        .where('name', '==', name.trim())
        .get();

      if (!existingService.empty) {
        return res.status(400).json({
          success: false,
          message: 'Service with this name already exists'
        });
      }
    }

    // Update service
    const updateData = {
      name: name.trim(),
      price: parseFloat(price),
      duration: parseInt(duration),
      description: description ? description.trim() : '',
      updatedBy: req.user.id,
      updatedByName: req.user.name,
      updatedAt: new Date().toISOString()
    };

    await servicesCollection.doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: {
        id,
        ...serviceDoc.data(),
        ...updateData
      }
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message
    });
  }
};

/**
 * Delete service (admin only)
 */
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if service exists
    const serviceDoc = await servicesCollection.doc(id).get();
    if (!serviceDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Delete service
    await servicesCollection.doc(id).delete();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
};