// prisma.ts

import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Deja que TypeScript infiera el tipo de la variable 'prisma'
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient().$extends(withAccelerate());
} else {
  prisma = new PrismaClient();
}

export default prisma;