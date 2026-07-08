const { validateVehiclePayload } = require('../../src/validators/vehicle.validator');

describe('vehicle.validator', () => {
  describe('create mode (partial: false)', () => {
    it('passes with a fully valid payload', () => {
      const { isValid, errors } = validateVehiclePayload({
        licensePlate: '1กข 1234',
        brand: 'Toyota',
        model: 'Hilux Revo',
        note: 'รถกระบะ',
      });

      expect(isValid).toBe(true);
      expect(errors).toEqual({});
    });

    it('fails when licensePlate is missing', () => {
      const { isValid, errors } = validateVehiclePayload({
        brand: 'Toyota',
        model: 'Hilux Revo',
      });

      expect(isValid).toBe(false);
      expect(errors.licensePlate).toBeDefined();
    });

    it('fails when brand is an empty/whitespace string', () => {
      const { isValid, errors } = validateVehiclePayload({
        licensePlate: '1กข 1234',
        brand: '   ',
        model: 'Hilux Revo',
      });

      expect(isValid).toBe(false);
      expect(errors.brand).toBeDefined();
    });

    it('fails when a required field exceeds max length', () => {
      const { isValid, errors } = validateVehiclePayload({
        licensePlate: 'x'.repeat(101),
        brand: 'Toyota',
        model: 'Hilux Revo',
      });

      expect(isValid).toBe(false);
      expect(errors.licensePlate).toMatch(/ไม่เกิน/);
    });

    it('fails when note exceeds max length', () => {
      const { isValid, errors } = validateVehiclePayload({
        licensePlate: '1กข 1234',
        brand: 'Toyota',
        model: 'Hilux Revo',
        note: 'x'.repeat(1001),
      });

      expect(isValid).toBe(false);
      expect(errors.note).toBeDefined();
    });

    it('allows note to be omitted entirely', () => {
      const { isValid } = validateVehiclePayload({
        licensePlate: '1กข 1234',
        brand: 'Toyota',
        model: 'Hilux Revo',
      });

      expect(isValid).toBe(true);
    });
  });

  describe('update mode (partial: true)', () => {
    it('passes when only one field is being updated', () => {
      const { isValid, errors } = validateVehiclePayload(
        { note: 'อัปเดตหมายเหตุ' },
        { partial: true }
      );

      expect(isValid).toBe(true);
      expect(errors).toEqual({});
    });

    it('still rejects an explicitly empty required field', () => {
      const { isValid, errors } = validateVehiclePayload(
        { licensePlate: '' },
        { partial: true }
      );

      expect(isValid).toBe(false);
      expect(errors.licensePlate).toBeDefined();
    });
  });
});
