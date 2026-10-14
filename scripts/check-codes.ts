import { prisma } from '../src/lib/prisma';

async function main() {
  const cg = await prisma.station.findUnique({ where: { code: 'CG' }, include: { _count: { select: { scheduleStops: true } } } });
  const cnjg = await prisma.station.findUnique({ where: { code: 'CNJG' }, include: { _count: { select: { scheduleStops: true } } } });
  const d = await prisma.station.findUnique({ where: { code: 'D' }, include: { _count: { select: { scheduleStops: true } } } });
  const dh = await prisma.station.findUnique({ where: { code: 'DH' }, include: { _count: { select: { scheduleStops: true } } } });

  console.log({ cg, cnjg, d, dh });
}

main().finally(() => prisma.$disconnect());
