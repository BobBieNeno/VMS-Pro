/**
 * Plain-function validators (no external validation library needed
 * for a schema this small). Kept separate from the service so it's
 * trivially unit-testable and reusable by both POST and PUT.
 *
 * Returns: { isValid: boolean, errors: { field: message } }
 */
function validateVehiclePayload(payload, { partial = false } = {}) {
  const errors = {};
  const data = payload || {};

  const requiredFields = ['licensePlate', 'brand', 'model'];

  requiredFields.forEach((field) => {
    const value = data[field];
    const isProvided = value !== undefined;

    if (!partial || isProvided) {
      if (!value || typeof value !== 'string' || !value.trim()) {
        errors[field] = fieldMessages[field].required;
      } else if (value.trim().length > 100) {
        errors[field] = fieldMessages[field].tooLong;
      }
    }
  });

  if (data.note !== undefined && data.note !== null) {
    if (typeof data.note !== 'string') {
      errors.note = 'หมายเหตุต้องเป็นข้อความ';
    } else if (data.note.length > 1000) {
      errors.note = 'หมายเหตุต้องมีความยาวไม่เกิน 1000 ตัวอักษร';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

const fieldMessages = {
  licensePlate: {
    required: 'กรุณากรอกหมายเลขทะเบียนรถ',
    tooLong: 'หมายเลขทะเบียนต้องมีความยาวไม่เกิน 100 ตัวอักษร',
  },
  brand: {
    required: 'กรุณากรอกยี่ห้อรถยนต์',
    tooLong: 'ยี่ห้อรถยนต์ต้องมีความยาวไม่เกิน 100 ตัวอักษร',
  },
  model: {
    required: 'กรุณากรอกรุ่นรถ',
    tooLong: 'รุ่นรถต้องมีความยาวไม่เกิน 100 ตัวอักษร',
  },
};

module.exports = { validateVehiclePayload };
