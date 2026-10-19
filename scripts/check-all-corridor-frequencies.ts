import { prisma } from '../src/lib/prisma';

async function checkCorridors() {
  const routes = [
    { from: 'HWH', to: 'BDC', desc: 'Howrah - Bandel Main' },
    { from: 'HWH', to: 'SHE', desc: 'Howrah - Seoraphuli' },
    { from: 'HWH', to: 'BWN', desc: 'Howrah - Burdwan' },
    { from: 'HWH', to: 'TAK', desc: 'Howrah - Tarakeswar' },
    { from: 'HWH', to: 'CDAE', desc: 'Howrah - Chandanpur' },
    { from: 'HWH', to: 'GRAE', desc: 'Howrah - Gurap' },
    { from: 'HWH', to: 'DKAE', desc: 'Howrah - Dankuni' },
    { from: 'BDC', to: 'KWAE', desc: 'Bandel - Katwa' },
    { from: 'BDC', to: 'NH', desc: 'Bandel - Naihati' },
    { from: 'SDAH', to: 'BP', desc: 'Sealdah - Barrackpore' },
    { from: 'SDAH', to: 'NH', desc: 'Sealdah - Naihati' },
    { from: 'SDAH', to: 'KLYM', desc: 'Sealdah - Kalyani Simanta' },
    { from: 'SDAH', to: 'RHA', desc: 'Sealdah - Ranaghat' },
    { from: 'SDAH', to: 'KNJ', desc: 'Sealdah - Krishnanagar' },
    { from: 'SDAH', to: 'STB', desc: 'Sealdah - Shantipur' },
    { from: 'SDAH', to: 'GEDE', desc: 'Sealdah - Gede' },
    { from: 'RHA', to: 'BNJ', desc: 'Ranaghat - Bangaon' },
    { from: 'SDAH', to: 'BT', desc: 'Sealdah - Barasat' },
    { from: 'SDAH', to: 'DTK', desc: 'Sealdah - Dattapukur' },
    { from: 'SDAH', to: 'HB', desc: 'Sealdah - Habra' },
    { from: 'SDAH', to: 'BNJ', desc: 'Sealdah - Bangaon' },
    { from: 'SDAH', to: 'HNB', desc: 'Sealdah - Hasnabad' },
    { from: 'SDAH', to: 'BGB', desc: 'Sealdah - Budge Budge' },
    { from: 'SDAH', to: 'SPR', desc: 'Sealdah - Sonarpur' },
    { from: 'SDAH', to: 'BRP', desc: 'Sealdah - Baruipur' },
    { from: 'SDAH', to: 'DH', desc: 'Sealdah - Diamond Harbour' },
    { from: 'SDAH', to: 'CG', desc: 'Sealdah - Canning' },
    { from: 'SDAH', to: 'LKPR', desc: 'Sealdah - Lakshmikantapur' },
    { from: 'SDAH', to: 'KWDP', desc: 'Sealdah - Kakdwip' },
    { from: 'SDAH', to: 'NMKA', desc: 'Sealdah - Namkhana' },
    { from: 'HWH', to: 'ULB', desc: 'Howrah - Uluberia' },
    { from: 'HWH', to: 'BZN', desc: 'Howrah - Bagnan' },
    { from: 'HWH', to: 'MCA', desc: 'Howrah - Mecheda' },
    { from: 'HWH', to: 'PKU', desc: 'Howrah - Panskura' },
    { from: 'HWH', to: 'KGP', desc: 'Howrah - Kharagpur' },
    { from: 'HWH', to: 'MDN', desc: 'Howrah - Midnapore' },
    { from: 'HWH', to: 'AMSN', desc: 'Howrah - Amta' },
    { from: 'PKU', to: 'HLZ', desc: 'Panskura - Haldia' },
    { from: 'HWH', to: 'HLZ', desc: 'Howrah - Haldia' },
  ];

  console.log('Checking direct trains between key corridor endpoints:');
  for (const r of routes) {
    const fSt = await prisma.station.findUnique({ where: { code: r.from } });
    const tSt = await prisma.station.findUnique({ where: { code: r.to } });
    if (!fSt || !tSt) {
      console.log(`  ❌ ${r.desc} (${r.from} -> ${r.to}): Station not found!`);
      continue;
    }

    const fromStops = await prisma.scheduleStop.findMany({
      where: { stationId: fSt.id },
      select: { trainId: true, sequenceNo: true }
    });
    const fromMap = new Map(fromStops.map(s => [s.trainId, s.sequenceNo]));
    const toStops = await prisma.scheduleStop.findMany({
      where: { stationId: tSt.id, trainId: { in: Array.from(fromMap.keys()) } },
      select: { trainId: true, sequenceNo: true }
    });
    const count = toStops.filter(ts => ts.sequenceNo > (fromMap.get(ts.trainId) ?? Infinity)).length;
    console.log(`  ${count > 15 ? '🟢' : count > 0 ? '🟡' : '🔴'} ${r.desc} (${r.from} -> ${r.to}): ${count} trains`);
  }
}

checkCorridors().finally(() => prisma.$disconnect());
