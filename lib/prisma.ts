// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Evita crear múltiples instancias de Prisma en desarrollo
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"], // Opcional: muestra las consultas SQL en consola
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
