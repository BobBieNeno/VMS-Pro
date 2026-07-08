const request = require('supertest');

jest.mock('../../src/config/prisma', () => {
  let vehicles = [];
  let sequence = 1;

  function clone(vehicle) {
    return vehicle ? { ...vehicle } : null;
  }

  function matchesField(value, filter) {
    if (filter.equals !== undefined) {
      return value.toLowerCase() === filter.equals.toLowerCase();
    }
    if (filter.contains !== undefined) {
      return value.toLowerCase().includes(filter.contains.toLowerCase());
    }
    return false;
  }

  const vehicle = {
    __reset: () => {
      vehicles = [];
      sequence = 1;
    },
    findMany: jest.fn(async (args = {}) => {
      const where = args.where;
      let result = [...vehicles];
      if (where && where.OR) {
        result = result.filter((item) =>
          where.OR.some((condition) => {
            const [field, filter] = Object.entries(condition)[0];
            return matchesField(item[field], filter);
          })
        );
      }
      result.sort((a, b) => b.createdAt - a.createdAt);
      return result.map(clone);
    }),
    findUnique: jest.fn(async ({ where }) => clone(vehicles.find((item) => item.id === where.id))),
    findFirst: jest.fn(async ({ where }) => {
      const excludeId = where.NOT && where.NOT.id;
      return clone(
        vehicles.find(
          (item) =>
            item.licensePlate.toLowerCase() === where.licensePlate.equals.toLowerCase() &&
            item.id !== excludeId
        )
      );
    }),
    create: jest.fn(async ({ data }) => {
      const now = new Date();
      const created = {
        id: `vehicle-${sequence++}`,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      vehicles.push(created);
      return clone(created);
    }),
    update: jest.fn(async ({ where, data }) => {
      const index = vehicles.findIndex((item) => item.id === where.id);
      if (index === -1) throw new Error('Record not found');

      vehicles[index] = {
        ...vehicles[index],
        ...data,
        updatedAt: new Date(),
      };
      return clone(vehicles[index]);
    }),
    delete: jest.fn(async ({ where }) => {
      const index = vehicles.findIndex((item) => item.id === where.id);
      if (index === -1) throw new Error('Record not found');

      const [deleted] = vehicles.splice(index, 1);
      return clone(deleted);
    }),
  };

  return { vehicle };
});

const prisma = require('../../src/config/prisma');
const app = require('../../src/app');

beforeEach(() => {
  prisma.vehicle.__reset();
  jest.clearAllMocks();
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
    const res = await request(app).put('/api/vehicles/does-not-exist').send({ note: 'x' });

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
