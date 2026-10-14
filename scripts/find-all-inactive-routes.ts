import { prisma } from '../src/lib/prisma';

async function main() {
  const inactive = await prisma.station.findMany({
    where: { scheduleStops: { none: {} } },
    select: { code: true, name: true, nameBn: true, division: true, district: true },
    orderBy: { division: 'asc' },
  });

  console.log(`Total inactive stations: ${inactive.length}`);
  for (const s of inactive) {
    console.log(`${s.division || '?'}\t${s.code}\t${s.name}\t${s.district || ''}`);
  }
}

main().finally(() => prisma.$disconnect());
