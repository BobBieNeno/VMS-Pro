const vehicleService = require('../services/vehicle.service');
const { sendSuccess } = require('../utils/response');

/**
 * Controllers only: parse request -> delegate to service -> format response.
 * No business logic here, no direct data access. Errors are simply
 * forwarded to next() so the central errorHandler middleware deals
 * with them uniformly.
 */

function getAllVehicles(req, res, next) {
  try {
    const { search } = req.query;
    const vehicles = vehicleService.getAllVehicles({ search });
    return sendSuccess(res, {
      data: vehicles,
      message: 'ดึงข้อมูลรถยนต์สำเร็จ',
      meta: { total: vehicles.length },
    });
  } catch (err) {
    return next(err);
  }
}

function getVehicleById(req, res, next) {
  try {
    const vehicle = vehicleService.getVehicleById(req.params.id);
    return sendSuccess(res, { data: vehicle, message: 'ดึงข้อมูลรถยนต์สำเร็จ' });
  } catch (err) {
    return next(err);
  }
}

function createVehicle(req, res, next) {
  try {
    const vehicle = vehicleService.createVehicle(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      data: vehicle,
      message: 'เพิ่มข้อมูลรถยนต์สำเร็จ',
    });
  } catch (err) {
    return next(err);
  }
}

function updateVehicle(req, res, next) {
  try {
    const vehicle = vehicleService.updateVehicle(req.params.id, req.body);
    return sendSuccess(res, { data: vehicle, message: 'บันทึกข้อมูลสำเร็จ' });
  } catch (err) {
    return next(err);
  }
}

function deleteVehicle(req, res, next) {
  try {
    vehicleService.deleteVehicle(req.params.id);
    return sendSuccess(res, { data: null, message: 'ลบข้อมูลสำเร็จ' });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
