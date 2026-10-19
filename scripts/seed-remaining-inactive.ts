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

const REMAINING_CORRIDORS: CorridorDef[] = [
  // ─── SEALDAH SOUTH CIRCULAR - via Dum Dum, Garia, Subhasgram ───
  {
    name: 'Sealdah - Budge Budge South Circular Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'BBD',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKE', 'DKJN'], offset: 9 },
      { codes: ['GIA'], offset: 18 },
      { codes: ['SJRM'], offset: 22 },
      { codes: ['BBD'], offset: 55 },
    ],
    upTrains: [
      { num: '32701', name: 'Sealdah - Budge Budge First EMU', time: '04:30' },
      { num: '32703', name: 'Sealdah - Budge Budge Morning EMU', time: '05:50' },
      { num: '32705', name: 'Sealdah - Budge Budge Office Rush EMU', time: '07:05' },
      { num: '32707', name: 'Sealdah - Budge Budge Peak EMU', time: '08:20' },
      { num: '32709', name: 'Sealdah - Budge Budge Mid-Morning EMU', time: '10:10' },
      { num: '32711', name: 'Sealdah - Budge Budge Afternoon EMU', time: '13:00' },
      { num: '32713', name: 'Sealdah - Budge Budge Evening EMU', time: '16:00' },
      { num: '32715', name: 'Sealdah - Budge Budge Night EMU', time: '19:10' },
    ],
    downTrains: [
      { num: '32702', name: 'Budge Budge - Sealdah First EMU', time: '04:00' },
      { num: '32704', name: 'Budge Budge - Sealdah Morning EMU', time: '05:20' },
      { num: '32706', name: 'Budge Budge - Sealdah Office Rush EMU', time: '06:35' },
      { num: '32708', name: 'Budge Budge - Sealdah Peak EMU', time: '07:50' },
      { num: '32710', name: 'Budge Budge - Sealdah Mid-Morning EMU', time: '09:40' },
      { num: '32712', name: 'Budge Budge - Sealdah Afternoon EMU', time: '12:30' },
      { num: '32714', name: 'Budge Budge - Sealdah Evening EMU', time: '15:30' },
      { num: '32716', name: 'Budge Budge - Sealdah Night EMU', time: '18:40' },
    ],
  },

  // ─── SEALDAH SOUTH - via Bhabta (Kalyani Line) ───
  {
    name: 'Sealdah - Kalyani via Bhabta Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'KLY',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKE', 'DKJN'], offset: 9 },
      { codes: ['BFT2'], offset: 35 },
      { codes: ['KLY'], offset: 50 },
    ],
    upTrains: [
      { num: '31701', name: 'Sealdah - Kalyani via Bhabta First EMU', time: '04:50' },
      { num: '31703', name: 'Sealdah - Kalyani via Bhabta Morning EMU', time: '06:10' },
      { num: '31705', name: 'Sealdah - Kalyani via Bhabta Office Rush EMU', time: '07:30' },
      { num: '31707', name: 'Sealdah - Kalyani via Bhabta Peak EMU', time: '08:45' },
      { num: '31709', name: 'Sealdah - Kalyani via Bhabta Mid-Morning EMU', time: '10:30' },
      { num: '31711', name: 'Sealdah - Kalyani via Bhabta Afternoon EMU', time: '13:30' },
      { num: '31713', name: 'Sealdah - Kalyani via Bhabta Evening EMU', time: '16:30' },
      { num: '31715', name: 'Sealdah - Kalyani via Bhabta Night EMU', time: '20:00' },
    ],
    downTrains: [
      { num: '31702', name: 'Kalyani - Sealdah via Bhabta First EMU', time: '04:20' },
      { num: '31704', name: 'Kalyani - Sealdah via Bhabta Morning EMU', time: '05:40' },
      { num: '31706', name: 'Kalyani - Sealdah via Bhabta Office Rush EMU', time: '07:00' },
      { num: '31708', name: 'Kalyani - Sealdah via Bhabta Peak EMU', time: '08:15' },
      { num: '31710', name: 'Kalyani - Sealdah via Bhabta Mid-Morning EMU', time: '10:00' },
      { num: '31712', name: 'Kalyani - Sealdah via Bhabta Afternoon EMU', time: '13:00' },
      { num: '31714', name: 'Kalyani - Sealdah via Bhabta Evening EMU', time: '16:00' },
      { num: '31716', name: 'Kalyani - Sealdah via Bhabta Night EMU', time: '19:30' },
    ],
  },

  // ─── HOWRAH - TARAKESWAR (via Panchla, Sahebtala, Taklak Halt) ───
  {
    name: 'Howrah - Tarakeswar Branch Line Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'TAK',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['SHBL'], offset: 20 },
      { codes: ['PNJE'], offset: 25 },
      { codes: ['TKPH'], offset: 35 },
      { codes: ['TAK'], offset: 65 },
    ],
    upTrains: [
      { num: '37601', name: 'Howrah - Tarakeswar First EMU', time: '04:30' },
      { num: '37603', name: 'Howrah - Tarakeswar Morning EMU', time: '05:45' },
      { num: '37605', name: 'Howrah - Tarakeswar Office Rush EMU', time: '07:00' },
      { num: '37607', name: 'Howrah - Tarakeswar Peak EMU', time: '08:15' },
      { num: '37609', name: 'Howrah - Tarakeswar Mid-Morning EMU', time: '10:00' },
      { num: '37611', name: 'Howrah - Tarakeswar Afternoon EMU', time: '12:30' },
      { num: '37613', name: 'Howrah - Tarakeswar Evening Commuter', time: '15:45' },
      { num: '37615', name: 'Howrah - Tarakeswar Evening EMU', time: '17:15' },
      { num: '37617', name: 'Howrah - Tarakeswar Night EMU', time: '19:40' },
      { num: '37619', name: 'Howrah - Tarakeswar Late Night EMU', time: '21:55' },
    ],
    downTrains: [
      { num: '37602', name: 'Tarakeswar - Howrah First EMU', time: '04:00' },
      { num: '37604', name: 'Tarakeswar - Howrah Morning EMU', time: '05:15' },
      { num: '37606', name: 'Tarakeswar - Howrah Office Rush EMU', time: '06:30' },
      { num: '37608', name: 'Tarakeswar - Howrah Peak EMU', time: '07:45' },
      { num: '37610', name: 'Tarakeswar - Howrah Mid-Morning EMU', time: '09:30' },
      { num: '37612', name: 'Tarakeswar - Howrah Afternoon EMU', time: '12:00' },
      { num: '37614', name: 'Tarakeswar - Howrah Evening Commuter', time: '15:15' },
      { num: '37616', name: 'Tarakeswar - Howrah Evening EMU', time: '16:45' },
      { num: '37618', name: 'Tarakeswar - Howrah Night EMU', time: '19:10' },
      { num: '37620', name: 'Tarakeswar - Howrah Late Night EMU', time: '21:25' },
    ],
  },

  // ─── HOWRAH - KATWA (via Chinpai, Dubrajpur) ───
  {
    name: 'Howrah - Katwa Branch Line Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'KTW',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['LLH', 'LLAH'], offset: 7 },
      { codes: ['BEQ', 'BELR'], offset: 10 },
      { codes: ['BLY', 'BALY'], offset: 13 },
      { codes: ['UPA', 'UTAE'], offset: 16 },
      { codes: ['SHE'], offset: 30 },
      { codes: ['BHR'], offset: 38 },
      { codes: ['CPLE'], offset: 60 },
      { codes: ['DUJ'], offset: 75 },
      { codes: ['KTW'], offset: 110 },
    ],
    upTrains: [
      { num: '37801', name: 'Howrah - Katwa First EMU', time: '04:45' },
      { num: '37803', name: 'Howrah - Katwa Morning EMU', time: '06:00' },
      { num: '37805', name: 'Howrah - Katwa Office Rush EMU', time: '07:15' },
      { num: '37807', name: 'Howrah - Katwa Peak EMU', time: '09:00' },
      { num: '37809', name: 'Howrah - Katwa Afternoon EMU', time: '13:00' },
      { num: '37811', name: 'Howrah - Katwa Evening EMU', time: '16:30' },
      { num: '37813', name: 'Howrah - Katwa Night EMU', time: '19:45' },
    ],
    downTrains: [
      { num: '37802', name: 'Katwa - Howrah First EMU', time: '04:00' },
      { num: '37804', name: 'Katwa - Howrah Morning EMU', time: '05:15' },
      { num: '37806', name: 'Katwa - Howrah Office Rush EMU', time: '06:30' },
      { num: '37808', name: 'Katwa - Howrah Peak EMU', time: '08:30' },
      { num: '37810', name: 'Katwa - Howrah Afternoon EMU', time: '12:30' },
      { num: '37812', name: 'Katwa - Howrah Evening EMU', time: '16:00' },
      { num: '37814', name: 'Katwa - Howrah Night EMU', time: '19:15' },
    ],
  },

  // ─── KHARAGPUR - JHARGRAM (via Bogri Road, Godapiasal, etc.) ───
  {
    name: 'Kharagpur - Jhargram Local',
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
      { num: '38701', name: 'Kharagpur - Jhargram First EMU', time: '05:00' },
      { num: '38703', name: 'Kharagpur - Jhargram Morning EMU', time: '07:00' },
      { num: '38705', name: 'Kharagpur - Jhargram Afternoon EMU', time: '13:00' },
      { num: '38707', name: 'Kharagpur - Jhargram Evening EMU', time: '17:00' },
      { num: '38709', name: 'Kharagpur - Jhargram Night EMU', time: '20:00' },
    ],
    downTrains: [
      { num: '38702', name: 'Jhargram - Kharagpur First EMU', time: '04:30' },
      { num: '38704', name: 'Jhargram - Kharagpur Morning EMU', time: '06:30' },
      { num: '38706', name: 'Jhargram - Kharagpur Afternoon EMU', time: '12:30' },
      { num: '38708', name: 'Jhargram - Kharagpur Evening EMU', time: '16:30' },
      { num: '38710', name: 'Jhargram - Kharagpur Night EMU', time: '19:30' },
    ],
  },

  // ─── KHARAGPUR - MIDNAPORE (via Tikra, Sujalam Pur, Peardoba) ───
  {
    name: 'Kharagpur - Midnapore Local',
    type: 'EMU Local',
    originCode: 'KGP',
    destCode: 'MDP',
    stops: [
      { codes: ['KGP'], offset: 0 },
      { codes: ['TKRA'], offset: 12 },
      { codes: ['SJPA'], offset: 20 },
      { codes: ['PBA'], offset: 30 },
      { codes: ['MDP'], offset: 45 },
    ],
    upTrains: [
      { num: '38901', name: 'Kharagpur - Midnapore First EMU', time: '05:10' },
      { num: '38903', name: 'Kharagpur - Midnapore Morning EMU', time: '07:30' },
      { num: '38905', name: 'Kharagpur - Midnapore Afternoon EMU', time: '13:00' },
      { num: '38907', name: 'Kharagpur - Midnapore Evening EMU', time: '17:30' },
      { num: '38909', name: 'Kharagpur - Midnapore Night EMU', time: '20:00' },
    ],
    downTrains: [
      { num: '38902', name: 'Midnapore - Kharagpur First EMU', time: '04:45' },
      { num: '38904', name: 'Midnapore - Kharagpur Morning EMU', time: '07:00' },
      { num: '38906', name: 'Midnapore - Kharagpur Afternoon EMU', time: '12:30' },
      { num: '38908', name: 'Midnapore - Kharagpur Evening EMU', time: '17:00' },
      { num: '38910', name: 'Midnapore - Kharagpur Night EMU', time: '19:30' },
    ],
  },

  // ─── HOWRAH - SURI (Birbhum branch) ───
  {
    name: 'Howrah - Suri Birbhum Local',
    type: 'Passenger',
    originCode: 'HWH',
    destCode: 'SURI',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['BWN'], offset: 95 },
      { codes: ['SURI'], offset: 200 },
    ],
    upTrains: [
      { num: '53049', name: 'Howrah - Suri Birbhum Passenger', time: '06:00' },
      { num: '53051', name: 'Howrah - Suri Birbhum Afternoon Passenger', time: '14:00' },
    ],
    downTrains: [
      { num: '53050', name: 'Suri - Howrah Birbhum Passenger', time: '04:30' },
      { num: '53052', name: 'Suri - Howrah Birbhum Evening Passenger', time: '14:00' },
    ],
  },
];

async function run() {
  console.log('🚀 Seeding remaining inactive stations...\n');

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

  for (const corridor of REMAINING_CORRIDORS) {
    console.log(`\n📍 Processing: ${corridor.name}`);

    const resolvedStops = corridor.stops.map(s => ({
      station: resolveStation(s.codes),
      offset: s.offset,
      codes: s.codes,
    }));

    const unresolved = resolvedStops.filter(s => !s.station);
    if (unresolved.length > 0) {
      console.log(`  ⚠️  Unresolved stations: ${unresolved.map(s => s.codes.join('/')).join(', ')}`);
    }

    const validStops = resolvedStops.filter(s => s.station !== null);

    const processTrains = async (trains: { num: string; name: string; time: string }[], isUp: boolean) => {
      for (const train of trains) {
        const existing = await prisma.train.findUnique({ where: { number: train.num } });
        if (existing) {
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
      }
    };

    await processTrains(corridor.upTrains, true);
    await processTrains(corridor.downTrains, false);
  }

  console.log(`\n✅ Done!`);
  console.log(`   Trains created: ${trainsCreated}`);
  console.log(`   Stops created: ${stopsCreated}`);
  console.log(`   Skipped: ${skipped}`);

  // Final remaining inactive
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
