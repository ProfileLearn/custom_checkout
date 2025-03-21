// pages/api/saveConfig.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Validar estructura básica
      if (!req.body.fontSize || !req.body.fontFamily) {
        return res.status(400).json({ error: 'Configuración incompleta' });
      }

      const newConfig = await prisma.configuration.upsert({
        where: { id: req.body.id || 0 }, // Asume que el ID se pasa en el cuerpo de la solicitud
        update: {
          data: req.body
        },
        create: {
          data: req.body
        }
      });

      res.status(200).json({
        success: true,
        config: newConfig.data
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error guardando configuración' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}