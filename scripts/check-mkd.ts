import { prisma } from '../src/lib/prisma';

async function main() {
  const st = await prisma.station.findMany({
    where: {
      OR: [
        { name: { contains: 'Mankundu' } },
        { code: { contains: 'MKD' } },
        { code: { contains: 'MUU' } },
        { name: { contains: 'Mank' } },
      ],
    },
  });
  console.log('Mankundu Station Match:', JSON.stringify(st, null, 2));

  const trainCount = await prisma.train.count();
  console.log('Total Trains in DB:', trainCount);

  const stopCount = await prisma.scheduleStop.count();
  console.log('Total Schedule Stops in DB:', stopCount);

  // Check Mankundu to Howrah specifically
  if (st.length > 0) {
    const mkd = st[0];
    const hwh = await prisma.station.findFirst({ where: { code: 'HWH' } });
    console.log('Howrah Station:', hwh?.code, hwh?.name);

    if (hwh) {
      const mkdStops = await prisma.scheduleStop.findMany({
        where: { stationId: mkd.id },
        include: { train: true }
      });
      console.log(`Stops at ${mkd.code} (${mkd.name}):`, mkdStops.length);

      const toHwh = [];
      for (const s of mkdStops) {
        const hwhStop = await prisma.scheduleStop.findFirst({
          where: {
            trainId: s.trainId,
            stationId: hwh.id,
            sequenceNo: { gt: s.sequenceNo }
          }
        });
        if (hwhStop) {
          toHwh.push({
            train: s.train.number,
            name: s.train.name,
            dep: s.departureTime,
            arr: hwhStop.arrivalTime
          });
        }
      }
      console.log(`Direct trains from ${mkd.code} to HWH:`, toHwh.length);
      console.log('Sample trains:', toHwh.slice(0, 5));
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
