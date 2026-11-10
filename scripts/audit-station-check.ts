import { prisma } from '../src/lib/prisma';

async function check() {
  const codes = [
    'HWH', 'SDAH', 'BDC', 'BWN', 'KGP', 'MDN', 'TAK', 'AMBG', 
    'BRP', 'CG', 'DH', 'BGB', 'BNJ', 'HNB', 'RHA', 'KNJ', 
    'STB', 'GEDE', 'DKAE', 'KWAE', 'NH', 'BP', 'KPA', 'HLR', 'KYI', 'KLYS'
  ];
  for (const c of codes) {
    const st = await prisma.station.findUnique({
      where: { code: c },
      select: { code: true, name: true }
    });
    console.log(c, st ? 'FOUND: ' + st.name : 'MISSING');
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());

