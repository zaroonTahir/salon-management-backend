const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById
} = require('../controllers/appointmentController');

// POST /appointments/create - Create a new appointment
router.post('/create', createAppointment);

// GET /appointments/ - Get all appointments
router.get('/', getAllAppointments);

// GET /appointments/:id - Get single appointment
router.get('/:id', getAppointmentById);

module.exports = router;