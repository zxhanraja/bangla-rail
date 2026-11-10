import { prisma } from '../src/lib/prisma';

async function summarize() {
  const trains = await prisma.train.findMany({
    select: {
      number: true,
      name: true,
      originStationCode: true,
      destinationStationCode: true,
      type: true,
      _count: { select: { scheduleStops: true } }
    }
  });

  console.log(`Total trains in DB: ${trains.length}`);

  // Group by number prefix
  const prefixes: Record<string, number> = {};
  for (const t of trains) {
    const p = t.number.length >= 2 ? t.number.slice(0, 2) : 'other';
    prefixes[p] = (prefixes[p] || 0) + 1;
  }
  console.log('Trains by prefix:', prefixes);

  // Group by type
  const types: Record<string, number> = {};
  for (const t of trains) {
    types[t.type] = (types[t.type] || 0) + 1;
  }
  console.log('Trains by type:', types);
}

summarize().catch(console.error).finally(() => prisma.$disconnect());

