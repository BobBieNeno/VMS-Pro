jest.mock('../../src/repositories/vehicle.repository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByLicensePlate: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const vehicleRepository = require('../../src/repositories/vehicle.repository');
const vehicleService = require('../../src/services/vehicle.service');
const ApiError = require('../../src/utils/ApiError');

describe('vehicle.service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVehicles', () => {
    it('returns all vehicles from the repository', async () => {
      const mockVehicles = [
        { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' },
        { id: '2', licensePlate: 'ขข 5678', brand: 'Honda', model: 'Civic' },
      ];
      vehicleRepository.findAll.mockResolvedValue(mockVehicles);

      const result = await vehicleService.getAllVehicles({});

      expect(vehicleRepository.findAll).toHaveBeenCalledWith({ search: '' });
      expect(result).toEqual(mockVehicles);
    });

    it('passes the search term to the repository', async () => {
      vehicleRepository.findAll.mockResolvedValue([
        { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' },
      ]);

      const result = await vehicleService.getAllVehicles({ search: 'toyota' });

      expect(vehicleRepository.findAll).toHaveBeenCalledWith({ search: 'toyota' });
      expect(result).toHaveLength(1);
      expect(result[0].brand).toBe('Toyota');
    });
  });

  describe('getVehicleById', () => {
    it('returns the vehicle when found', async () => {
      const vehicle = { id: '1', licensePlate: 'กก 1234' };
      vehicleRepository.findById.mockResolvedValue(vehicle);

      await expect(vehicleService.getVehicleById('1')).resolves.toEqual(vehicle);
    });

    it('throws a 404 ApiError when not found', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.getVehicleById('missing-id')).rejects.toThrow(ApiError);
      await expect(vehicleService.getVehicleById('missing-id')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('createVehicle', () => {
    it('creates a vehicle when the license plate is unique', async () => {
      vehicleRepository.findByLicensePlate.mockResolvedValue(null);
      const created = { id: '1', licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' };
      vehicleRepository.create.mockResolvedValue(created);

      const payload = { licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' };
      const result = await vehicleService.createVehicle(payload);

      expect(vehicleRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });

    it('throws a 409 ApiError when license plate already exists', async () => {
      vehicleRepository.findByLicensePlate.mockResolvedValue({ id: 'existing' });

      const payload = { licensePlate: 'กก 1234', brand: 'Toyota', model: 'Hilux Revo' };

      await expect(vehicleService.createVehicle(payload)).rejects.toThrow(ApiError);
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateVehicle', () => {
    it('updates when vehicle exists and no plate conflict', async () => {
      vehicleRepository.findById.mockResolvedValue({ id: '1', licensePlate: 'กก 1234' });
      vehicleRepository.findByLicensePlate.mockResolvedValue(null);
      const updated = { id: '1', licensePlate: 'กก 9999' };
      vehicleRepository.update.mockResolvedValue(updated);

      const result = await vehicleService.updateVehicle('1', { licensePlate: 'กก 9999' });

      expect(result).toEqual(updated);
    });

    it('throws 404 when updating a non-existent vehicle', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.updateVehicle('missing-id', { brand: 'Honda' })).rejects.toThrow(
        ApiError
      );
      expect(vehicleRepository.update).not.toHaveBeenCalled();
    });

    it('throws 409 when new license plate collides with another vehicle', async () => {
      vehicleRepository.findById.mockResolvedValue({ id: '1', licensePlate: 'กก 1234' });
      vehicleRepository.findByLicensePlate.mockResolvedValue({ id: '2' });

      await expect(
        vehicleService.updateVehicle('1', { licensePlate: 'ขข 5678' })
      ).rejects.toThrow(ApiError);
      expect(vehicleRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteVehicle', () => {
    it('deletes when the vehicle exists', async () => {
      const vehicle = { id: '1', licensePlate: 'กก 1234' };
      vehicleRepository.findById.mockResolvedValue(vehicle);
      vehicleRepository.remove.mockResolvedValue(true);

      const result = await vehicleService.deleteVehicle('1');

      expect(vehicleRepository.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(vehicle);
    });

    it('throws 404 when deleting a non-existent vehicle', async () => {
      vehicleRepository.findById.mockResolvedValue(null);

      await expect(vehicleService.deleteVehicle('missing-id')).rejects.toThrow(ApiError);
      expect(vehicleRepository.remove).not.toHaveBeenCalled();
    });
  });
});
