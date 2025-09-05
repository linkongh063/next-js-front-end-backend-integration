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

