import { prisma } from '../src/lib/prisma';

async function main() {
  const totalStations = await prisma.station.count();
  const activeStations = await prisma.station.count({ where: { scheduleStops: { some: {} } } });
  const inactiveStations = await prisma.station.count({ where: { scheduleStops: { none: {} } } });
  const totalTrains = await prisma.train.count();
  const totalStops = await prisma.scheduleStop.count();

  console.log({ totalStations, activeStations, inactiveStations, totalTrains, totalStops });

  // Get sample of stations without stops
  const inactiveSample = await prisma.station.findMany({
    where: { scheduleStops: { none: {} } },
    select: { code: true, name: true },
    take: 10,
  });
  console.log('Sample stations without stops:', inactiveSample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
