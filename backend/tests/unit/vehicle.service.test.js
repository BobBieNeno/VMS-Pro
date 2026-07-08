jest.mock('../../src/repositories/vehicle.repository');

const vehicleRepository = require('../../src/repositories/vehicle.repository');
const vehicleService = require('../../src/services/vehicle.service');
const ApiError = require('../../src/utils/ApiError');

describe('vehicle.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVehicles', () => {
    it('returns all vehicles when no search term is given', () => {
      const mockVehicles = [
        { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' },
        { id: '2', licensePlate: 'ขข 5678', brand: 'Honda', model: 'Civic' },
      ];
      vehicleRepository.findAll.mockReturnValue(mockVehicles);

      const result = vehicleService.getAllVehicles({});

      expect(result).toEqual(mockVehicles);
    });

    it('filters vehicles by brand (case-insensitive)', () => {
      const mockVehicles = [
        { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' },
        { id: '2', licensePlate: 'ขข 5678', brand: 'Honda', model: 'Civic' },
      ];
      vehicleRepository.findAll.mockReturnValue(mockVehicles);

      const result = vehicleService.getAllVehicles({ search: 'toyota' });

      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe('Toyota');
    });

    it('filters vehicles by license plate substring', () => {
      const mockVehicles = [
        { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' },
        { id: '2', licensePlate: 'ขข 5678', brand: 'Honda', model: 'Civic' },
      ];
      vehicleRepository.findAll.mockReturnValue(mockVehicles);

      const result = vehicleService.getAllVehicles({ search: '5678' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });
  });

  describe('getVehicleById', () => {
    it('returns the vehicle when found', () => {
      const vehicle = { id: '1', licensePlate: 'กก 1234' };
      vehicleRepository.findById.mockReturnValue(vehicle);

      expect(vehicleService.getVehicleById('1')).toEqual(vehicle);
    });

    it('throws a 404 ApiError when not found', () => {
      vehicleRepository.findById.mockReturnValue(null);

      expect(() => vehicleService.getVehicleById('missing-id')).toThrow(ApiError);
      try {
        vehicleService.getVehicleById('missing-id');
      } catch (err) {
        expect(err.statusCode).toBe(404);
      }
    });
  });

  describe('createVehicle', () => {
    it('creates a vehicle when the license plate is unique', () => {
      vehicleRepository.findByLicensePlate.mockReturnValue(null);
      const created = { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' };
      vehicleRepository.create.mockReturnValue(created);

      const payload = { licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' };
      const result = vehicleService.createVehicle(payload);

      expect(vehicleRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });

    it('throws a 409 ApiError when license plate already exists', () => {
      vehicleRepository.findByLicensePlate.mockReturnValue({ id: 'existing' });

      const payload = { licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' };

      expect(() => vehicleService.createVehicle(payload)).toThrow(ApiError);
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateVehicle', () => {
    it('updates when vehicle exists and no plate conflict', () => {
      vehicleRepository.findById.mockReturnValue({ id: '1', licensePlate: 'กก 1234' });
      vehicleRepository.findByLicensePlate.mockReturnValue(null);
      const updated = { id: '1', licensePlate: 'กก 9999' };
      vehicleRepository.update.mockReturnValue(updated);

      const result = vehicleService.updateVehicle('1', { licensePlate: 'กก 9999' });

      expect(result).toEqual(updated);
    });

    it('throws 404 when updating a non-existent vehicle', () => {
      vehicleRepository.findById.mockReturnValue(null);

      expect(() => vehicleService.updateVehicle('missing-id', { brand: 'Honda' })).toThrow(
        ApiError
      );
      expect(vehicleRepository.update).not.toHaveBeenCalled();
    });

    it('throws 409 when new license plate collides with another vehicle', () => {
      vehicleRepository.findById.mockReturnValue({ id: '1', licensePlate: 'กก 1234' });
      vehicleRepository.findByLicensePlate.mockReturnValue({ id: '2' });

      expect(() =>
        vehicleService.updateVehicle('1', { licensePlate: 'ขข 5678' })
      ).toThrow(ApiError);
      expect(vehicleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteVehicle', () => {
    it('deletes when the vehicle exists', () => {
      const vehicle = { id: '1', licensePlate: 'กก 1234' };
      vehicleRepository.findById.mockReturnValue(vehicle);
      vehicleRepository.remove.mockReturnValue(true);

      const result = vehicleService.deleteVehicle('1');

      expect(vehicleRepository.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(vehicle);
    });

    it('throws 404 when deleting a non-existent vehicle', () => {
      vehicleRepository.findById.mockReturnValue(null);

      expect(() => vehicleService.deleteVehicle('missing-id')).toThrow(ApiError);
      expect(vehicleRepository.remove).not.toHaveBeenCalled();
    });
  });
});
