import { prisma } from '../src/lib/prisma';

async function main() {
  const inactive = await prisma.station.findMany({
    where: {
      scheduleStops: { none: {} },
      division: { in: ['Howrah', 'Sealdah', 'Kharagpur'] }
    },
    select: { code: true, name: true, division: true },
    orderBy: [{ division: 'asc' }, { name: 'asc' }]
  });
  
  console.log(`Total inactive suburban stations: ${inactive.length}`);
  console.log('\nInactive stations:');
  for (const s of inactive) {
    console.log(`  ${s.code} - ${s.name} (${s.division})`);
  }
  
  await prisma.$disconnect();
}

main().catch(console.error);
