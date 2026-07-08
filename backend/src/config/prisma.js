const { PrismaClient } = require('@prisma/client');
const { neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to connect Prisma to Neon PostgreSQL');
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
