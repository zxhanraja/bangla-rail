import { prisma } from '../src/lib/prisma';
import { MEGA_WB_TRAINS } from './mega-wb-trains';
import { MEGA_WB_STATIONS } from './mega-wb-stations';

async function main() {
  console.log(`MEGA_WB_TRAINS definitions: ${MEGA_WB_TRAINS.length}`);
  console.log(`MEGA_WB_STATIONS definitions: ${MEGA_WB_STATIONS.length}`);

  const dbTrains = await prisma.train.count();
  const dbStations = await prisma.station.count();
  const dbStops = await prisma.scheduleStop.count();

  console.log(`DB Counts -> Trains: ${dbTrains}, Stations: ${dbStations}, Stops: ${dbStops}`);

  // Check how many of MEGA_WB_TRAINS are in DB
  const sampleNums = MEGA_WB_TRAINS.slice(0, 10).map(t => t.num);
  const foundInDb = await prisma.train.findMany({
    where: { number: { in: sampleNums } },
    select: { number: true }
  });
  console.log(`Sample 10 mega trains found in DB: ${foundInDb.length}/10`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
