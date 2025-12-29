const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById
} = require('../controllers/appointmentController');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /appointments/create - Create appointment (authenticated users)
router.post('/create', createAppointment);

// GET /appointments/ - Get all appointments (authenticated users)
router.get('/', getAllAppointments);

// GET /appointments/:id - Get single appointment (authenticated users)
router.get('/:id', getAppointmentById);

module.exports = router;