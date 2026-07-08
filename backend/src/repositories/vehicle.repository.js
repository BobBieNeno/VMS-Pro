const prisma = require('../config/prisma');

/**
 * Repository layer: the ONLY place that touches the data store.
 * Services never talk to Prisma directly, so storage concerns stay here.
 */

function normalizeVehicle(vehicle) {
  if (!vehicle) return null;

  return {
    ...vehicle,
    createdAt: vehicle.createdAt instanceof Date ? vehicle.createdAt.toISOString() : vehicle.createdAt,
    updatedAt: vehicle.updatedAt instanceof Date ? vehicle.updatedAt.toISOString() : vehicle.updatedAt,
  };
}

async function findAll({ search = '' } = {}) {
  const term = search.trim();
  const vehicles = await prisma.vehicle.findMany({
    where: term
      ? {
          OR: [
            { licensePlate: { contains: term, mode: 'insensitive' } },
            { brand: { contains: term, mode: 'insensitive' } },
            { model: { contains: term, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return vehicles.map(normalizeVehicle);
}

async function findById(id) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  return normalizeVehicle(vehicle);
}

async function findByLicensePlate(licensePlate, excludeId = null) {
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      licensePlate: { equals: licensePlate.trim(), mode: 'insensitive' },
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  return normalizeVehicle(vehicle);
}

async function create(vehicleData) {
  const vehicle = await prisma.vehicle.create({
    data: {
      licensePlate: vehicleData.licensePlate.trim(),
      brand: vehicleData.brand.trim(),
      model: vehicleData.model.trim(),
      note: vehicleData.note ? vehicleData.note.trim() : '',
    },
  });

  return normalizeVehicle(vehicle);
}

async function update(id, updates) {
  const data = {};
  if (updates.licensePlate !== undefined) data.licensePlate = updates.licensePlate.trim();
  if (updates.brand !== undefined) data.brand = updates.brand.trim();
  if (updates.model !== undefined) data.model = updates.model.trim();
  if (updates.note !== undefined) data.note = updates.note ? updates.note.trim() : '';

  const vehicle = await prisma.vehicle.update({ where: { id }, data });
  return normalizeVehicle(vehicle);
}

async function remove(id) {
  await prisma.vehicle.delete({ where: { id } });
  return true;
}

module.exports = {
  findAll,
  findById,
  findByLicensePlate,
  create,
  update,
  remove,
};
