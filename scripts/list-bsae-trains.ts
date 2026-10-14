import { prisma } from '../src/lib/prisma';

async function listKatwaTrains() {
  const bsae = await prisma.station.findUnique({ where: { code: 'BSAE' } });
  if (!bsae) return;
  const stops = await prisma.scheduleStop.findMany({
    where: { stationId: bsae.id },
    include: {
      train: {
        include: {
          scheduleStops: {
            include: { station: true },
            orderBy: { sequenceNo: 'asc' }
          }
        }
      }
    }
  });

  console.log(`Found ${stops.length} trains stopping at BSAE:`);
  for (const s of stops) {
    console.log(`Train ${s.train.number} - ${s.train.name}`);
    console.log(`  Route: ${s.train.scheduleStops.map(st => st.station.code).join(' -> ')}`);
  }
}

listKatwaTrains().finally(() => prisma.$disconnect());
