const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// All routes require authentication
router.use(authMiddleware);

// POST /services/create - Create service (admin only)
router.post('/create', roleMiddleware('admin'), createService);

// GET /services - Get all services (all authenticated users)
router.get('/', getAllServices);

// GET /services/:id - Get single service (all authenticated users)
router.get('/:id', getServiceById);

// PUT /services/:id - Update service (admin only)
router.put('/:id', roleMiddleware('admin'), updateService);

// DELETE /services/:id - Delete service (admin only)
router.delete('/:id', roleMiddleware('admin'), deleteService);

module.exports = router;