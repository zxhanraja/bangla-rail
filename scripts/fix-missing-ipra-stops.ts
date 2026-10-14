import { prisma } from '../src/lib/prisma';

function addMins(t: string, m: number): string {
  const [h, min] = t.split(':').map(Number);
  const total = (h * 60 + min + m + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

async function main() {
  const ipraStation = await prisma.station.findUnique({ where: { code: 'IPRA' } });
  if (!ipraStation) { console.error('❌ IPRA station not found!'); return; }
  console.log('✅ IPRA station found:', ipraStation.name, '| id:', ipraStation.id);

  // Get all trains stopping at Bansberia (BSAE)
  const bsaeStops = await prisma.scheduleStop.findMany({
    where: { station: { code: 'BSAE' } },
    include: { train: true }
  });
  console.log(`\nTotal trains at BSAE: ${bsaeStops.length}`);

  let fixed = 0;
  let skipped = 0;

  for (const bsaeStop of bsaeStops) {
    const trainId = bsaeStop.trainId;

    // Skip if IPRA already exists for this train
    const hasIPRA = await prisma.scheduleStop.findFirst({
      where: { trainId, stationId: ipraStation.id }
    });
    if (hasIPRA) { skipped++; continue; }

    // Skip if this train doesn't go through BDC (Bandel) — not a branch train
    const bdcStop = await prisma.scheduleStop.findFirst({
      where: { trainId, station: { code: 'BDC' } }
    });
    if (!bdcStop) { skipped++; continue; }

    // Determine direction:
    // Katwa→Howrah: BSAE seq < BDC seq → IPRA comes BEFORE BSAE (lower seq)
    // Howrah→Katwa: BSAE seq > BDC seq → IPRA comes AFTER BSAE (higher seq)
    const goingToHowrah = bsaeStop.sequenceNo < bdcStop.sequenceNo;

    let insertAtSeq: number;
    let refTime: string;

    if (goingToHowrah) {
      // Insert IPRA just before BSAE
      insertAtSeq = bsaeStop.sequenceNo; // will push BSAE and everything after up by 1
      refTime = bsaeStop.arrivalTime ?? bsaeStop.departureTime ?? '00:00';
    } else {
      // Insert IPRA just after BSAE
      insertAtSeq = bsaeStop.sequenceNo + 1; // push everything after BSAE up by 1
      refTime = bsaeStop.departureTime ?? bsaeStop.arrivalTime ?? '00:00';
    }

    // Shift all stops with sequenceNo >= insertAtSeq up by 1 to make room
    await prisma.scheduleStop.updateMany({
      where: { trainId, sequenceNo: { gte: insertAtSeq } },
      data: { sequenceNo: { increment: 1 } }
    });

    // Calculate IPRA times (3 min gap from BSAE)
    const arrTime = addMins(refTime, goingToHowrah ? -3 : 3);
    const depTime = addMins(refTime, goingToHowrah ? -2 : 4);

    await prisma.scheduleStop.create({
      data: {
        trainId,
        stationId: ipraStation.id,
        sequenceNo: insertAtSeq,
        dayOffset: bsaeStop.dayOffset,
        arrivalTime: arrTime,
        departureTime: depTime,
        haltMinutes: 1,
        source: 'fix-ipra-2026',
      }
    });

    console.log(
      `✅ ${bsaeStop.train.number} "${bsaeStop.train.name}" → inserted IPRA at seq ${insertAtSeq}`,
      `| arr: ${arrTime}, dep: ${depTime}`,
      `| direction: ${goingToHowrah ? 'Katwa→Howrah' : 'Howrah→Katwa'}`
    );
    fixed++;
  }

  console.log(`\n✅ Done! Added IPRA to ${fixed} trains. ${skipped} already had it or not branch trains.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
