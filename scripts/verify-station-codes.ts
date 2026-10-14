import { prisma } from '../src/lib/prisma';

const candidateCodes = [
  // Bangaon line
  'SDAH', 'BNXR', 'DDJ', 'DGNR', 'BBDB', 'NBE', 'MMG', 'HHR', 'BT', 'BMG', 'DTK', 'BIRA', 'GUMA', 'ASKR', 'HB', 'SNHT', 'MSL', 'GBG', 'TKNR', 'CDP', 'BNJ',
  // Tarakeswar line
  'HWH', 'LLAH', 'BELR', 'BALY', 'UTAE', 'HMZ', 'KOG', 'RSAE', 'SRAE', 'SHE', 'DEA', 'NSF', 'SIU', 'KMLE', 'BLAE', 'MDSE', 'CDAE', 'PBZ', 'BAHW', 'LOK', 'TAK', 'TLPH', 'AMBG', 'GOGT',
  // Belur Math
  'BRMH',
  // Kalyani Simanta
  'KPA', 'KYI', 'KLMJ',
  // Shantipur
  'KLNP', 'FNAE', 'STB',
  // Lalgola
  'KNJ', 'DHU', 'MGMG', 'BTY', 'DEB', 'PLY', 'SRJN', 'REJ', 'BEB', 'SGV', 'CSZ', 'BPC', 'MBB', 'JJG', 'BQG', 'LGL',
  // Chord line halts
  'DKAE', 'GBRA', 'JOX', 'MBP', 'BMAE', 'SHBC', 'HIH', 'JPQ', 'JRAE', 'NBAE', 'MSAE', 'BWN'
];

async function main() {
  const existing = await prisma.station.findMany({
    where: { code: { in: candidateCodes } },
    select: { code: true, name: true },
  });
  const existingMap = new Map(existing.map(s => [s.code, s.name]));
  const missing = candidateCodes.filter(c => !existingMap.has(c));
  console.log(`Found ${existing.length} of ${candidateCodes.length} stations.`);
  if (missing.length > 0) {
    console.log('Missing codes:', missing);
  }
}

main().finally(() => prisma.$disconnect());
