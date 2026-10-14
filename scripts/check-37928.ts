import { prisma } from '../src/lib/prisma';

async function test() {
  const trains = await prisma.train.findMany({
    where: { number: { startsWith: '379' } },
    select: { number: true, name: true, originStationCode: true, destinationStationCode: true }
  });
  console.log(`Found ${trains.length} trains starting with 379:`);
  trains.forEach(t => console.log(`${t.number} | ${t.name}`));
}

test().finally(() => prisma.$disconnect());
