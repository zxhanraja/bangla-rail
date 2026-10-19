import { prisma } from '../src/lib/prisma';

async function main() {
  // Check Jhargram, Midnapore stations  
  const jhargram = await prisma.station.findMany({ where: { name: { contains: 'Jhargram' } }, select: { code: true, name: true } });
  console.log('Jhargram:', JSON.stringify(jhargram));

  const midnapore = await prisma.station.findMany({ where: { name: { contains: 'Midnapore' } }, select: { code: true, name: true } });
  console.log('Midnapore:', JSON.stringify(midnapore));

  const codes = ['KTW', 'BBD', 'KLY', 'JGM', 'MDP', 'KTWA', 'BDDG', 'KLYNS'];
  for (const c of codes) {
    const r = await prisma.station.findUnique({ where: { code: c }, select: { code: true, name: true } });
    console.log(`${c} -> ${r ? r.name : 'NOT FOUND'}`);
  }

  // Check all Howrah + Sealdah + Kharagpur stations that have names matching these remaining ones
  const search = ['Godapiasal', 'Bogri', 'Gidhni', 'Lavan', 'Henria', 'Nachinda', 'Sitalpur', 'Badalpur', 'Basuldanga'];
  for (const name of search) {
    const found = await prisma.station.findMany({ 
      where: { name: { contains: name } },
      include: { scheduleStops: { take: 1 } }
    });
    for (const s of found) {
      console.log(`${name}: ${s.code} - ${s.name} - stops: ${s.scheduleStops.length}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(console.error);
