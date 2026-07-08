const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('../config/db');

/**
 * Repository layer: the ONLY place that touches the data store.
 * Services never read/write the db file directly - this keeps
 * storage swappable (e.g. moving to PostgreSQL later only requires
 * rewriting this file, nothing above it).
 */

function findAll() {
  const db = readDb();
  return db.vehicles;
}

function findById(id) {
  const db = readDb();
  return db.vehicles.find((v) => v.id === id) || null;
}

function findByLicensePlate(licensePlate, excludeId = null) {
  const db = readDb();
  return db.vehicles.find(
    (v) =>
      v.licensePlate.trim().toLowerCase() === licensePlate.trim().toLowerCase() &&
      v.id !== excludeId
  ) || null;
}

function create(vehicleData) {
  const db = readDb();
  const now = new Date().toISOString();
  const newVehicle = {
    id: uuidv4(),
    licensePlate: vehicleData.licensePlate.trim(),
    brand: vehicleData.brand.trim(),
    model: vehicleData.model.trim(),
    note: vehicleData.note ? vehicleData.note.trim() : '',
    createdAt: now,
    updatedAt: now,
  };
  db.vehicles.push(newVehicle);
  writeDb(db);
  return newVehicle;
}

function update(id, updates) {
  const db = readDb();
  const index = db.vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const existing = db.vehicles[index];
  const updated = {
    ...existing,
    ...(updates.licensePlate !== undefined && { licensePlate: updates.licensePlate.trim() }),
    ...(updates.brand !== undefined && { brand: updates.brand.trim() }),
    ...(updates.model !== undefined && { model: updates.model.trim() }),
    ...(updates.note !== undefined && { note: updates.note.trim() }),
    updatedAt: new Date().toISOString(),
  };

  db.vehicles[index] = updated;
  writeDb(db);
  return updated;
}

function remove(id) {
  const db = readDb();
  const index = db.vehicles.findIndex((v) => v.id === id);
  if (index === -1) return false;

  db.vehicles.splice(index, 1);
  writeDb(db);
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
