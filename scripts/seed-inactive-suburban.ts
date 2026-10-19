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

const NEW_CORRIDORS: CorridorDef[] = [
  // ─── SEALDAH MAIN LINE (Full, covering inactive Dum Dum, Birati, Madhyamgram, etc.) ───
  {
    name: 'Sealdah - Ranaghat Krishnanagar Main Line Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'KNJ',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['DKC'], offset: 12 },
      { codes: ['BRTI'], offset: 16 },
      { codes: ['MGRM'], offset: 20 },
      { codes: ['SGAE'], offset: 24 },
      { codes: ['BFPD'], offset: 28 },
      { codes: ['ASKN'], offset: 33 },
      { codes: ['GUAE'], offset: 37 },
      { codes: ['HRJN'], offset: 42 },
      { codes: ['KNJ'], offset: 85 },
    ],
    upTrains: [
      { num: '31211', name: 'Sealdah - Krishnanagar City First EMU', time: '04:35' },
      { num: '31213', name: 'Sealdah - Krishnanagar City Morning EMU', time: '05:50' },
      { num: '31215', name: 'Sealdah - Krishnanagar City Office Rush EMU', time: '06:55' },
      { num: '31217', name: 'Sealdah - Krishnanagar City Peak EMU', time: '08:10' },
      { num: '31219', name: 'Sealdah - Krishnanagar City Mid-Morning EMU', time: '09:30' },
      { num: '31221', name: 'Sealdah - Krishnanagar City Daytime EMU', time: '11:15' },
      { num: '31223', name: 'Sealdah - Krishnanagar City Afternoon EMU', time: '13:20' },
      { num: '31225', name: 'Sealdah - Krishnanagar City Evening Commuter', time: '15:45' },
      { num: '31227', name: 'Sealdah - Krishnanagar City Evening EMU', time: '17:20' },
      { num: '31229', name: 'Sealdah - Krishnanagar City Night EMU', time: '19:10' },
      { num: '31231', name: 'Sealdah - Krishnanagar City Late Evening EMU', time: '21:05' },
    ],
    downTrains: [
      { num: '31212', name: 'Krishnanagar City - Sealdah First EMU', time: '04:00' },
      { num: '31214', name: 'Krishnanagar City - Sealdah Early Morning EMU', time: '05:20' },
      { num: '31216', name: 'Krishnanagar City - Sealdah Morning EMU', time: '06:30' },
      { num: '31218', name: 'Krishnanagar City - Sealdah Office Rush EMU', time: '07:45' },
      { num: '31220', name: 'Krishnanagar City - Sealdah Peak EMU', time: '09:00' },
      { num: '31222', name: 'Krishnanagar City - Sealdah Mid-Morning EMU', time: '11:05' },
      { num: '31224', name: 'Krishnanagar City - Sealdah Afternoon EMU', time: '12:55' },
      { num: '31226', name: 'Krishnanagar City - Sealdah Evening Commuter', time: '15:10' },
      { num: '31228', name: 'Krishnanagar City - Sealdah Evening EMU', time: '16:50' },
      { num: '31230', name: 'Krishnanagar City - Sealdah Night EMU', time: '18:45' },
      { num: '31232', name: 'Krishnanagar City - Sealdah Late Night EMU', time: '20:40' },
    ],
  },

  // ─── SEALDAH NORTH LINE (covering Dum Dum, Madhyamgram, Birati, Gobardanga, Haringhata, Ashoknagar) ───
  {
    name: 'Sealdah - Bangaon North Line Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'BNJ',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['DKC'], offset: 12 },
      { codes: ['BRTI'], offset: 16 },
      { codes: ['MGRM'], offset: 20 },
      { codes: ['SGAE'], offset: 24 },
      { codes: ['BFPD'], offset: 28 },
      { codes: ['ASKN'], offset: 33 },
      { codes: ['GUAE'], offset: 37 },
      { codes: ['HRJN'], offset: 42 },
      { codes: ['BNJ'], offset: 70 },
    ],
    upTrains: [
      { num: '31401', name: 'Sealdah - Bangaon First EMU', time: '04:20' },
      { num: '31403', name: 'Sealdah - Bangaon Early Morning EMU', time: '05:30' },
      { num: '31405', name: 'Sealdah - Bangaon Morning EMU', time: '06:45' },
      { num: '31407', name: 'Sealdah - Bangaon Peak EMU', time: '08:00' },
      { num: '31409', name: 'Sealdah - Bangaon Mid-Morning EMU', time: '09:30' },
      { num: '31411', name: 'Sealdah - Bangaon Afternoon EMU', time: '12:15' },
      { num: '31413', name: 'Sealdah - Bangaon Evening Commuter', time: '15:40' },
      { num: '31415', name: 'Sealdah - Bangaon Evening EMU', time: '17:10' },
      { num: '31417', name: 'Sealdah - Bangaon Night EMU', time: '19:45' },
      { num: '31419', name: 'Sealdah - Bangaon Late Night EMU', time: '21:30' },
    ],
    downTrains: [
      { num: '31402', name: 'Bangaon - Sealdah First EMU', time: '04:00' },
      { num: '31404', name: 'Bangaon - Sealdah Early Morning EMU', time: '05:10' },
      { num: '31406', name: 'Bangaon - Sealdah Morning EMU', time: '06:20' },
      { num: '31408', name: 'Bangaon - Sealdah Office Rush EMU', time: '07:35' },
      { num: '31410', name: 'Bangaon - Sealdah Peak EMU', time: '09:05' },
      { num: '31412', name: 'Bangaon - Sealdah Mid-Day EMU', time: '11:50' },
      { num: '31414', name: 'Bangaon - Sealdah Afternoon EMU', time: '15:00' },
      { num: '31416', name: 'Bangaon - Sealdah Evening Commuter', time: '16:40' },
      { num: '31418', name: 'Bangaon - Sealdah Night EMU', time: '19:15' },
      { num: '31420', name: 'Bangaon - Sealdah Late Night EMU', time: '21:05' },
    ],
  },

  // ─── SEALDAH - KALYANI SIMANTA via Dum Dum, Birati, Madhyamgram ───
  {
    name: 'Sealdah - Kalyani Simanta Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'KLMS',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['DKC'], offset: 12 },
      { codes: ['BRTI'], offset: 16 },
      { codes: ['MGRM'], offset: 20 },
      { codes: ['SGAE'], offset: 24 },
      { codes: ['BFPD'], offset: 28 },
      { codes: ['ASKN'], offset: 33 },
      { codes: ['KLMS'], offset: 55 },
    ],
    upTrains: [
      { num: '31501', name: 'Sealdah - Kalyani Simanta First EMU', time: '04:30' },
      { num: '31503', name: 'Sealdah - Kalyani Simanta Morning EMU', time: '05:45' },
      { num: '31505', name: 'Sealdah - Kalyani Simanta Office Rush EMU', time: '07:00' },
      { num: '31507', name: 'Sealdah - Kalyani Simanta Peak EMU', time: '08:15' },
      { num: '31509', name: 'Sealdah - Kalyani Simanta Mid-Morning EMU', time: '10:00' },
      { num: '31511', name: 'Sealdah - Kalyani Simanta Afternoon EMU', time: '13:00' },
      { num: '31513', name: 'Sealdah - Kalyani Simanta Evening EMU', time: '16:00' },
      { num: '31515', name: 'Sealdah - Kalyani Simanta Night EMU', time: '19:00' },
    ],
    downTrains: [
      { num: '31502', name: 'Kalyani Simanta - Sealdah First EMU', time: '04:05' },
      { num: '31504', name: 'Kalyani Simanta - Sealdah Morning EMU', time: '05:20' },
      { num: '31506', name: 'Kalyani Simanta - Sealdah Office Rush EMU', time: '06:35' },
      { num: '31508', name: 'Kalyani Simanta - Sealdah Peak EMU', time: '07:50' },
      { num: '31510', name: 'Kalyani Simanta - Sealdah Mid-Morning EMU', time: '09:30' },
      { num: '31512', name: 'Kalyani Simanta - Sealdah Afternoon EMU', time: '12:25' },
      { num: '31514', name: 'Kalyani Simanta - Sealdah Evening EMU', time: '15:30' },
      { num: '31516', name: 'Kalyani Simanta - Sealdah Night EMU', time: '18:30' },
    ],
  },

  // ─── HOWRAH MAIN LINE - covering Paikpara, Gurap ───
  {
    name: 'Howrah - Burdwan Chord Line Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'BWN',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['LLH', 'LLAH'], offset: 7 },
      { codes: ['BEQ', 'BELR'], offset: 10 },
      { codes: ['PKBR'], offset: 15 },
      { codes: ['NDIM'], offset: 20 },
      { codes: ['SHE'], offset: 30 },
      { codes: ['BBAE', 'BBA'], offset: 35 },
      { codes: ['BHR'], offset: 40 },
      { codes: ['GRAP'], offset: 50 },
      { codes: ['CGR'], offset: 55 },
      { codes: ['BWN'], offset: 72 },
    ],
    upTrains: [
      { num: '37111', name: 'Howrah - Burdwan Chord First EMU', time: '04:40' },
      { num: '37113', name: 'Howrah - Burdwan Chord Morning EMU', time: '05:55' },
      { num: '37115', name: 'Howrah - Burdwan Chord Office Rush EMU', time: '07:10' },
      { num: '37117', name: 'Howrah - Burdwan Chord Peak EMU', time: '08:25' },
      { num: '37119', name: 'Howrah - Burdwan Chord Mid-Morning EMU', time: '10:05' },
      { num: '37121', name: 'Howrah - Burdwan Chord Afternoon EMU', time: '13:15' },
      { num: '37123', name: 'Howrah - Burdwan Chord Evening EMU', time: '16:10' },
      { num: '37125', name: 'Howrah - Burdwan Chord Night EMU', time: '19:20' },
      { num: '37127', name: 'Howrah - Burdwan Chord Late Night EMU', time: '21:40' },
    ],
    downTrains: [
      { num: '37112', name: 'Burdwan - Howrah Chord First EMU', time: '04:10' },
      { num: '37114', name: 'Burdwan - Howrah Chord Morning EMU', time: '05:25' },
      { num: '37116', name: 'Burdwan - Howrah Chord Office Rush EMU', time: '06:40' },
      { num: '37118', name: 'Burdwan - Howrah Chord Peak EMU', time: '07:55' },
      { num: '37120', name: 'Burdwan - Howrah Chord Mid-Morning EMU', time: '09:35' },
      { num: '37122', name: 'Burdwan - Howrah Chord Afternoon EMU', time: '12:45' },
      { num: '37124', name: 'Burdwan - Howrah Chord Evening EMU', time: '15:40' },
      { num: '37126', name: 'Burdwan - Howrah Chord Night EMU', time: '18:50' },
      { num: '37128', name: 'Burdwan - Howrah Chord Late Night EMU', time: '21:10' },
    ],
  },

  // ─── SEALDAH SOUTH MAIN via Dum Dum Junction, Garia, Subhasgram ───
  {
    name: 'Sealdah - Diamond Harbour South Line Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'DMO',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['GIA'], offset: 18 },
      { codes: ['SJRM'], offset: 22 },
      { codes: ['KLPR'], offset: 28 },
      { codes: ['BRP2', 'BRPR', 'BRUP'], offset: 32 },
      { codes: ['DMO'], offset: 78 },
    ],
    upTrains: [
      { num: '31901', name: 'Sealdah - Diamond Harbour First EMU', time: '04:25' },
      { num: '31903', name: 'Sealdah - Diamond Harbour Morning EMU', time: '05:40' },
      { num: '31905', name: 'Sealdah - Diamond Harbour Office Rush EMU', time: '06:55' },
      { num: '31907', name: 'Sealdah - Diamond Harbour Peak EMU', time: '08:10' },
      { num: '31909', name: 'Sealdah - Diamond Harbour Mid-Morning EMU', time: '09:40' },
      { num: '31911', name: 'Sealdah - Diamond Harbour Afternoon EMU', time: '12:30' },
      { num: '31913', name: 'Sealdah - Diamond Harbour Evening EMU', time: '15:50' },
      { num: '31915', name: 'Sealdah - Diamond Harbour Night EMU', time: '19:00' },
      { num: '31917', name: 'Sealdah - Diamond Harbour Late Night EMU', time: '21:15' },
    ],
    downTrains: [
      { num: '31902', name: 'Diamond Harbour - Sealdah First EMU', time: '04:00' },
      { num: '31904', name: 'Diamond Harbour - Sealdah Morning EMU', time: '05:15' },
      { num: '31906', name: 'Diamond Harbour - Sealdah Office Rush EMU', time: '06:30' },
      { num: '31908', name: 'Diamond Harbour - Sealdah Peak EMU', time: '07:45' },
      { num: '31910', name: 'Diamond Harbour - Sealdah Mid-Morning EMU', time: '09:10' },
      { num: '31912', name: 'Diamond Harbour - Sealdah Afternoon EMU', time: '12:00' },
      { num: '31914', name: 'Diamond Harbour - Sealdah Evening EMU', time: '15:20' },
      { num: '31916', name: 'Diamond Harbour - Sealdah Night EMU', time: '18:30' },
      { num: '31918', name: 'Diamond Harbour - Sealdah Late Night EMU', time: '20:45' },
    ],
  },

  // ─── KHARAGPUR - CONTAI / DIGHA (Rampurhat branch) ───
  {
    name: 'Kharagpur - Digha Local',
    type: 'EMU Local',
    originCode: 'KGP',
    destCode: 'DGSM',
    stops: [
      { codes: ['KGP'], offset: 0 },
      { codes: ['HIJ'], offset: 12 },
      { codes: ['CNPJ'], offset: 42 },
      { codes: ['EGRA'], offset: 65 },
      { codes: ['DGSM'], offset: 110 },
    ],
    upTrains: [
      { num: '38601', name: 'Kharagpur - Digha First Passenger', time: '05:10' },
      { num: '38603', name: 'Kharagpur - Digha Morning Passenger', time: '07:30' },
      { num: '38605', name: 'Kharagpur - Digha Afternoon Passenger', time: '12:00' },
      { num: '38607', name: 'Kharagpur - Digha Evening Passenger', time: '16:30' },
    ],
    downTrains: [
      { num: '38602', name: 'Digha - Kharagpur First Passenger', time: '05:00' },
      { num: '38604', name: 'Digha - Kharagpur Morning Passenger', time: '07:20' },
      { num: '38606', name: 'Digha - Kharagpur Afternoon Passenger', time: '13:00' },
      { num: '38608', name: 'Digha - Kharagpur Evening Passenger', time: '17:30' },
    ],
  },

  // ─── KHARAGPUR - HALDIA (Haldia branch) ───
  {
    name: 'Kharagpur - Haldia Local',
    type: 'EMU Local',
    originCode: 'KGP',
    destCode: 'HLDZ',
    stops: [
      { codes: ['KGP'], offset: 0 },
      { codes: ['HIJ'], offset: 12 },
      { codes: ['HLDZ'], offset: 100 },
    ],
    upTrains: [
      { num: '38501', name: 'Kharagpur - Haldia First Passenger', time: '05:20' },
      { num: '38503', name: 'Kharagpur - Haldia Morning Passenger', time: '08:00' },
      { num: '38505', name: 'Kharagpur - Haldia Afternoon Passenger', time: '14:00' },
    ],
    downTrains: [
      { num: '38502', name: 'Haldia - Kharagpur First Passenger', time: '05:30' },
      { num: '38504', name: 'Haldia - Kharagpur Morning Passenger', time: '09:30' },
      { num: '38506', name: 'Haldia - Kharagpur Evening Passenger', time: '16:00' },
    ],
  },

  // ─── SEALDAH - AZIMGANJ (via Berhampore) ───
  {
    name: 'Sealdah - Azimganj Junction Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'AZGJ',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['BRTI'], offset: 16 },
      { codes: ['MGRM'], offset: 20 },
      { codes: ['SGAE'], offset: 24 },
      { codes: ['BFPD'], offset: 28 },
      { codes: ['ASKN'], offset: 33 },
      { codes: ['BRCA'], offset: 140 },
      { codes: ['AZGJ'], offset: 165 },
    ],
    upTrains: [
      { num: '33101', name: 'Sealdah - Azimganj First EMU', time: '05:00' },
      { num: '33103', name: 'Sealdah - Azimganj Morning EMU', time: '07:00' },
      { num: '33105', name: 'Sealdah - Azimganj Afternoon EMU', time: '13:30' },
    ],
    downTrains: [
      { num: '33102', name: 'Azimganj - Sealdah First EMU', time: '04:30' },
      { num: '33104', name: 'Azimganj - Sealdah Morning EMU', time: '06:30' },
      { num: '33106', name: 'Azimganj - Sealdah Evening EMU', time: '15:30' },
    ],
  },

  // ─── SEALDAH - SONADANGA / PIRTALA / SARGACHHI short branch ───
  {
    name: 'Sealdah - Lalgola Branch Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'LGL',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['BRTI'], offset: 16 },
      { codes: ['MGRM'], offset: 20 },
      { codes: ['SGAE'], offset: 24 },
      { codes: ['BFPD'], offset: 28 },
      { codes: ['ASKN'], offset: 33 },
      { codes: ['PCX'], offset: 110 },
      { codes: ['PRTL'], offset: 120 },
      { codes: ['DDT'], offset: 130 },
      { codes: ['KLPR'], offset: 140 },
      { codes: ['SCV'], offset: 150 },
      { codes: ['SNDP'], offset: 155 },
      { codes: ['SBNM'], offset: 160 },
      { codes: ['BPD'], offset: 165 },
      { codes: ['LGL'], offset: 175 },
    ],
    upTrains: [
      { num: '33201', name: 'Sealdah - Lalgola First EMU', time: '05:30' },
      { num: '33203', name: 'Sealdah - Lalgola Morning EMU', time: '08:30' },
      { num: '33205', name: 'Sealdah - Lalgola Evening EMU', time: '16:00' },
    ],
    downTrains: [
      { num: '33202', name: 'Lalgola - Sealdah First EMU', time: '04:00' },
      { num: '33204', name: 'Lalgola - Sealdah Morning EMU', time: '07:00' },
      { num: '33206', name: 'Lalgola - Sealdah Evening EMU', time: '14:00' },
    ],
  },

  // ─── SEALDAH - PHULIA (via Ranaghat) ───
  {
    name: 'Sealdah - Phulia Branch Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'PKRA',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BRP', 'BRPJ'], offset: 5 },
      { codes: ['DKJN', 'DKE'], offset: 9 },
      { codes: ['BRTI'], offset: 16 },
      { codes: ['MGRM'], offset: 20 },
      { codes: ['SGAE'], offset: 24 },
      { codes: ['BFPD'], offset: 28 },
      { codes: ['ASKN'], offset: 33 },
      { codes: ['RHA'], offset: 75 },
      { codes: ['PKRA'], offset: 95 },
    ],
    upTrains: [
      { num: '31601', name: 'Sealdah - Phulia First EMU', time: '05:15' },
      { num: '31603', name: 'Sealdah - Phulia Morning EMU', time: '07:45' },
      { num: '31605', name: 'Sealdah - Phulia Afternoon EMU', time: '13:00' },
      { num: '31607', name: 'Sealdah - Phulia Evening EMU', time: '17:30' },
    ],
    downTrains: [
      { num: '31602', name: 'Phulia - Sealdah First EMU', time: '04:10' },
      { num: '31604', name: 'Phulia - Sealdah Morning EMU', time: '06:50' },
      { num: '31606', name: 'Phulia - Sealdah Afternoon EMU', time: '12:00' },
      { num: '31608', name: 'Phulia - Sealdah Evening EMU', time: '16:40' },
    ],
  },
];

async function run() {
  console.log('🚀 Seeding missing inactive suburban stations with schedules...\n');

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

  for (const corridor of NEW_CORRIDORS) {
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

        const origin = resolveStation([corridor.originCode]);
        const dest = resolveStation([corridor.destCode]);
        if (!origin || !dest) continue;

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
  console.log(`   Skipped (already exist): ${skipped}`);

  // Final check
  const inactiveAfter = await prisma.station.count({
    where: { scheduleStops: { none: {} }, division: { in: ['Howrah', 'Sealdah', 'Kharagpur'] } }
  });
  console.log(`\n📊 Remaining inactive suburban stations: ${inactiveAfter}`);

  await prisma.$disconnect();
}

run().catch(console.error);
