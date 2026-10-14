import { prisma } from '../src/lib/prisma';

async function testRoutes() {
  const pairs = [
    ['BDC', 'HWH', 'Bandel -> Howrah'],
    ['HWH', 'BDC', 'Howrah -> Bandel'],
    ['IPRA', 'BDC', 'Islampara -> Bandel'],
    ['BDC', 'IPRA', 'Bandel -> Islampara'],
    ['BSAE', 'BDC', 'Bansberia -> Bandel'],
    ['HLMT', 'HWH', 'Hindmotor -> Howrah'],
    ['BELR', 'HWH', 'Belur -> Howrah'],
    ['HWH', 'HLMT', 'Howrah -> Hindmotor'],
    ['KWAE', 'BDC', 'Katwa -> Bandel'],
    ['BDC', 'KWAE', 'Bandel -> Katwa'],
    ['SDAH', 'RHA', 'Sealdah -> Ranaghat']
  ];

  for (const [fromCode, toCode, label] of pairs) {
    const fromSt = await prisma.station.findUnique({ where: { code: fromCode } });
    const toSt = await prisma.station.findUnique({ where: { code: toCode } });

    if (!fromSt || !toSt) {
      console.log(`❌ Station not found: ${fromCode} or ${toCode}`);
      continue;
    }

    const fromStops = await prisma.scheduleStop.findMany({
      where: { stationId: fromSt.id },
      include: { train: true }
    });

    let count = 0;
    const sampleTrains = [];
    for (const f of fromStops) {
      const t = await prisma.scheduleStop.findFirst({
        where: {
          trainId: f.trainId,
          stationId: toSt.id,
          sequenceNo: { gt: f.sequenceNo }
        }
      });
      if (t) {
        count++;
        if (sampleTrains.length < 2) {
          sampleTrains.push(`${f.train.name} (${f.departureTime} -> ${t.arrivalTime})`);
        }
      }
    }
    console.log(`✅ [${label}] Direct Trains Found: ${count}`);
    sampleTrains.forEach(s => console.log(`    Sample: ${s}`));
  }
}

testRoutes().finally(() => prisma.$disconnect());
