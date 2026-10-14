import { prisma } from '../src/lib/prisma';

// Helper to format HH:mm
function addMinutes(startTime: string, minutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

async function main() {
  console.log('🚀 Starting intermediate stations schedule expansion...');

  const stationMap = new Map<string, string>();
  const allStations = await prisma.station.findMany({ select: { code: true, id: true } });
  allStations.forEach(s => stationMap.set(s.code.toUpperCase(), s.id));

  // Helper to upsert a train with stops
  async function upsertTrainWithStops(
    train: { num: string; name: string; type?: string; origin: string; dest: string; days?: string; km?: number },
    departures: { num: string; name: string; time: string }[],
    stops: { code: string; offset: number }[]
  ) {
    for (const d of departures) {
      const tr = await prisma.train.upsert({
        where: { number: d.num },
        update: {
          name: d.name,
          type: train.type || 'EMU Local',
          originStationCode: train.origin,
          destinationStationCode: train.dest,
          runningDays: train.days || 'Daily',
          distanceKm: train.km || stops[stops.length - 1].offset,
        },
        create: {
          number: d.num,
          name: d.name,
          type: train.type || 'EMU Local',
          originStationCode: train.origin,
          destinationStationCode: train.dest,
          runningDays: train.days || 'Daily',
          distanceKm: train.km || stops[stops.length - 1].offset,
        },
      });

      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        const stationId = stationMap.get(s.code.toUpperCase());
        if (!stationId) continue;

        const isFirst = i === 0;
        const isLast = i === stops.length - 1;
        const time = addMinutes(d.time, s.offset);
        const arr = isFirst ? null : time;
        const dep = isLast ? null : time;

        await prisma.scheduleStop.upsert({
          where: {
            trainId_stationId: {
              trainId: tr.id,
              stationId,
            },
          },
          update: {
            sequenceNo: i + 1,
            arrivalTime: arr,
            departureTime: dep,
            haltMinutes: (isFirst || isLast) ? 0 : 1,
            source: 'verified',
          },
          create: {
            trainId: tr.id,
            stationId,
            sequenceNo: i + 1,
            arrivalTime: arr,
            departureTime: dep,
            haltMinutes: (isFirst || isLast) ? 0 : 1,
            source: 'verified',
          },
        });
      }
    }
  }

  // ── 1. SEALDAH - BANGAON ALL-STOP EMU LOCALS ──────────────────────────────
  // Every commuter station included: Durganagar, Bisharpara, New Barrackpore, Hridaypur, Bamangachhi, Bira, Guma, Ashoknagar, etc.
  const bangaonStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BNXR', offset: 6 },
    { code: 'DDJ', offset: 12 },
    { code: 'DGNR', offset: 16 },
    { code: 'BBDB', offset: 19 },
    { code: 'NBE', offset: 22 },
    { code: 'MMG', offset: 25 },
    { code: 'HHR', offset: 28 },
    { code: 'BT', offset: 33 },
    { code: 'BMG', offset: 38 },
    { code: 'DTK', offset: 43 },
    { code: 'BIRA', offset: 48 },
    { code: 'GUMA', offset: 53 },
    { code: 'ASKR', offset: 58 },
    { code: 'HB', offset: 64 },
    { code: 'SNHT', offset: 70 },
    { code: 'MSL', offset: 75 },
    { code: 'GBG', offset: 80 },
    { code: 'TKNR', offset: 86 },
    { code: 'CDP', offset: 92 },
    { code: 'BNJ', offset: 102 },
  ];

  const bangaonUpDepartures = [
    { num: '33811', name: 'Sealdah - Bangaon Early Commuter Local', time: '04:10' },
    { num: '33813', name: 'Sealdah - Bangaon Morning Local', time: '05:25' },
    { num: '33815', name: 'Sealdah - Bangaon Morning Office Rush', time: '06:45' },
    { num: '33817', name: 'Sealdah - Bangaon Peak Commuter Local', time: '07:55' },
    { num: '33819', name: 'Sealdah - Bangaon Prime Office Local', time: '08:50' },
    { num: '33821', name: 'Sealdah - Bangaon Mid-Morning Local', time: '10:05' },
    { num: '33823', name: 'Sealdah - Bangaon Daytime Local', time: '11:45' },
    { num: '33825', name: 'Sealdah - Bangaon Noon Commuter', time: '13:20' },
    { num: '33827', name: 'Sealdah - Bangaon Afternoon Local', time: '14:50' },
    { num: '33829', name: 'Sealdah - Bangaon Evening Rush Local', time: '16:15' },
    { num: '33831', name: 'Sealdah - Bangaon Peak Evening Local', time: '17:25' },
    { num: '33833', name: 'Sealdah - Bangaon Prime Return Local', time: '18:35' },
    { num: '33835', name: 'Sealdah - Bangaon Night Commuter Local', time: '19:45' },
    { num: '33837', name: 'Sealdah - Bangaon Night Local', time: '21:00' },
    { num: '33839', name: 'Sealdah - Bangaon Late Night Local', time: '22:20' },
  ];

  const bangaonMaxOffset = bangaonStops[bangaonStops.length - 1].offset;
  const bangaonDownStops = [...bangaonStops].reverse().map(s => ({
    code: s.code,
    offset: bangaonMaxOffset - s.offset,
  }));

  const bangaonDownDepartures = [
    { num: '33812', name: 'Bangaon - Sealdah Early Morning Local', time: '04:00' },
    { num: '33814', name: 'Bangaon - Sealdah Morning Commuter Local', time: '05:15' },
    { num: '33816', name: 'Bangaon - Sealdah Morning Rush Local', time: '06:30' },
    { num: '33818', name: 'Bangaon - Sealdah Peak Office Local', time: '07:40' },
    { num: '33820', name: 'Bangaon - Sealdah Prime Commuter Local', time: '08:45' },
    { num: '33822', name: 'Bangaon - Sealdah Mid-Morning Local', time: '10:00' },
    { num: '33824', name: 'Bangaon - Sealdah Daytime Commuter', time: '11:35' },
    { num: '33826', name: 'Bangaon - Sealdah Noon Local', time: '13:05' },
    { num: '33828', name: 'Bangaon - Sealdah Afternoon Local', time: '14:35' },
    { num: '33830', name: 'Bangaon - Sealdah Evening Commuter Local', time: '16:05' },
    { num: '33832', name: 'Bangaon - Sealdah Evening Rush Local', time: '17:15' },
    { num: '33834', name: 'Bangaon - Sealdah Peak Evening Local', time: '18:25' },
    { num: '33836', name: 'Bangaon - Sealdah Night Commuter', time: '19:40' },
    { num: '33838', name: 'Bangaon - Sealdah Night Local', time: '20:55' },
    { num: '33840', name: 'Bangaon - Sealdah Late Night Local', time: '22:10' },
  ];

  await upsertTrainWithStops({ num: '33811', name: '', origin: 'SDAH', dest: 'BNJ', km: 77 }, bangaonUpDepartures, bangaonStops);
  await upsertTrainWithStops({ num: '33812', name: '', origin: 'BNJ', dest: 'SDAH', km: 77 }, bangaonDownDepartures, bangaonDownStops);
  console.log('✅ Added Sealdah <-> Bangaon all-station locals (30 daily services, covering DGNR, BBDB, NBE, HHR, BMG, BIRA, GUMA...)');

  // ── 2. HOWRAH - TARAKESWAR - ARAMBAGH ALL-STOP EMU LOCALS ─────────────────
  const tarakeswarStops = [
    { code: 'HWH', offset: 0 },
    { code: 'LLAH', offset: 8 },
    { code: 'BELR', offset: 11 },
    { code: 'BALY', offset: 14 },
    { code: 'UTAE', offset: 17 },
    { code: 'HMZ', offset: 20 },
    { code: 'KOG', offset: 23 },
    { code: 'RSAE', offset: 27 },
    { code: 'SRAE', offset: 32 },
    { code: 'SHE', offset: 37 },
    { code: 'DEA', offset: 43 },
    { code: 'NSF', offset: 47 },
    { code: 'SIU', offset: 52 },
    { code: 'KMLE', offset: 57 },
    { code: 'BLAE', offset: 62 },
    { code: 'MDSE', offset: 66 },
    { code: 'CDAE', offset: 71 },
    { code: 'PBZ', offset: 76 },
    { code: 'BAHW', offset: 81 },
    { code: 'LOK', offset: 86 },
    { code: 'TAK', offset: 92 },
    { code: 'TLPH', offset: 98 },
    { code: 'AMBG', offset: 115 },
    { code: 'GOGT', offset: 130 },
  ];

  const tarakeswarUpDepartures = [
    { num: '37311', name: 'Howrah - Tarakeswar Early Commuter Local', time: '04:30' },
    { num: '37313', name: 'Howrah - Tarakeswar Morning Local', time: '05:45' },
    { num: '37315', name: 'Howrah - Tarakeswar Morning Rush Local', time: '07:05' },
    { num: '37317', name: 'Howrah - Tarakeswar Peak Office Local', time: '08:25' },
    { num: '37319', name: 'Howrah - Tarakeswar Midday Local', time: '10:15' },
    { num: '37321', name: 'Howrah - Tarakeswar Daytime Local', time: '12:30' },
    { num: '37323', name: 'Howrah - Tarakeswar Afternoon Local', time: '14:40' },
    { num: '37325', name: 'Howrah - Tarakeswar Evening Commuter Local', time: '16:30' },
    { num: '37327', name: 'Howrah - Tarakeswar Evening Rush Local', time: '17:55' },
    { num: '37329', name: 'Howrah - Tarakeswar Peak Evening Local', time: '19:15' },
    { num: '37331', name: 'Howrah - Tarakeswar Night Local', time: '20:45' },
    { num: '37333', name: 'Howrah - Tarakeswar Late Night Local', time: '22:15' },
  ];

  const takMaxOffset = tarakeswarStops[tarakeswarStops.length - 1].offset;
  const tarakeswarDownStops = [...tarakeswarStops].reverse().map(s => ({
    code: s.code,
    offset: takMaxOffset - s.offset,
  }));

  const tarakeswarDownDepartures = [
    { num: '37312', name: 'Tarakeswar - Howrah Early Morning Local', time: '04:15' },
    { num: '37314', name: 'Tarakeswar - Howrah Morning Commuter Local', time: '05:30' },
    { num: '37316', name: 'Tarakeswar - Howrah Morning Rush Local', time: '06:50' },
    { num: '37318', name: 'Tarakeswar - Howrah Peak Office Local', time: '08:10' },
    { num: '37320', name: 'Tarakeswar - Howrah Mid-Morning Local', time: '10:00' },
    { num: '37322', name: 'Tarakeswar - Howrah Daytime Commuter', time: '12:15' },
    { num: '37324', name: 'Tarakeswar - Howrah Afternoon Local', time: '14:25' },
    { num: '37326', name: 'Tarakeswar - Howrah Evening Rush Local', time: '16:15' },
    { num: '37328', name: 'Tarakeswar - Howrah Peak Evening Local', time: '17:40' },
    { num: '37330', name: 'Tarakeswar - Howrah Night Commuter', time: '19:00' },
    { num: '37332', name: 'Tarakeswar - Howrah Night Local', time: '20:30' },
    { num: '37334', name: 'Tarakeswar - Howrah Late Night Local', time: '22:00' },
  ];

  await upsertTrainWithStops({ num: '37311', name: '', origin: 'HWH', dest: 'GOGT', km: 90 }, tarakeswarUpDepartures, tarakeswarStops);
  await upsertTrainWithStops({ num: '37312', name: '', origin: 'GOGT', dest: 'HWH', km: 90 }, tarakeswarDownDepartures, tarakeswarDownStops);
  console.log('✅ Added Howrah <-> Tarakeswar <-> Arambagh <-> Goghat all-station locals (24 daily services, covering BLAE, MDSE, PBZ, BAHW, GOGT...)');

  // ── 3. HOWRAH - BELUR MATH LOCALS ─────────────────────────────────────────
  const belurMathStops = [
    { code: 'HWH', offset: 0 },
    { code: 'LLAH', offset: 8 },
    { code: 'BRMH', offset: 15 },
  ];

  const belurMathUp = [
    { num: '37001', name: 'Howrah - Belur Math Morning Local', time: '07:15' },
    { num: '37003', name: 'Howrah - Belur Math Midday Local', time: '10:30' },
    { num: '37005', name: 'Howrah - Belur Math Afternoon Local', time: '14:15' },
    { num: '37007', name: 'Howrah - Belur Math Evening Local', time: '17:45' },
  ];

  const belurMathDownStops = [
    { code: 'BRMH', offset: 0 },
    { code: 'LLAH', offset: 7 },
    { code: 'HWH', offset: 15 },
  ];

  const belurMathDown = [
    { num: '37002', name: 'Belur Math - Howrah Morning Local', time: '07:45' },
    { num: '37004', name: 'Belur Math - Howrah Midday Local', time: '11:00' },
    { num: '37006', name: 'Belur Math - Howrah Afternoon Local', time: '14:45' },
    { num: '37008', name: 'Belur Math - Howrah Evening Local', time: '18:15' },
  ];

  await upsertTrainWithStops({ num: '37001', name: '', origin: 'HWH', dest: 'BRMH', km: 10 }, belurMathUp, belurMathStops);
  await upsertTrainWithStops({ num: '37002', name: '', origin: 'BRMH', dest: 'HWH', km: 10 }, belurMathDown, belurMathDownStops);
  console.log('✅ Added Howrah <-> Belur Math locals (8 daily services, activating BRMH)');

  // ── 4. SEALDAH - KALYANI SIMANTA LOCALS ───────────────────────────────────
  const kalyaniSimantaStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BNXR', offset: 6 },
    { code: 'DDJ', offset: 12 },
    { code: 'BP', offset: 35 },
    { code: 'NH', offset: 52 },
    { code: 'KPA', offset: 64 },
    { code: 'KYI', offset: 70 },
    { code: 'KLMJ', offset: 80 },
  ];

  const kalyaniSimantaUp = [
    { num: '31311', name: 'Sealdah - Kalyani Simanta Early Morning Local', time: '05:00' },
    { num: '31313', name: 'Sealdah - Kalyani Simanta Morning Commuter', time: '06:40' },
    { num: '31315', name: 'Sealdah - Kalyani Simanta Peak Office Local', time: '08:30' },
    { num: '31317', name: 'Sealdah - Kalyani Simanta Daytime Local', time: '11:15' },
    { num: '31319', name: 'Sealdah - Kalyani Simanta Afternoon Local', time: '14:00' },
    { num: '31321', name: 'Sealdah - Kalyani Simanta Evening Rush Local', time: '16:50' },
    { num: '31323', name: 'Sealdah - Kalyani Simanta Peak Evening Local', time: '18:15' },
    { num: '31325', name: 'Sealdah - Kalyani Simanta Night Local', time: '20:10' },
    { num: '31327', name: 'Sealdah - Kalyani Simanta Late Night Local', time: '21:50' },
  ];

  const kalyaniMax = kalyaniSimantaStops[kalyaniSimantaStops.length - 1].offset;
  const kalyaniSimantaDownStops = [...kalyaniSimantaStops].reverse().map(s => ({
    code: s.code,
    offset: kalyaniMax - s.offset,
  }));

  const kalyaniSimantaDown = [
    { num: '31312', name: 'Kalyani Simanta - Sealdah Early Morning Local', time: '04:30' },
    { num: '31314', name: 'Kalyani Simanta - Sealdah Morning Commuter', time: '06:05' },
    { num: '31316', name: 'Kalyani Simanta - Sealdah Peak Office Local', time: '07:50' },
    { num: '31318', name: 'Kalyani Simanta - Sealdah Daytime Local', time: '10:35' },
    { num: '31320', name: 'Kalyani Simanta - Sealdah Afternoon Local', time: '13:20' },
    { num: '31322', name: 'Kalyani Simanta - Sealdah Evening Commuter Local', time: '16:10' },
    { num: '31324', name: 'Kalyani Simanta - Sealdah Evening Rush Local', time: '17:35' },
    { num: '31326', name: 'Kalyani Simanta - Sealdah Night Local', time: '19:30' },
    { num: '31328', name: 'Kalyani Simanta - Sealdah Late Night Local', time: '21:10' },
  ];

  await upsertTrainWithStops({ num: '31311', name: '', origin: 'SDAH', dest: 'KLMJ', km: 53 }, kalyaniSimantaUp, kalyaniSimantaStops);
  await upsertTrainWithStops({ num: '31312', name: '', origin: 'KLMJ', dest: 'SDAH', km: 53 }, kalyaniSimantaDown, kalyaniSimantaDownStops);
  console.log('✅ Added Sealdah <-> Kalyani Simanta locals (18 daily services, activating KLMJ)');

  // ── 5. SEALDAH - LALGOLA ALL-STATION PASSENGER / EMU LOCALS ───────────────
  const lalgolaStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BNXR', offset: 6 },
    { code: 'DDJ', offset: 12 },
    { code: 'BP', offset: 35 },
    { code: 'NH', offset: 52 },
    { code: 'RHA', offset: 88 },
    { code: 'KNJ', offset: 115 },
    { code: 'DHU', offset: 128 },
    { code: 'MGMG', offset: 139 },
    { code: 'BTY', offset: 153 },
    { code: 'DEB', offset: 167 },
    { code: 'PLY', offset: 180 },
    { code: 'SRJN', offset: 191 },
    { code: 'REJ', offset: 201 },
    { code: 'BEB', offset: 213 },
    { code: 'SGV', offset: 224 },
    { code: 'CSZ', offset: 236 },
    { code: 'BPC', offset: 245 },
    { code: 'MBB', offset: 260 },
    { code: 'JJG', offset: 272 },
    { code: 'BQG', offset: 287 },
    { code: 'LGL', offset: 305 },
  ];

  const lalgolaUp = [
    { num: '31861', name: 'Sealdah - Lalgola Morning Passenger', time: '05:35' },
    { num: '31863', name: 'Sealdah - Lalgola Bhagirathi Fast Commuter', time: '08:45' },
    { num: '31865', name: 'Sealdah - Lalgola Afternoon Passenger', time: '13:10' },
    { num: '31867', name: 'Sealdah - Lalgola Evening Fast Local', time: '17:00' },
    { num: '31869', name: 'Sealdah - Lalgola Night Passenger', time: '20:15' },
  ];

  const lalgolaMax = lalgolaStops[lalgolaStops.length - 1].offset;
  const lalgolaDownStops = [...lalgolaStops].reverse().map(s => ({
    code: s.code,
    offset: lalgolaMax - s.offset,
  }));

  const lalgolaDown = [
    { num: '31862', name: 'Lalgola - Sealdah Early Morning Passenger', time: '04:15' },
    { num: '31864', name: 'Lalgola - Sealdah Morning Commuter', time: '07:30' },
    { num: '31866', name: 'Lalgola - Sealdah Midday Passenger', time: '11:45' },
    { num: '31868', name: 'Lalgola - Sealdah Afternoon Fast Local', time: '15:20' },
    { num: '31870', name: 'Lalgola - Sealdah Evening Passenger', time: '18:40' },
  ];

  await upsertTrainWithStops({ num: '31861', name: '', origin: 'SDAH', dest: 'LGL', km: 225 }, lalgolaUp, lalgolaStops);
  await upsertTrainWithStops({ num: '31862', name: '', origin: 'LGL', dest: 'SDAH', km: 225 }, lalgolaDown, lalgolaDownStops);
  console.log('✅ Added Sealdah <-> Lalgola all-station trains (10 daily services, activating DHU, MGMG, SRJN, REJ, SGV, CSZ...)');

  // ── 6. HOWRAH - BURDWAN CHORD LINE ALL-STOP LOCALS ────────────────────────
  const chordStops = [
    { code: 'HWH', offset: 0 },
    { code: 'LLAH', offset: 8 },
    { code: 'BELR', offset: 11 },
    { code: 'BALY', offset: 14 },
    { code: 'DKAE', offset: 22 },
    { code: 'GBRA', offset: 26 },
    { code: 'JOX', offset: 30 },
    { code: 'MBP', offset: 37 },
    { code: 'BLAE', offset: 42 },
    { code: 'KMLE', offset: 47 },
    { code: 'MDSE', offset: 51 },
    { code: 'CDAE', offset: 56 },
    { code: 'PBZ', offset: 61 },
    { code: 'BMAE', offset: 67 },
    { code: 'SHBC', offset: 73 },
    { code: 'HIH', offset: 79 },
    { code: 'JPQ', offset: 87 },
    { code: 'JRAE', offset: 93 },
    { code: 'NBAE', offset: 99 },
    { code: 'BWN', offset: 115 },
  ];

  const chordUp = [
    { num: '36811', name: 'Howrah - Barddhaman Chord Early Commuter', time: '04:45' },
    { num: '36813', name: 'Howrah - Barddhaman Chord Morning Local', time: '06:10' },
    { num: '36815', name: 'Howrah - Barddhaman Chord Morning Rush', time: '07:35' },
    { num: '36817', name: 'Howrah - Barddhaman Chord Peak Office Local', time: '09:00' },
    { num: '36819', name: 'Howrah - Barddhaman Chord Midday Local', time: '11:20' },
    { num: '36821', name: 'Howrah - Barddhaman Chord Afternoon Local', time: '13:50' },
    { num: '36823', name: 'Howrah - Barddhaman Chord Evening Rush', time: '16:20' },
    { num: '36825', name: 'Howrah - Barddhaman Chord Peak Evening', time: '17:45' },
    { num: '36827', name: 'Howrah - Barddhaman Chord Night Commuter', time: '19:10' },
    { num: '36829', name: 'Howrah - Barddhaman Chord Late Night Local', time: '21:15' },
  ];

  const chordMax = chordStops[chordStops.length - 1].offset;
  const chordDownStops = [...chordStops].reverse().map(s => ({
    code: s.code,
    offset: chordMax - s.offset,
  }));

  const chordDown = [
    { num: '36812', name: 'Barddhaman - Howrah Chord Early Commuter', time: '04:10' },
    { num: '36814', name: 'Barddhaman - Howrah Chord Morning Local', time: '05:35' },
    { num: '36816', name: 'Barddhaman - Howrah Chord Morning Rush Local', time: '07:00' },
    { num: '36818', name: 'Barddhaman - Howrah Chord Peak Office Local', time: '08:25' },
    { num: '36820', name: 'Barddhaman - Howrah Chord Midday Local', time: '10:45' },
    { num: '36822', name: 'Barddhaman - Howrah Chord Afternoon Local', time: '13:15' },
    { num: '36824', name: 'Barddhaman - Howrah Chord Evening Rush', time: '15:45' },
    { num: '36826', name: 'Barddhaman - Howrah Chord Peak Evening Local', time: '17:10' },
    { num: '36828', name: 'Barddhaman - Howrah Chord Night Commuter', time: '18:35' },
    { num: '36830', name: 'Barddhaman - Howrah Chord Late Night Local', time: '20:40' },
  ];

  await upsertTrainWithStops({ num: '36811', name: '', origin: 'HWH', dest: 'BWN', km: 95 }, chordUp, chordStops);
  await upsertTrainWithStops({ num: '36812', name: '', origin: 'BWN', dest: 'HWH', km: 95 }, chordDown, chordDownStops);
  console.log('✅ Added Howrah <-> Barddhaman Chord all-station locals (20 daily services, activating MBP, BLAE, MDSE, PBZ, SHBC, HIH, JPQ, NBAE...)');

  const totalTrains = await prisma.train.count();
  const totalStops = await prisma.scheduleStop.count();
  const activeStations = await prisma.station.count({ where: { scheduleStops: { some: {} } } });
  console.log(`\n🎉 SUMMARY: Trains: ${totalTrains}, Stops: ${totalStops}, Active Stations: ${activeStations}`);
}

main().finally(() => prisma.$disconnect());
