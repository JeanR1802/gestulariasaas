// lib/prisma.ts

import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Esto asegura que la variable 'prisma' tenga un tipo globalmente reconocido.
// Si ya existe un cliente, lo usa. Si no, lo crea.
const prisma = globalThis.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// En producción, extiende el cliente para usar Accelerate.
if (process.env.NODE_ENV === 'production') {
  globalThis.prisma = prisma.$extends(withAccelerate());
} else {
  // En desarrollo, el cliente se mantiene simple para evitar errores.
  globalThis.prisma = prisma;
}

export default globalThis.prisma;