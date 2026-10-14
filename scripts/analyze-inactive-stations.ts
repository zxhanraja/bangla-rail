import { prisma } from '../src/lib/prisma';

async function main() {
  const inactive = await prisma.station.findMany({
    where: { scheduleStops: { none: {} } },
    select: { code: true, name: true, division: true, district: true },
  });

  console.log(`Found ${inactive.length} inactive stations.`);
  const byDiv: Record<string, number> = {};
  for (const s of inactive) {
    const div = s.division || 'Unknown';
    byDiv[div] = (byDiv[div] || 0) + 1;
  }
  console.log('Inactive by division:', byDiv);

  console.log('Sample inactive stations:');
  console.log(inactive.slice(0, 30).map(s => `${s.code} - ${s.name} (${s.division})`).join('\n'));
}

main().finally(() => prisma.$disconnect());
