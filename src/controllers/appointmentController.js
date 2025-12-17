const { db } = require('../config/firebase');
const { validateAppointment } = require('../validators/appointmentValidator');

const appointmentsCollection = db.collection('appointments');
const customersCollection = db.collection('customers');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const { customerId, serviceName, appointmentDate, notes, status } = req.body;

    // Validate input
    const validation = validateAppointment(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Check if customer exists
    const customerDoc = await customersCollection.doc(customerId).get();
    if (!customerDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Create appointment object
    const appointmentData = {
      customerId: customerId.trim(),
      customerName: customerDoc.data().name,
      serviceName: serviceName.trim(),
      appointmentDate: new Date(appointmentDate).toISOString(),
      notes: notes || '',
      status: status || 'pending',
      createdAt: new Date().toISOString()
    };

    // Add to Firestore
    const docRef = await appointmentsCollection.add(appointmentData);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        id: docRef.id,
        ...appointmentData
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const snapshot = await appointmentsCollection.orderBy('appointmentDate', 'asc').get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        count: 0,
        data: []
      });
    }

    const appointments = [];
    snapshot.forEach(doc => {
      appointments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// Get single appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await appointmentsCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
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
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById
};