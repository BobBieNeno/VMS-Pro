const ApiError = require('../utils/ApiError');
const { validateVehiclePayload } = require('../validators/vehicle.validator');

/**
 * Runs before the controller. Rejects malformed payloads early with
 * a 400 + field-level error map, so the controller/service only ever
 * deal with already-valid data.
 */
function validateCreateVehicle(req, res, next) {
  const { isValid, errors } = validateVehiclePayload(req.body, { partial: false });
  if (!isValid) {
    return next(ApiError.badRequest('ข้อมูลไม่ถูกต้อง', errors));
  }
  return next();
}

function validateUpdateVehicle(req, res, next) {
  const { isValid, errors } = validateVehiclePayload(req.body, { partial: true });
  if (!isValid) {
    return next(ApiError.badRequest('ข้อมูลไม่ถูกต้อง', errors));
  }
  return next();
}

module.exports = { validateCreateVehicle, validateUpdateVehicle };
