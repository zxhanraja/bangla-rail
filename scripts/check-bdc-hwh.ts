import { prisma } from '../src/lib/prisma';

async function check() {
  const bdc = await prisma.station.findUnique({ where: { code: 'BDC' } });
  const hwh = await prisma.station.findUnique({ where: { code: 'HWH' } });
  console.log('BDC station:', bdc?.name, bdc?.id);
  console.log('HWH station:', hwh?.name, hwh?.id);

  if (bdc && hwh) {
    const bdcStops = await prisma.scheduleStop.findMany({
      where: { stationId: bdc.id },
      include: { train: true }
    });

    const bdcToHwh = [];
    for (const fStop of bdcStops) {
      const tStop = await prisma.scheduleStop.findFirst({
        where: {
          trainId: fStop.trainId,
          stationId: hwh.id,
          sequenceNo: { gt: fStop.sequenceNo }
        }
      });
      if (tStop) {
        bdcToHwh.push({
          num: fStop.train.number,
          name: fStop.train.name,
          dep: fStop.departureTime || fStop.arrivalTime,
          arr: tStop.arrivalTime || tStop.departureTime
        });
      }
    }
    console.log(`Found ${bdcToHwh.length} direct trains from Bandel to Howrah in DB:`);
    bdcToHwh.slice(0, 10).forEach(t => console.log(`  ${t.num} ${t.name}: ${t.dep} -> ${t.arr}`));
  }
}

check().finally(() => prisma.$disconnect());
