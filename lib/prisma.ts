import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Create a client first
const _prisma = new PrismaClient();

// Extend with Accelerate
const extendedPrisma = _prisma.$extends(withAccelerate());

// Type the global scope properly
const globalForPrisma = globalThis as unknown as {
  prisma?: typeof extendedPrisma;
};

const prisma = globalForPrisma.prisma ?? extendedPrisma;

// Cache it globally (only in dev)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;


// import { PrismaClient } from '@prisma/client'

// import { withAccelerate } from '@prisma/extension-accelerate'
// const globalForPrisma = global as unknown as { 
//     prisma?: PrismaClient
// }

// const prisma = globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export default prisma

// import { PrismaClient } from '../app/generated/prisma'
// import { PrismaClient } from '@prisma/client';

// import { withAccelerate } from '@prisma/extension-accelerate'

// const globalForPrisma = global as unknown as {
//     prisma: PrismaClient
// }

// const prisma = new PrismaClient()

// // if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// export { prisma }

// import { PrismaClient } from '@prisma/client';

// let prisma: PrismaClient;

// if (process.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }

// export default prisma