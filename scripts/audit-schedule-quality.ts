import { prisma } from '../src/lib/prisma';

function toMinutes(timeStr: string | null): number | null {
  if (!timeStr) return null;
  const parts = timeStr.split(':').map(Number);
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
  return parts[0] * 60 + parts[1];
}

async function audit() {
  const trains = await prisma.train.findMany({
    include: {
      scheduleStops: {
        include: { station: true },
        orderBy: { sequenceNo: 'asc' }
      }
    }
  });

  let outOfOrderCount = 0;
  let duplicateStationCount = 0;
  let singleOrZeroStopCount = 0;
  const brokenTrains: { num: string; name: string; issue: string }[] = [];

  for (const t of trains) {
    if (t.scheduleStops.length < 2) {
      singleOrZeroStopCount++;
      brokenTrains.push({ num: t.number, name: t.name, issue: 'Fewer than 2 stops' });
      continue;
    }

    const seenStations = new Set<string>();
    let hasDup = false;
    for (const s of t.scheduleStops) {
      if (seenStations.has(s.station.code)) {
        hasDup = true;
        break;
      }
      seenStations.add(s.station.code);
    }
    if (hasDup) {
      duplicateStationCount++;
      brokenTrains.push({ num: t.number, name: t.name, issue: 'Duplicate stations in stop list' });
    }

    // Check time progression
    let prevMins = -1;
    let hasTimeAnomaly = false;
    for (let i = 0; i < t.scheduleStops.length; i++) {
      const s = t.scheduleStops[i];
      const timeVal = s.departureTime || s.arrivalTime;
      const mins = toMinutes(timeVal);
      if (mins !== null) {
        // if prevMins is greater than mins, check if it crossed midnight (e.g. 23:50 -> 00:15)
        if (prevMins !== -1 && mins < prevMins) {
          // If difference is large and not near midnight, it's definitely out of order
          if (!(prevMins > 22 * 60 && mins < 3 * 60)) {
            hasTimeAnomaly = true;
            break;
          }
        }
        prevMins = mins;
      }
    }
    if (hasTimeAnomaly) {
      outOfOrderCount++;
      brokenTrains.push({ num: t.number, name: t.name, issue: 'Timestamps decrease / out of order' });
    }
  }

  console.log(`\nAudit Results for ${trains.length} trains:`);
  console.log(`- Trains with duplicate stations in stop list: ${duplicateStationCount}`);
  console.log(`- Trains with backwards / decreasing timestamps: ${outOfOrderCount}`);
  console.log(`- Trains with < 2 stops: ${singleOrZeroStopCount}`);
  console.log(`\nSample broken trains (first 15):`);
  console.log(brokenTrains.slice(0, 15));
}

audit().catch(console.error).finally(() => prisma.$disconnect());

