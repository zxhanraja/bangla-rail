import { prisma } from '../src/lib/prisma';

async function main() {
  const haldiaStations = await prisma.station.findMany({
    where: {
      OR: [
        { code: { in: ['HLZ', 'DZK', 'SDA', 'BYSA', 'MSDL', 'BRST', 'RSPUR', 'BAAR', 'HLDZ'] } },
        { name: { contains: 'Haldia' } },
        { district: { contains: 'Purba Medinipur' } }
      ]
    },
    select: { id: true, code: true, name: true, district: true }
  });
  console.log('Haldia stations count:', haldiaStations.length);
  console.log('Sample stations:', haldiaStations.slice(0, 10));

  const haldiaTrains = await prisma.train.findMany({
    where: {
      OR: [
        { name: { contains: 'Haldia' } },
        { destinationStationCode: 'HLZ' },
        { originStationCode: 'HLZ' }
      ]
    },
    select: { id: true, number: true, name: true }
  });
  console.log('Haldia trains count:', haldiaTrains.length);
  console.log('Haldia trains:', haldiaTrains);

  // Check metro stations in DB
  const metroStations = await prisma.station.findMany({
    where: { code: { startsWith: 'M-' } },
    select: { code: true, name: true }
  });
  console.log('Metro stations in DB count:', metroStations.length);
  console.log('Metro station codes:', metroStations.map(s => s.code).join(', '));
}

main().catch(console.error).finally(() => prisma.$disconnect());
