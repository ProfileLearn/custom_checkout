// custom_boxful_checkout/src/pages/api/upload.js
import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false // Desactivar bodyParser de Next
  }
};

export default async function handler(req, res) {
  const form = new IncomingForm();

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.background?.[0];
    if (!file) throw new Error('No se recibió archivo');

    // Validaciones
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Solo se permiten imágenes JPEG, PNG o WEBP');
    }

    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generar nombre único
    const ext = path.extname(file.originalFilename);
    const filename = `bg-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Mover archivo utilizando copyFileSync y unlinkSync
    fs.copyFileSync(file.filepath, filepath);
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      url: `/uploads/${filename}`,
      message: 'Imagen subida correctamente'
    });

  } catch (error) {
    console.error('Error en upload:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la imagen'
    });
  }
}