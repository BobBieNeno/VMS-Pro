const vehicleRepository = require('../repositories/vehicle.repository');
const ApiError = require('../utils/ApiError');

/**
 * Service layer: business rules live here.
 * Controllers stay thin (parse request -> call service -> send response);
 * repositories stay dumb (pure data access). This is what makes each
 * layer independently unit-testable.
 */

function getAllVehicles({ search = '' } = {}) {
  const vehicles = vehicleRepository.findAll();

  if (!search) return vehicles;

  const term = search.trim().toLowerCase();
  return vehicles.filter(
    (v) =>
      v.licensePlate.toLowerCase().includes(term) ||
      v.brand.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term)
  );
}

function getVehicleById(id) {
  const vehicle = vehicleRepository.findById(id);
  if (!vehicle) {
    throw ApiError.notFound('ไม่พบข้อมูลรถยนต์คันนี้');
  }
  return vehicle;
}

function createVehicle(payload) {
  const duplicate = vehicleRepository.findByLicensePlate(payload.licensePlate);
  if (duplicate) {
    throw ApiError.conflict('หมายเลขทะเบียนนี้มีอยู่ในระบบแล้ว');
  }
  return vehicleRepository.create(payload);
}

function updateVehicle(id, payload) {
  const existing = vehicleRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('ไม่พบข้อมูลรถยนต์คันนี้');
  }

  if (payload.licensePlate) {
    const duplicate = vehicleRepository.findByLicensePlate(payload.licensePlate, id);
    if (duplicate) {
      throw ApiError.conflict('หมายเลขทะเบียนนี้มีอยู่ในระบบแล้ว');
    }
  }

  return vehicleRepository.update(id, payload);
}

function deleteVehicle(id) {
  const existing = vehicleRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound('ไม่พบข้อมูลรถยนต์คันนี้');
  }
  vehicleRepository.remove(id);
  return existing;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
