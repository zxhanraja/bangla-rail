import { prisma } from '../src/lib/prisma';

async function checkTrainStops() {
  const bsae = await prisma.station.findUnique({ where: { code: 'BSAE' } });
  const ipra = await prisma.station.findUnique({ where: { code: 'IPRA' } });
  const bdc = await prisma.station.findUnique({ where: { code: 'BDC' } });

  console.log('BSAE id:', bsae?.id);
  console.log('IPRA id:', ipra?.id);
  console.log('BDC id:', bdc?.id);

  if (bsae) {
    const stops = await prisma.scheduleStop.count({ where: { stationId: bsae.id } });
    console.log('Stops at BSAE:', stops);
  }
  if (ipra) {
    const stops = await prisma.scheduleStop.count({ where: { stationId: ipra.id } });
    console.log('Stops at IPRA:', stops);
  }
}

checkTrainStops().finally(() => prisma.$disconnect());
