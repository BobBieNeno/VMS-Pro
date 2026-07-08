const vehicleService = require('../services/vehicle.service');
const { sendSuccess } = require('../utils/response');

/**
 * Controllers only: parse request -> delegate to service -> format response.
 * No business logic here, no direct data access. Errors are simply
 * forwarded to next() so the central errorHandler middleware deals
 * with them uniformly.
 */

async function getAllVehicles(req, res, next) {
  try {
    const { search } = req.query;
    const vehicles = await vehicleService.getAllVehicles({ search });
    return sendSuccess(res, {
      data: vehicles,
      message: 'ดึงข้อมูลรถยนต์สำเร็จ',
      meta: { total: vehicles.length },
    });
  } catch (err) {
    return next(err);
  }
}

async function getVehicleById(req, res, next) {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    return sendSuccess(res, { data: vehicle, message: 'ดึงข้อมูลรถยนต์สำเร็จ' });
  } catch (err) {
    return next(err);
  }
}

async function createVehicle(req, res, next) {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    return sendSuccess(res, {
      statusCode: 201,
      data: vehicle,
      message: 'เพิ่มข้อมูลรถยนต์สำเร็จ',
    });
  } catch (err) {
    return next(err);
  }
}

async function updateVehicle(req, res, next) {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    return sendSuccess(res, { data: vehicle, message: 'บันทึกข้อมูลสำเร็จ' });
  } catch (err) {
    return next(err);
  }
}

async function deleteVehicle(req, res, next) {
  try {
    await vehicleService.deleteVehicle(req.params.id);
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
