const fs = require('fs');
const path = require('path');
const request = require('supertest');

// Use an isolated db file for integration tests so we never touch
// real dev data and each test run starts from a clean slate.
const TEST_DB_FILE = path.join(__dirname, '__test_db__.json');

jest.mock('../../src/config/db', () => {
  const fsLib = require('fs');
  const filePath = require('path').join(__dirname, '__test_db__.json');

  function ensure() {
    if (!fsLib.existsSync(filePath)) {
      fsLib.writeFileSync(filePath, JSON.stringify({ vehicles: [] }, null, 2));
    }
  }
  return {
    readDb: () => {
      ensure();
      return JSON.parse(fsLib.readFileSync(filePath, 'utf-8'));
    },
    writeDb: (data) => {
      ensure();
      fsLib.writeFileSync(filePath, JSON.stringify(data, null, 2));
    },
    DB_FILE: filePath,
  };
});

const app = require('../../src/app');

beforeEach(() => {
  fs.writeFileSync(TEST_DB_FILE, JSON.stringify({ vehicles: [] }, null, 2));
});

afterAll(() => {
  if (fs.existsSync(TEST_DB_FILE)) fs.unlinkSync(TEST_DB_FILE);
});

describe('Vehicle API (integration)', () => {
  const validPayload = {
    licensePlate: '1กข 1234',
    brand: 'Toyota',
    model: 'Hilux Revo',
    note: 'รถกระบะสำหรับทีมขนส่ง',
  };

  it('GET /api/vehicles returns an empty list initially', async () => {
    const res = await request(app).get('/api/vehicles');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('POST /api/vehicles creates a new vehicle', async () => {
    const res = await request(app).post('/api/vehicles').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.licensePlate).toBe(validPayload.licensePlate);
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/vehicles rejects an invalid payload with 400', async () => {
    const res = await request(app).post('/api/vehicles').send({ brand: 'Toyota' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.licensePlate).toBeDefined();
    expect(res.body.errors.model).toBeDefined();
  });

  it('POST /api/vehicles rejects duplicate license plates with 409', async () => {
    await request(app).post('/api/vehicles').send(validPayload);
    const res = await request(app).post('/api/vehicles').send(validPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('PUT /api/vehicles/:id updates an existing vehicle', async () => {
    const createRes = await request(app).post('/api/vehicles').send(validPayload);
    const { id } = createRes.body.data;

    const res = await request(app)
      .put(`/api/vehicles/${id}`)
      .send({ note: 'อัปเดตหมายเหตุแล้ว' });

    expect(res.status).toBe(200);
    expect(res.body.data.note).toBe('อัปเดตหมายเหตุแล้ว');
    expect(res.body.data.licensePlate).toBe(validPayload.licensePlate);
  });

  it('PUT /api/vehicles/:id returns 404 for a non-existent id', async () => {
    const res = await request(app)
      .put('/api/vehicles/does-not-exist')
      .send({ note: 'x' });

    expect(res.status).toBe(404);
  });

  it('DELETE /api/vehicles/:id removes the vehicle', async () => {
    const createRes = await request(app).post('/api/vehicles').send(validPayload);
    const { id } = createRes.body.data;

    const deleteRes = await request(app).delete(`/api/vehicles/${id}`);
    expect(deleteRes.status).toBe(200);

    const listRes = await request(app).get('/api/vehicles');
    expect(listRes.body.data).toEqual([]);
  });

  it('GET /api/vehicles?search= filters results', async () => {
    await request(app).post('/api/vehicles').send(validPayload);
    await request(app)
      .post('/api/vehicles')
      .send({ licensePlate: '2ขค 5678', brand: 'Honda', model: 'Civic' });

    const res = await request(app).get('/api/vehicles').query({ search: 'honda' });

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].brand).toBe('Honda');
  });
});
