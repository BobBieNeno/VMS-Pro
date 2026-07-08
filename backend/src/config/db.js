const fs = require('fs');
const path = require('path');

/**
 * Lightweight JSON-file "database".
 * Keeps the project dependency-free (no native bindings to compile),
 * while still giving us real persistence across server restarts.
 *
 * In a production system this file would be swapped for a real
 * PostgreSQL/MySQL connection (pg/mysql2 pool) behind the same
 * repository interface - the rest of the app never talks to this
 * module directly, only vehicle.repository.js does.
 */

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function ensureDbFile() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = { vehicles: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    // Corrupted file fallback - never crash the app because of bad JSON on disk
    return { vehicles: [] };
  }
}

function writeDb(data) {
  ensureDbFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { readDb, writeDb, DB_FILE };
