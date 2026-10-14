import { prisma } from '../src/lib/prisma';

async function main() {
  const trains = await prisma.train.count();
  const stations = await prisma.station.count();
  const stops = await prisma.scheduleStop.count();
  console.log({ trains, stations, stops });
  await prisma.$disconnect();
}

main();
