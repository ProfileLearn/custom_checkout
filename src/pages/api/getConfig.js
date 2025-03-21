// pages/api/getConfig.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log('Recibida solicitud GET a /api/getConfig');
  console.log('Request method:', req.method);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // Verificar conexión a la base de datos
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    await prisma.$connect();
    console.log('Conexión a DB exitosa');

    const latestConfig = await prisma.configuration.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const defaultConfig = {
      fontSize: 'text-base',
      fontFamily: 'font-sans',
      backgroundImage: '',
      fields: {}
    };

    if (!latestConfig) {
      console.log('No hay configuraciones, usando valores por defecto');
      return res.status(200).json({
        success: true,
        isDefault: true,
        config: defaultConfig
      });
    }

    res.status(200).json({
      success: true,
      isDefault: false,
      config: latestConfig.data
    });

  } catch (error) {
    console.error('Error crítico:', error);
    res.status(500).json({
      success: false,
      error: 'Error de servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : ''
    });
  } finally {
    await prisma.$disconnect();
  }
}