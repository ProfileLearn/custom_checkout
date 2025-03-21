const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Lee el archivo JSON. Ajusta la ruta según dónde lo tengas guardado.
  const jsonPath = path.join(__dirname, 'formConfig.json');
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Inserta la configuración en la base de datos
  const config = await prisma.configuration.create({
    data: {
      data: jsonData,
    },
  });

  console.log('Configuración insertada:', config);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
