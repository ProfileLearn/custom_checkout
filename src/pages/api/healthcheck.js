// pages/api/healthcheck.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // 1. Verificar conexión a DB
    await prisma.$connect();

    // 2. Verificar migraciones
    const migrations = await prisma.$queryRaw`SELECT * FROM _prisma_migrations`;

    res.status(200).json({
      dbStatus: 'OK',
      migrationsCount: migrations.length,
      prismaVersion: require('@prisma/client/package.json').version
    });

  } catch (error) {
    res.status(500).json({
      dbStatus: 'ERROR',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    await prisma.$disconnect();
  }
}