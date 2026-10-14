import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { 
  prisma: PrismaClient; 
  prismaPragmasApplied?: boolean; 
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Execute WAL mode and high-performance SQLite pragmas for concurrent traffic
if (!globalForPrisma.prismaPragmasApplied) {
  globalForPrisma.prismaPragmasApplied = true;
  (async () => {
    try {
      // In SQLite, several PRAGMAs return results, so queryRawUnsafe handles them safely
      await prisma.$queryRawUnsafe(`PRAGMA journal_mode = WAL;`);
      await prisma.$queryRawUnsafe(`PRAGMA synchronous = NORMAL;`);
      await prisma.$queryRawUnsafe(`PRAGMA cache_size = -64000;`); // 64 MB memory page cache
      await prisma.$queryRawUnsafe(`PRAGMA busy_timeout = 10000;`); // 10000 ms busy timeout for concurrent writes
      await prisma.$queryRawUnsafe(`PRAGMA temp_store = MEMORY;`);
    } catch (err: any) {
      // Non-fatal if using external database provider in future
      console.warn('SQLite pragmas notice:', err?.message || err);
    }
  })();
}


