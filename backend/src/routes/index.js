const express = require('express');
const vehicleRoutes = require('./vehicle.routes');

const router = express.Router();

router.use('/vehicles', vehicleRoutes);

module.exports = router;
