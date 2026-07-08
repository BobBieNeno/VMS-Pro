const vehicleRepository = require('../repositories/vehicle.repository');
const ApiError = require('../utils/ApiError');

/**
 * Service layer: business rules live here.
 * Controllers stay thin (parse request -> call service -> send response);
 * repositories stay dumb (pure data access).
 */

async function getAllVehicles({ search = '' } = {}) {
  return vehicleRepository.findAll({ search });
}

async function getVehicleById(id) {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw ApiError.notFound('ไม่พบข้อมูลรถยนต์คันนี้');
  }
  return vehicle;
}

async function createVehicle(payload) {
  const duplicate = await vehicleRepository.findByLicensePlate(payload.licensePlate);
  if (duplicate) {
    throw ApiError.conflict('หมายเลขทะเบียนนี้มีอยู่ในระบบแล้ว');
  }
  return vehicleRepository.create(payload);
}

async function updateVehicle(id, payload) {
  const existing = await vehicleRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('ไม่พบข้อมูลรถยนต์คันนี้');
  }

  if (payload.licensePlate) {
    const duplicate = await vehicleRepository.findByLicensePlate(payload.licensePlate, id);
    if (duplicate) {
      throw ApiError.conflict('หมายเลขทะเบียนนี้มีอยู่ในระบบแล้ว');
    }
  }

  return vehicleRepository.update(id, payload);
}

async function deleteVehicle(id) {
  const existing = await vehicleRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('ไม่พบข้อมูลรถยนต์คันนี้');
  }

  await vehicleRepository.remove(id);
  return existing;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
