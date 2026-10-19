import { prisma } from '../src/lib/prisma';

function addMinutes(startTime: string, minutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

interface CorridorDef {
  name: string;
  type: string;
  originCode: string;
  destCode: string;
  stops: { codes: string[]; offset: number }[];
  upTrains: { num: string; name: string; time: string }[];
  downTrains: { num: string; name: string; time: string }[];
}

const CORRIDORS: CorridorDef[] = [
  // ─── KHARAGPUR - JHARGRAM (via all stations) ───
  // Using 388xx numbers (unused)
  {
    name: 'Kharagpur - Jhargram Branch Local',
    type: 'EMU Local',
    originCode: 'KGP',
    destCode: 'JGM',
    stops: [
      { codes: ['KGP'], offset: 0 },
      { codes: ['STLB'], offset: 10 },
      { codes: ['NCN'], offset: 18 },
      { codes: ['BGO'], offset: 25 },
      { codes: ['LSGS'], offset: 32 },
      { codes: ['GSL'], offset: 40 },
      { codes: ['GII'], offset: 48 },
      { codes: ['BSDA'], offset: 56 },
      { codes: ['BDPA'], offset: 62 },
      { codes: ['HEN'], offset: 70 },
      { codes: ['JGM'], offset: 85 },
    ],
    upTrains: [
      { num: '38881', name: 'Kharagpur - Jhargram First EMU', time: '05:00' },
      { num: '38883', name: 'Kharagpur - Jhargram Morning EMU', time: '07:00' },
      { num: '38885', name: 'Kharagpur - Jhargram Afternoon EMU', time: '13:00' },
      { num: '38887', name: 'Kharagpur - Jhargram Evening EMU', time: '17:00' },
      { num: '38889', name: 'Kharagpur - Jhargram Night EMU', time: '20:00' },
    ],
    downTrains: [
      { num: '38882', name: 'Jhargram - Kharagpur First EMU', time: '04:30' },
      { num: '38884', name: 'Jhargram - Kharagpur Morning EMU', time: '06:30' },
      { num: '38886', name: 'Jhargram - Kharagpur Afternoon EMU', time: '12:30' },
      { num: '38888', name: 'Jhargram - Kharagpur Evening EMU', time: '16:30' },
      { num: '38890', name: 'Jhargram - Kharagpur Night EMU', time: '19:30' },
    ],
  },
];

async function run() {
  console.log('🚀 Seeding Jhargram branch with unique train numbers...\n');

  const allStations = await prisma.station.findMany({ select: { id: true, code: true, name: true } });
  const stationByCode = new Map<string, { id: string; code: string; name: string }>();
  for (const s of allStations) {
    stationByCode.set(s.code.toUpperCase(), s);
  }

  const resolveStation = (codes: string[]): { id: string; code: string } | null => {
    for (const c of codes) {
      const found = stationByCode.get(c.toUpperCase());
      if (found) return { id: found.id, code: found.code };
    }
    return null;
  };

  let trainsCreated = 0;
  let stopsCreated = 0;
  let skipped = 0;

  for (const corridor of CORRIDORS) {
    console.log(`\n📍 Processing: ${corridor.name}`);

    const resolvedStops = corridor.stops.map(s => ({
      station: resolveStation(s.codes),
      offset: s.offset,
      codes: s.codes,
    }));

    const unresolved = resolvedStops.filter(s => !s.station);
    if (unresolved.length > 0) {
      console.log(`  ⚠️  Unresolved: ${unresolved.map(s => s.codes.join('/')).join(', ')}`);
    }

    const validStops = resolvedStops.filter(s => s.station !== null);
    console.log(`  ✅ Valid stops: ${validStops.map(s => s.codes[0]).join(' → ')}`);

    const processTrains = async (trains: { num: string; name: string; time: string }[], isUp: boolean) => {
      for (const train of trains) {
        const existing = await prisma.train.findUnique({ where: { number: train.num } });
        if (existing) {
          console.log(`  ⏭️  Skip ${train.num} (exists)`);
          skipped++;
          continue;
        }

        await prisma.train.create({
          data: {
            number: train.num,
            name: train.name,
            type: corridor.type,
            originStationCode: isUp ? corridor.originCode : corridor.destCode,
            destinationStationCode: isUp ? corridor.destCode : corridor.originCode,
            scheduleStops: {
              create: validStops.map((s, idx) => ({
                stationId: s.station!.id,
                sequenceNo: isUp ? idx + 1 : validStops.length - idx,
                arrivalTime: addMinutes(train.time, isUp ? s.offset : (validStops[validStops.length - 1].offset - s.offset)),
                departureTime: addMinutes(train.time, isUp ? s.offset : (validStops[validStops.length - 1].offset - s.offset)),
              })),
            },
          },
        });

        trainsCreated++;
        stopsCreated += validStops.length;
        console.log(`  ✅ Created ${train.num} with ${validStops.length} stops`);
      }
    };

    await processTrains(corridor.upTrains, true);
    await processTrains(corridor.downTrains, false);
  }

  console.log(`\n✅ Done!`);
  console.log(`   Trains created: ${trainsCreated}`);
  console.log(`   Stops created: ${stopsCreated}`);

  // Final check
  const remaining = await prisma.station.findMany({
    where: { scheduleStops: { none: {} }, division: { in: ['Howrah', 'Sealdah', 'Kharagpur'] } },
    select: { code: true, name: true, division: true },
  });
  console.log(`\n📊 Still inactive: ${remaining.length}`);
  for (const s of remaining) {
    console.log(`  ${s.code} - ${s.name} (${s.division})`);
  }

  await prisma.$disconnect();
}

run().catch(console.error);
