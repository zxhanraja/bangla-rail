import { prisma } from '../src/lib/prisma';

async function main() {
  const trainCount = await prisma.train.count();
  const stationCount = await prisma.station.count();
  const stopCount = await prisma.scheduleStop.count();

  console.log(`Trains: ${trainCount}, Stations: ${stationCount}, Stops: ${stopCount}`);

  // Check some key station pairs
  const testPairs = [
    ['MUU', 'HWH', 'Mankundu to Howrah'],
    ['HWH', 'MUU', 'Howrah to Mankundu'],
    ['HWH', 'BDC', 'Howrah to Bandel'],
    ['HWH', 'BWN', 'Howrah to Barddhaman'],
    ['SDAH', 'RHA', 'Sealdah to Ranaghat'],
    ['SDAH', 'BNJ', 'Sealdah to Bangaon'],
    ['SDAH', 'CG', 'Sealdah to Canning'],
    ['SDAH', 'DH', 'Sealdah to Diamond Harbour'],
    ['SDAH', 'BGB', 'Sealdah to Budge Budge'],
    ['HWH', 'TAK', 'Howrah to Tarakeswar'],
    ['HWH', 'KGP', 'Howrah to Kharagpur'],
    ['HWH', 'MDN', 'Howrah to Midnapore'],
    ['BDC', 'KWAE', 'Bandel to Katwa'],
    ['M-DKS', 'M-KVS', 'Metro Line 1'],
    ['M-HMD', 'M-SCV', 'Metro Line 2'],
  ];

  for (const [fromCode, toCode, label] of testPairs) {
    const fromSt = await prisma.station.findUnique({ where: { code: fromCode } });
    const toSt = await prisma.station.findUnique({ where: { code: toCode } });
    if (!fromSt || !toSt) {
      console.log(`❌ ${label} (${fromCode} -> ${toCode}): Station missing (from=${!!fromSt}, to=${!!toSt})`);
      continue;
    }
    const fromStops = await prisma.scheduleStop.findMany({
      where: { stationId: fromSt.id },
      select: { trainId: true, sequenceNo: true }
    });
    const fromMap = new Map(fromStops.map(s => [s.trainId, s.sequenceNo]));
    const toStops = await prisma.scheduleStop.findMany({
      where: { stationId: toSt.id, trainId: { in: Array.from(fromMap.keys()) } },
      select: { trainId: true, sequenceNo: true }
    });
    const directCount = toStops.filter(ts => ts.sequenceNo > (fromMap.get(ts.trainId) ?? Infinity)).length;
    console.log(`${directCount > 0 ? '✅' : '⚠️'} ${label} (${fromCode} -> ${toCode}): ${directCount} direct trains`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
