import { prisma } from '../src/lib/prisma';

async function main() {
  // Check if Kharagpur-Jhargram trains were created
  const trains = await prisma.train.findMany({ 
    where: { number: { in: ['38701', '38702', '38703', '38704', '38705'] } },
    include: { 
      scheduleStops: { 
        include: { station: { select: { code: true, name: true } } },
        orderBy: { sequenceNo: 'asc' }
      } 
    }
  });
  
  for (const t of trains) {
    console.log(`${t.number} ${t.name} - stops: ${t.scheduleStops.length}`);
    for (const s of t.scheduleStops) {
      console.log(`  ${s.station.code} - ${s.station.name}`);
    }
  }
  
  if (trains.length === 0) {
    console.log('No Jhargram trains found! They were skipped.');
    // Find why - check for duplicate numbers
    const all38700 = await prisma.train.findMany({
      where: { number: { startsWith: '387' } },
      select: { number: true, name: true }
    });
    console.log('All 387xx trains:', JSON.stringify(all38700));
  }

  await prisma.$disconnect();
}

main().catch(console.error);
