// prisma.ts (o el nombre de tu archivo)

import { PrismaClient } from '@prisma/client/edge' // Fíjate en el '/edge'
import { withAccelerate } from '@prisma/extension-accelerate' // Importa la extensión

const prisma = new PrismaClient().$extends(withAccelerate())

export default prisma