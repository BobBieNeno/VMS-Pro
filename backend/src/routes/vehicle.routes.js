const express = require('express');
const vehicleController = require('../controllers/vehicle.controller');
const {
  validateCreateVehicle,
  validateUpdateVehicle,
} = require('../middlewares/validateRequest');

const router = express.Router();

// GET /api/vehicles?search=... -> list all (optionally filtered)
router.get('/', vehicleController.getAllVehicles);

// GET /api/vehicles/:id -> single vehicle
router.get('/:id', vehicleController.getVehicleById);

// POST /api/vehicles -> create
router.post('/', validateCreateVehicle, vehicleController.createVehicle);

// PUT /api/vehicles/:id -> update
router.put('/:id', validateUpdateVehicle, vehicleController.updateVehicle);

// DELETE /api/vehicles/:id -> delete
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;
