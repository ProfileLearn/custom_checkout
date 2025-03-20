// src/pages/api/saveConfig.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 1. Validar datos básicos
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Datos de configuración inválidos' });
      }

      // 2. Definir rutas
      const configPath = path.join(process.cwd(), 'public', 'formConfig.json');
      const backupPath = path.join(process.cwd(), 'public', 'formConfig.backup.json');

      // 3. Crear backup
      if (fs.existsSync(configPath)) {
        fs.copyFileSync(configPath, backupPath);
      }

      // 4. Escribir nueva configuración
      fs.writeFileSync(
        configPath,
        JSON.stringify(req.body, null, 2),
        'utf8'
      );

      // 5. Responder con éxito
      res.status(200).json({
        message: 'Configuración guardada exitosamente',
        backup: backupPath
      });

    } catch (error) {
      console.error('Error guardando configuración:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Método ${req.method} no permitido` });
  }
}