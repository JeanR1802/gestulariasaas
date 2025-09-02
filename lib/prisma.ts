import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Declara la variable con el tipo correcto de PrismaClient
let prisma: PrismaClient;

// Usa una condición para el entorno de producción
if (process.env.NODE_ENV === 'production') {
  // Inicializa Prisma con la extensión de Accelerate
  prisma = new PrismaClient().$extends(withAccelerate());
} else {
  // Inicializa un cliente normal para el entorno de desarrollo
  prisma = new PrismaClient();
}

export default prisma;