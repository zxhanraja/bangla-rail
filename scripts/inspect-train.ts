import { prisma } from '../src/lib/prisma';

async function main() {
  const trainNum = process.argv[2] || '34511';
  const t = await prisma.train.findUnique({
    where: { number: trainNum },
    include: {
      scheduleStops: {
        include: { station: true },
        orderBy: { sequenceNo: 'asc' }
      }
    }
  });

  if (!t) {
    console.log(`Train ${trainNum} not found`);
    return;
  }

  console.log(`Train: ${t.number} - ${t.name} (${t.originStationCode} -> ${t.destinationStationCode})`);
  console.log('Stops:');
  for (const s of t.scheduleStops) {
    console.log(`  ${s.sequenceNo}. [${s.station.code}] ${s.station.name} | Arr: ${s.arrivalTime || '--:--'} | Dep: ${s.departureTime || '--:--'}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

