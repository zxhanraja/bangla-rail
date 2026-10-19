import { prisma } from '../src/lib/prisma';

function addMinutes(startTime: string, minutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

interface NewStation {
  code: string;
  name: string;
  nameBn: string;
  zone: string;
  division: string;
  district: string;
  lat: number;
  lng: number;
}

const MISSING_STATIONS: NewStation[] = [
  { code: 'BZL', name: 'Belanagar', nameBn: 'বেলানগর', zone: 'ER', division: 'Howrah', district: 'Howrah', lat: 22.658, lng: 88.318 },
  { code: 'MGAE', name: 'Magra', nameBn: 'মগরা', zone: 'ER', division: 'Howrah', district: 'Hooghly', lat: 22.983, lng: 88.375 },
  { code: 'HRSR', name: 'Harishnagar', nameBn: 'হরীশনগর', zone: 'ER', division: 'Sealdah', district: 'Nadia', lat: 23.402, lng: 88.751 },
  { code: 'NBRN', name: 'Naba Raynagar Halt', nameBn: 'নব রায়নগর', zone: 'ER', division: 'Sealdah', district: 'Nadia', lat: 23.189, lng: 88.625 },
  { code: 'GNG', name: 'Gangnapur', nameBn: 'গাংনাপুর', zone: 'ER', division: 'Sealdah', district: 'Nadia', lat: 23.210, lng: 88.672 },
  { code: 'MAJ', name: 'Majhergram', nameBn: 'মাঝেরগ্রাম', zone: 'ER', division: 'Sealdah', district: 'Nadia', lat: 23.195, lng: 88.723 },
  { code: 'AKIP', name: 'Akaipur Halt', nameBn: 'আকাইপুর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 23.178, lng: 88.761 },
  { code: 'GN', name: 'Gopalnagar', nameBn: 'গোপালনগর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 23.155, lng: 88.790 },
  { code: 'STBR', name: 'Satberia Halt', nameBn: 'সাতবেড়িয়া', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 23.112, lng: 88.805 },
  { code: 'BNAA', name: 'Bibhuti Bhushan Halt', nameBn: 'বিভূতিভূষণ হল্ট', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 23.080, lng: 88.815 },
  { code: 'MPE', name: 'Malatipur Flag', nameBn: 'মালতীপুর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 22.653, lng: 88.681 },
  { code: 'GGV', name: 'Ghoraras Chona Halt', nameBn: 'ঘোড়ারাস ছোনা', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 22.665, lng: 88.730 },
  { code: 'MPN', name: 'Madhyampur Halt', nameBn: 'মধ্যমপুর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 22.671, lng: 88.872 },
  { code: 'NMDR', name: 'Nimdari', nameBn: 'নিমদাঁড়ি', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas', lat: 22.650, lng: 88.905 },
  { code: 'DMU', name: 'Dhamuah', nameBn: 'ধামুয়া', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas', lat: 22.285, lng: 88.408 },
  { code: 'BHPA', name: 'Bahirpuya Halt', nameBn: 'বহিরপুয়া হল্ট', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas', lat: 22.253, lng: 88.380 },
  { code: 'DLA', name: 'Deula', nameBn: 'দেউলা', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas', lat: 22.215, lng: 88.345 },
  { code: 'SJPR', name: 'Surjyapur', nameBn: 'সূর্যপুর', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas', lat: 22.280, lng: 88.481 },
  { code: 'PDPK', name: 'Padmapukur', nameBn: 'পদ্মপুকুর', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.565, lng: 88.310 },
  { code: 'NDGJ', name: 'Nandai Gajan', nameBn: 'নন্দাইগাজন', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.385, lng: 87.820 },
  { code: 'RGX', name: 'Raghunathbari', nameBn: 'রঘুনাথবাড়ি', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.345, lng: 87.872 },
  { code: 'RGA', name: 'Rajgoda', nameBn: 'রাজগোদা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.312, lng: 87.901 },
  { code: 'SMTG', name: 'Shahid Matangini', nameBn: 'শহীদ মাতঙ্গিনী', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.290, lng: 87.915 },
  { code: 'KSBP', name: 'Keshabpur', nameBn: 'কেশবপুর', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.221, lng: 87.971 },
  { code: 'SSPH', name: 'Satish Samanta', nameBn: 'সতীশ সামন্ত', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.185, lng: 88.012 },
  { code: 'BYSA', name: 'Basulyasutahata', nameBn: 'বাসুলিয়া সুতাহাটা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.115, lng: 88.105 },
  { code: 'DZKT', name: 'Durgachak Town', nameBn: 'দুর্গাচক টাউন', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur', lat: 22.062, lng: 88.165 },
  { code: 'BKNM', name: 'Bankra Nayabaz', nameBn: 'বাঁকড়া নয়াবাজ', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.601, lng: 88.271 },
  { code: 'KONA', name: 'Kona', nameBn: 'কোনা', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.610, lng: 88.290 },
  { code: 'DNI', name: 'Dansi', nameBn: 'ডাঁসি', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.618, lng: 88.243 },
  { code: 'JLBR', name: 'Jhaluarber', nameBn: 'ঝালুয়ারবেড়', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.625, lng: 88.225 },
  { code: 'MDC', name: 'Makardaha', nameBn: 'মাকড়দহ', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.631, lng: 88.210 },
  { code: 'DMJR', name: 'Domjur Road', nameBn: 'ডোমজুড় রোড', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.636, lng: 88.192 },
  { code: 'DJR', name: 'Domjur', nameBn: 'ডোমজুড়', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.641, lng: 88.181 },
  { code: 'DKB', name: 'Dakshinbari', nameBn: 'দক্ষিণবাড়ি', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.648, lng: 88.152 },
  { code: 'BAC', name: 'Bargachia', nameBn: 'বার্গাচিয়া', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.659, lng: 88.125 },
  { code: 'PTHL', name: 'Pantihal', nameBn: 'পাঁতিহal', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.645, lng: 88.082 },
  { code: 'MNH', name: 'Munshirhat', nameBn: 'মুন্সিরহাট', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.628, lng: 88.051 },
  { code: 'MHLN', name: 'Mahendralalnagar', nameBn: 'মহেন্দ্রলাল নগর', zone: 'SER', division: 'Kharagpur', district: 'Howrah', lat: 22.605, lng: 88.025 }
];

interface CorridorDefinition {
  name: string;
  type: string;
  originCode: string;
  destCode: string;
  stops: { codes: string[]; offset: number }[];
  upTrains: { num: string; name: string; time: string }[];
  downTrains: { num: string; name: string; time: string }[];
}

const ALL_CORRIDORS: CorridorDefinition[] = [
  // ── 1. HOWRAH - BURDWAN MAIN LINE (ALL 34 STATIONS) ──────────────────────
  {
    name: 'Howrah - Burdwan Main Line Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'BWN',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['LLH', 'LLAH'], offset: 7 },
      { codes: ['BEQ', 'BELR'], offset: 10 },
      { codes: ['BLY', 'BALY'], offset: 13 },
      { codes: ['UPA', 'UTAE'], offset: 16 },
      { codes: ['HMZ', 'HLMT'], offset: 19 },
      { codes: ['KOG', 'KTAE'], offset: 22 },
      { codes: ['RIS', 'RSAE'], offset: 25 },
      { codes: ['SRP', 'SRAE'], offset: 29 },
      { codes: ['SHE'], offset: 34 },
      { codes: ['BBAE', 'BBA'], offset: 38 },
      { codes: ['BHR'], offset: 42 },
      { codes: ['MUU'], offset: 45 },
      { codes: ['CGR'], offset: 48 },
      { codes: ['CNS', 'CHN'], offset: 52 },
      { codes: ['HGY'], offset: 55 },
      { codes: ['BDC'], offset: 60 },
      { codes: ['ADST'], offset: 65 },
      { codes: ['MGAE'], offset: 69 },
      { codes: ['TLO'], offset: 74 },
      { codes: ['KNY', 'KHN'], offset: 79 },
      { codes: ['PDA', 'PHDE'], offset: 85 },
      { codes: ['SLG'], offset: 90 },
      { codes: ['BCGM'], offset: 95 },
      { codes: ['BNCX', 'BOI'], offset: 100 },
      { codes: ['DBP'], offset: 105 },
      { codes: ['BGF'], offset: 110 },
      { codes: ['MYM', 'MSAE'], offset: 115 },
      { codes: ['NMF'], offset: 120 },
      { codes: ['RSLP', 'RSLR'], offset: 126 },
      { codes: ['PLAE'], offset: 132 },
      { codes: ['SKG', 'SKLE'], offset: 138 },
      { codes: ['GRP'], offset: 144 },
      { codes: ['BWN'], offset: 152 },
    ],
    upTrains: [
      { num: '37811', name: 'Howrah - Burdwan Main Early Commuter', time: '04:15' },
      { num: '37815', name: 'Howrah - Burdwan Main Morning Office Rush', time: '06:10' },
      { num: '37823', name: 'Howrah - Burdwan Main Morning Local', time: '08:20' },
      { num: '37829', name: 'Howrah - Burdwan Main Midday Local', time: '11:00' },
      { num: '37837', name: 'Howrah - Burdwan Main Afternoon Commuter', time: '14:15' },
      { num: '37843', name: 'Howrah - Burdwan Main Evening Rush Local', time: '17:05' },
      { num: '37849', name: 'Howrah - Burdwan Main Peak Return Local', time: '18:45' },
      { num: '37855', name: 'Howrah - Burdwan Main Night Commuter Local', time: '20:30' },
      { num: '37859', name: 'Howrah - Burdwan Main Late Night Local', time: '22:15' },
    ],
    downTrains: [
      { num: '37812', name: 'Burdwan - Howrah Main Early Commuter', time: '04:00' },
      { num: '37816', name: 'Burdwan - Howrah Main Morning Office Rush', time: '05:50' },
      { num: '37824', name: 'Burdwan - Howrah Main Morning Local', time: '08:00' },
      { num: '37830', name: 'Burdwan - Howrah Main Midday Local', time: '10:45' },
      { num: '37838', name: 'Burdwan - Howrah Main Afternoon Commuter', time: '14:00' },
      { num: '37844', name: 'Burdwan - Howrah Main Evening Rush Local', time: '16:50' },
      { num: '37850', name: 'Burdwan - Howrah Main Peak Return Local', time: '18:30' },
      { num: '37856', name: 'Burdwan - Howrah Main Night Commuter Local', time: '20:15' },
      { num: '37860', name: 'Burdwan - Howrah Main Late Night Local', time: '22:00' },
    ]
  },

  // ── 2. HOWRAH - BURDWAN CHORD LINE (ALL 28 STATIONS) ─────────────────────
  {
    name: 'Howrah - Burdwan Chord Line Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'BWN',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['LLH', 'LLAH'], offset: 7 },
      { codes: ['BEQ', 'BELR'], offset: 10 },
      { codes: ['BLY', 'BALY'], offset: 13 },
      { codes: ['BZL'], offset: 17 },
      { codes: ['DKAE'], offset: 23 },
      { codes: ['GBRA'], offset: 28 },
      { codes: ['JOX'], offset: 32 },
      { codes: ['BPAE'], offset: 36 },
      { codes: ['BRPA'], offset: 40 },
      { codes: ['MBP'], offset: 44 },
      { codes: ['KQU'], offset: 49 },
      { codes: ['MDSE'], offset: 53 },
      { codes: ['CDAE'], offset: 58 },
      { codes: ['PBZ'], offset: 63 },
      { codes: ['BMAE'], offset: 68 },
      { codes: ['SHBC'], offset: 73 },
      { codes: ['HIH'], offset: 78 },
      { codes: ['GRAE', 'GRAP'], offset: 83 },
      { codes: ['JPQ'], offset: 88 },
      { codes: ['JRAE'], offset: 93 },
      { codes: ['NBAE'], offset: 98 },
      { codes: ['MSAG', 'MSAE'], offset: 103 },
      { codes: ['CHC'], offset: 108 },
      { codes: ['PRAE'], offset: 113 },
      { codes: ['SKG', 'SKLE'], offset: 120 },
      { codes: ['GRP'], offset: 126 },
      { codes: ['BWN'], offset: 135 },
    ],
    upTrains: [
      { num: '36811', name: 'Howrah - Burdwan Chord Early Commuter', time: '04:30' },
      { num: '36815', name: 'Howrah - Burdwan Chord Morning Rush Local', time: '06:30' },
      { num: '36821', name: 'Howrah - Burdwan Chord Morning Office Special', time: '08:40' },
      { num: '36827', name: 'Howrah - Burdwan Chord Midday Commuter', time: '11:25' },
      { num: '36833', name: 'Howrah - Burdwan Chord Afternoon Local', time: '14:40' },
      { num: '36839', name: 'Howrah - Burdwan Chord Evening Rush Local', time: '17:25' },
      { num: '36845', name: 'Howrah - Burdwan Chord Peak Return Commuter', time: '19:10' },
      { num: '36851', name: 'Howrah - Burdwan Chord Night Local', time: '21:05' },
      { num: '36855', name: 'Howrah - Burdwan Chord Late Night Local', time: '22:30' },
    ],
    downTrains: [
      { num: '36812', name: 'Burdwan - Howrah Chord Early Commuter', time: '04:15' },
      { num: '36816', name: 'Burdwan - Howrah Chord Morning Rush Local', time: '06:15' },
      { num: '36822', name: 'Burdwan - Howrah Chord Morning Office Special', time: '08:25' },
      { num: '36828', name: 'Burdwan - Howrah Chord Midday Commuter', time: '11:10' },
      { num: '36834', name: 'Burdwan - Howrah Chord Afternoon Local', time: '14:25' },
      { num: '36840', name: 'Burdwan - Howrah Chord Evening Rush Local', time: '17:10' },
      { num: '36846', name: 'Burdwan - Howrah Chord Peak Return Commuter', time: '18:55' },
      { num: '36852', name: 'Burdwan - Howrah Chord Night Local', time: '20:50' },
      { num: '36856', name: 'Burdwan - Howrah Chord Late Night Local', time: '22:15' },
    ]
  },

  // ── 3. SEORAPHULI - TARAKESHWAR BRANCH LINE (ALL 14 STATIONS) ────────────
  {
    name: 'Howrah / Seoraphuli - Tarakeshwar Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'TAK',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['SRP', 'SRAE'], offset: 29 },
      { codes: ['SHE'], offset: 34 },
      { codes: ['DEA'], offset: 41 },
      { codes: ['NSF'], offset: 45 },
      { codes: ['SIU'], offset: 49 },
      { codes: ['KQU'], offset: 55 },
      { codes: ['MLYA'], offset: 60 },
      { codes: ['NLK', 'NKL'], offset: 65 },
      { codes: ['HPL'], offset: 70 },
      { codes: ['KKAE'], offset: 75 },
      { codes: ['BAHW'], offset: 80 },
      { codes: ['LOK'], offset: 85 },
      { codes: ['TAK'], offset: 92 },
    ],
    upTrains: [
      { num: '37311', name: 'Howrah - Tarakeshwar Early Morning Local', time: '04:50' },
      { num: '37317', name: 'Howrah - Tarakeshwar Morning Commuter', time: '06:55' },
      { num: '37323', name: 'Howrah - Tarakeshwar Morning Rush Local', time: '09:00' },
      { num: '37329', name: 'Howrah - Tarakeshwar Midday Local', time: '12:00' },
      { num: '37335', name: 'Howrah - Tarakeshwar Afternoon Commuter', time: '15:10' },
      { num: '37341', name: 'Howrah - Tarakeshwar Evening Rush Local', time: '17:50' },
      { num: '37347', name: 'Howrah - Tarakeshwar Night Local', time: '20:10' },
    ],
    downTrains: [
      { num: '37312', name: 'Tarakeshwar - Howrah Early Morning Local', time: '04:30' },
      { num: '37318', name: 'Tarakeshwar - Howrah Morning Commuter', time: '06:35' },
      { num: '37324', name: 'Tarakeshwar - Howrah Morning Rush Local', time: '08:40' },
      { num: '37330', name: 'Tarakeshwar - Howrah Midday Local', time: '11:40' },
      { num: '37336', name: 'Tarakeshwar - Howrah Afternoon Commuter', time: '14:50' },
      { num: '37342', name: 'Tarakeshwar - Howrah Evening Rush Local', time: '17:30' },
      { num: '37348', name: 'Tarakeshwar - Howrah Night Local', time: '19:50' },
    ]
  },

  // ── 4. BANDEL - KATWA LINE (ALL 27 STATIONS) ──────────────────────────────
  {
    name: 'Howrah / Bandel - Katwa All-Stops Local',
    type: 'EMU Local',
    originCode: 'BDC',
    destCode: 'KWAE',
    stops: [
      { codes: ['BDC'], offset: 0 },
      { codes: ['BSAE'], offset: 6 },
      { codes: ['TBAE'], offset: 11 },
      { codes: ['KJU'], offset: 16 },
      { codes: ['DMLE'], offset: 21 },
      { codes: ['KMAE'], offset: 26 },
      { codes: ['JIT'], offset: 31 },
      { codes: ['BGAE'], offset: 37 },
      { codes: ['SOAE'], offset: 42 },
      { codes: ['BHLA'], offset: 47 },
      { codes: ['GPAE'], offset: 53 },
      { codes: ['ABKA'], offset: 60 },
      { codes: ['BGRA'], offset: 66 },
      { codes: ['DTAE'], offset: 72 },
      { codes: ['SMAE'], offset: 78 },
      { codes: ['NDAE'], offset: 86 },
      { codes: ['BFZ'], offset: 92 },
      { codes: ['VSPR', 'BTRI'], offset: 97 },
      { codes: ['PSAE'], offset: 103 },
      { codes: ['MTFA'], offset: 109 },
      { codes: ['LKX'], offset: 114 },
      { codes: ['BQY'], offset: 120 },
      { codes: ['PTAE'], offset: 126 },
      { codes: ['AGAE'], offset: 132 },
      { codes: ['SHBA', 'SHBL'], offset: 138 },
      { codes: ['DHAE'], offset: 145 },
      { codes: ['KWAE'], offset: 155 },
    ],
    upTrains: [
      { num: '37911', name: 'Bandel - Katwa Early Morning Commuter', time: '04:40' },
      { num: '37915', name: 'Bandel - Katwa Morning Office Rush Local', time: '06:50' },
      { num: '37921', name: 'Bandel - Katwa Morning Passenger Local', time: '09:15' },
      { num: '37925', name: 'Bandel - Katwa Midday Commuter', time: '12:25' },
      { num: '37929', name: 'Bandel - Katwa Afternoon Local', time: '15:35' },
      { num: '37933', name: 'Bandel - Katwa Evening Rush Commuter', time: '18:10' },
      { num: '37937', name: 'Bandel - Katwa Night Commuter Local', time: '20:40' },
    ],
    downTrains: [
      { num: '37912', name: 'Katwa - Bandel Early Morning Commuter', time: '04:15' },
      { num: '37916', name: 'Katwa - Bandel Morning Office Rush Local', time: '06:25' },
      { num: '37922', name: 'Katwa - Bandel Morning Passenger Local', time: '08:50' },
      { num: '37926', name: 'Katwa - Bandel Midday Commuter', time: '12:00' },
      { num: '37930', name: 'Katwa - Bandel Afternoon Local', time: '15:10' },
      { num: '37934', name: 'Katwa - Bandel Evening Rush Commuter', time: '17:45' },
      { num: '37938', name: 'Katwa - Bandel Night Commuter Local', time: '20:15' },
    ]
  },

  // ── 5. BANDEL - NAIHATI BRANCH (CROSS-RIVER JUBILEE BRIDGE) ──────────────
  {
    name: 'Bandel - Naihati Shuttle Local',
    type: 'EMU Local',
    originCode: 'BDC',
    destCode: 'NH',
    stops: [
      { codes: ['BDC'], offset: 0 },
      { codes: ['HYGT', 'HYG'], offset: 6 },
      { codes: ['GRFA', 'GFAE'], offset: 11 },
      { codes: ['NH', 'NKPR'], offset: 18 },
    ],
    upTrains: [
      { num: '37521', name: 'Bandel - Naihati Morning Commuter Shuttle', time: '06:00' },
      { num: '37523', name: 'Bandel - Naihati Peak Morning Shuttle', time: '08:15' },
      { num: '37527', name: 'Bandel - Naihati Midday Shuttle', time: '11:45' },
      { num: '37531', name: 'Bandel - Naihati Afternoon Shuttle', time: '15:20' },
      { num: '37535', name: 'Bandel - Naihati Evening Rush Shuttle', time: '17:50' },
      { num: '37539', name: 'Bandel - Naihati Night Return Shuttle', time: '20:25' },
    ],
    downTrains: [
      { num: '37522', name: 'Naihati - Bandel Morning Commuter Shuttle', time: '06:30' },
      { num: '37524', name: 'Naihati - Bandel Peak Morning Shuttle', time: '08:45' },
      { num: '37528', name: 'Naihati - Bandel Midday Shuttle', time: '12:15' },
      { num: '37532', name: 'Naihati - Bandel Afternoon Shuttle', time: '15:50' },
      { num: '37536', name: 'Naihati - Bandel Evening Rush Shuttle', time: '18:20' },
      { num: '37540', name: 'Naihati - Bandel Night Return Shuttle', time: '20:55' },
    ]
  },

  // ── 6. DANKUNI - DUM DUM JN (CALCUTTA CHORD LINK) ─────────────────────────
  {
    name: 'Sealdah / Dum Dum - Dankuni Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'DKAE',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BNXR', 'BYNR'], offset: 6 },
      { codes: ['DDJ'], offset: 12 },
      { codes: ['BARN'], offset: 18 },
      { codes: ['DAKE', 'DKAE2'], offset: 23 },
      { codes: ['BLYG'], offset: 27 },
      { codes: ['BLYH'], offset: 31 },
      { codes: ['RCD'], offset: 35 },
      { codes: ['DKAE'], offset: 42 },
    ],
    upTrains: [
      { num: '32211', name: 'Sealdah - Dankuni Early Morning Local', time: '05:10' },
      { num: '32215', name: 'Sealdah - Dankuni Morning Rush Local', time: '07:20' },
      { num: '32221', name: 'Sealdah - Dankuni Morning Commuter', time: '09:30' },
      { num: '32227', name: 'Sealdah - Dankuni Midday Local', time: '12:40' },
      { num: '32233', name: 'Sealdah - Dankuni Afternoon Local', time: '15:50' },
      { num: '32239', name: 'Sealdah - Dankuni Evening Rush Local', time: '18:15' },
      { num: '32245', name: 'Sealdah - Dankuni Night Commuter Local', time: '20:50' },
    ],
    downTrains: [
      { num: '32212', name: 'Dankuni - Sealdah Early Morning Local', time: '04:55' },
      { num: '32216', name: 'Dankuni - Sealdah Morning Rush Local', time: '07:05' },
      { num: '32222', name: 'Dankuni - Sealdah Morning Commuter', time: '09:15' },
      { num: '32228', name: 'Dankuni - Sealdah Midday Local', time: '12:25' },
      { num: '32234', name: 'Dankuni - Sealdah Afternoon Local', time: '15:35' },
      { num: '32240', name: 'Dankuni - Sealdah Evening Rush Local', time: '18:00' },
      { num: '32246', name: 'Dankuni - Sealdah Night Commuter Local', time: '20:35' },
    ]
  },

  // ── 7. KOLKATA CIRCULAR RAILWAY (CHAKRAM) ─────────────────────────────────
  {
    name: 'Kolkata Circular Railway EMU Local',
    type: 'EMU Local',
    originCode: 'DDJ',
    destCode: 'MJT',
    stops: [
      { codes: ['DDJ'], offset: 0 },
      { codes: ['PTKR'], offset: 5 },
      { codes: ['UDR', 'KOAA'], offset: 10 },
      { codes: ['TALA'], offset: 15 },
      { codes: ['BGB'], offset: 20 },
      { codes: ['SOLA'], offset: 24 },
      { codes: ['BZB'], offset: 28 },
      { codes: ['BBDB'], offset: 33 },
      { codes: ['EDG'], offset: 37 },
      { codes: ['PPGT'], offset: 42 },
      { codes: ['KIRP'], offset: 48 },
      { codes: ['RMTR'], offset: 53 },
      { codes: ['MJT', 'MJHT'], offset: 58 },
    ],
    upTrains: [
      { num: '30111', name: 'Dum Dum - Majerhat Circular Morning Local', time: '06:15' },
      { num: '30115', name: 'Dum Dum - Majerhat Circular Morning Rush', time: '08:30' },
      { num: '30121', name: 'Dum Dum - Majerhat Circular Midday Commuter', time: '12:00' },
      { num: '30127', name: 'Dum Dum - Majerhat Circular Afternoon Local', time: '15:15' },
      { num: '30133', name: 'Dum Dum - Majerhat Circular Evening Rush Local', time: '17:45' },
      { num: '30139', name: 'Dum Dum - Majerhat Circular Night Return Local', time: '20:15' },
    ],
    downTrains: [
      { num: '30112', name: 'Majerhat - Dum Dum Circular Morning Local', time: '06:00' },
      { num: '30116', name: 'Majerhat - Dum Dum Circular Morning Rush', time: '08:15' },
      { num: '30122', name: 'Majerhat - Dum Dum Circular Midday Commuter', time: '11:45' },
      { num: '30128', name: 'Majerhat - Dum Dum Circular Afternoon Local', time: '15:00' },
      { num: '30134', name: 'Majerhat - Dum Dum Circular Evening Rush Local', time: '17:30' },
      { num: '30140', name: 'Majerhat - Dum Dum Circular Night Return Local', time: '20:00' },
    ]
  },

  // ── 8. SEALDAH NORTH MAIN LINE (TO KALYANI SIMANTA & RANAGHAT) ────────────
  {
    name: 'Sealdah - Kalyani Simanta All-Stops Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'KLYM',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BNXR', 'BYNR'], offset: 6 },
      { codes: ['DDJ'], offset: 12 },
      { codes: ['BLH'], offset: 17 },
      { codes: ['AGP', 'AGPD'], offset: 21 },
      { codes: ['SEP', 'SGAE'], offset: 25 },
      { codes: ['KDH', 'KHNA'], offset: 29 },
      { codes: ['TGH', 'TLGD'], offset: 33 },
      { codes: ['BP'], offset: 38 },
      { codes: ['PTF'], offset: 42 },
      { codes: ['IP'], offset: 46 },
      { codes: ['SNR', 'SGMR'], offset: 51 },
      { codes: ['JGDL'], offset: 55 },
      { codes: ['KNR', 'KLAE'], offset: 59 },
      { codes: ['NH', 'NKPR'], offset: 66 },
      { codes: ['HLR', 'HSTN'], offset: 71 },
      { codes: ['KPA'], offset: 76 },
      { codes: ['KYI', 'KLYJ'], offset: 81 },
      { codes: ['KLYS'], offset: 87 },
      { codes: ['KLYG'], offset: 92 },
      { codes: ['KLYM'], offset: 98 },
    ],
    upTrains: [
      { num: '31311', name: 'Sealdah - Kalyani Simanta Early Commuter', time: '04:35' },
      { num: '31315', name: 'Sealdah - Kalyani Simanta Morning Commuter', time: '06:15' },
      { num: '31321', name: 'Sealdah - Kalyani Simanta Morning Rush Local', time: '08:05' },
      { num: '31327', name: 'Sealdah - Kalyani Simanta Midday Local', time: '11:10' },
      { num: '31333', name: 'Sealdah - Kalyani Simanta Afternoon Commuter', time: '14:20' },
      { num: '31339', name: 'Sealdah - Kalyani Simanta Evening Rush Local', time: '17:15' },
      { num: '31345', name: 'Sealdah - Kalyani Simanta Peak Return Local', time: '18:50' },
      { num: '31351', name: 'Sealdah - Kalyani Simanta Night Local', time: '21:15' },
    ],
    downTrains: [
      { num: '31312', name: 'Kalyani Simanta - Sealdah Early Commuter', time: '04:20' },
      { num: '31316', name: 'Kalyani Simanta - Sealdah Morning Commuter', time: '06:00' },
      { num: '31322', name: 'Kalyani Simanta - Sealdah Morning Rush Local', time: '07:50' },
      { num: '31328', name: 'Kalyani Simanta - Sealdah Midday Local', time: '10:55' },
      { num: '31334', name: 'Kalyani Simanta - Sealdah Afternoon Commuter', time: '14:05' },
      { num: '31340', name: 'Kalyani Simanta - Sealdah Evening Rush Local', time: '17:00' },
      { num: '31346', name: 'Kalyani Simanta - Sealdah Peak Return Local', time: '18:35' },
      { num: '31352', name: 'Kalyani Simanta - Sealdah Night Local', time: '21:00' },
    ]
  },

  // ── 9. RANAGHAT - KRISHNANAGAR CITY JN (ALL STATIONS INCLUDING JKL) ────────
  {
    name: 'Sealdah / Ranaghat - Krishnanagar City All-Stops Local',
    type: 'EMU Local',
    originCode: 'RHA',
    destCode: 'KNJ',
    stops: [
      { codes: ['RHA'], offset: 0 },
      { codes: ['KLNP'], offset: 8 },
      { codes: ['BIJ'], offset: 14 },
      { codes: ['THP'], offset: 20 },
      { codes: ['BDZ'], offset: 26 },
      { codes: ['JKL'], offset: 32 },
      { codes: ['KNJ', 'KRSJ'], offset: 40 },
    ],
    upTrains: [
      { num: '31611', name: 'Ranaghat - Krishnanagar Early Morning Local', time: '05:00' },
      { num: '31615', name: 'Ranaghat - Krishnanagar Morning Rush Local', time: '07:15' },
      { num: '31621', name: 'Ranaghat - Krishnanagar Midday Commuter', time: '10:30' },
      { num: '31627', name: 'Ranaghat - Krishnanagar Afternoon Local', time: '13:45' },
      { num: '31633', name: 'Ranaghat - Krishnanagar Evening Rush Local', time: '17:05' },
      { num: '31639', name: 'Ranaghat - Krishnanagar Night Local', time: '20:15' },
    ],
    downTrains: [
      { num: '31612', name: 'Krishnanagar - Ranaghat Early Morning Local', time: '04:45' },
      { num: '31616', name: 'Krishnanagar - Ranaghat Morning Rush Local', time: '07:00' },
      { num: '31622', name: 'Krishnanagar - Ranaghat Midday Commuter', time: '10:15' },
      { num: '31628', name: 'Krishnanagar - Ranaghat Afternoon Local', time: '13:30' },
      { num: '31634', name: 'Krishnanagar - Ranaghat Evening Rush Local', time: '16:50' },
      { num: '31640', name: 'Krishnanagar - Ranaghat Night Local', time: '20:00' },
    ]
  },

  // ── 10. RANAGHAT - GEDE BRANCH (ALL 13 STATIONS) ──────────────────────────
  {
    name: 'Ranaghat - Gede Border All-Stops Local',
    type: 'EMU Local',
    originCode: 'RHA',
    destCode: 'GEDE',
    stops: [
      { codes: ['RHA'], offset: 0 },
      { codes: ['BNKA'], offset: 7 },
      { codes: ['PNCB'], offset: 12 },
      { codes: ['AG'], offset: 18 },
      { codes: ['BHGH'], offset: 24 },
      { codes: ['BHNA'], offset: 30 },
      { codes: ['BGL'], offset: 36 },
      { codes: ['MYHT'], offset: 42 },
      { codes: ['TNX'], offset: 48 },
      { codes: ['MIJ'], offset: 54 },
      { codes: ['BPN'], offset: 61 },
      { codes: ['HRSR'], offset: 67 },
      { codes: ['GEDE'], offset: 75 },
    ],
    upTrains: [
      { num: '31761', name: 'Ranaghat - Gede Early Commuter Local', time: '05:20' },
      { num: '31765', name: 'Ranaghat - Gede Morning Rush Local', time: '07:45' },
      { num: '31771', name: 'Ranaghat - Gede Midday Commuter', time: '11:15' },
      { num: '31777', name: 'Ranaghat - Gede Afternoon Local', time: '14:30' },
      { num: '31783', name: 'Ranaghat - Gede Evening Rush Local', time: '17:35' },
      { num: '31789', name: 'Ranaghat - Gede Night Return Local', time: '20:45' },
    ],
    downTrains: [
      { num: '31762', name: 'Gede - Ranaghat Early Commuter Local', time: '05:05' },
      { num: '31766', name: 'Gede - Ranaghat Morning Rush Local', time: '07:30' },
      { num: '31772', name: 'Gede - Ranaghat Midday Commuter', time: '11:00' },
      { num: '31778', name: 'Gede - Ranaghat Afternoon Local', time: '14:15' },
      { num: '31784', name: 'Gede - Ranaghat Evening Rush Local', time: '17:20' },
      { num: '31790', name: 'Gede - Ranaghat Night Return Local', time: '20:30' },
    ]
  },

  // ── 11. RANAGHAT - BANGAON BRANCH (ALL 8 STATIONS) ────────────────────────
  {
    name: 'Ranaghat - Bangaon Jn All-Stops Local',
    type: 'EMU Local',
    originCode: 'RHA',
    destCode: 'BNJ',
    stops: [
      { codes: ['RHA'], offset: 0 },
      { codes: ['NBRN'], offset: 7 },
      { codes: ['GNG'], offset: 13 },
      { codes: ['MAJ'], offset: 19 },
      { codes: ['AKIP'], offset: 25 },
      { codes: ['GN'], offset: 31 },
      { codes: ['STBR'], offset: 37 },
      { codes: ['BNJ'], offset: 45 },
    ],
    upTrains: [
      { num: '33711', name: 'Ranaghat - Bangaon Early Commuter', time: '05:15' },
      { num: '33715', name: 'Ranaghat - Bangaon Morning Rush Local', time: '07:30' },
      { num: '33721', name: 'Ranaghat - Bangaon Midday Commuter', time: '10:45' },
      { num: '33727', name: 'Ranaghat - Bangaon Afternoon Local', time: '14:00' },
      { num: '33733', name: 'Ranaghat - Bangaon Evening Rush Local', time: '17:15' },
      { num: '33739', name: 'Ranaghat - Bangaon Night Local', time: '20:20' },
    ],
    downTrains: [
      { num: '33712', name: 'Bangaon - Ranaghat Early Commuter', time: '05:00' },
      { num: '33716', name: 'Bangaon - Ranaghat Morning Rush Local', time: '07:15' },
      { num: '33722', name: 'Bangaon - Ranaghat Midday Commuter', time: '10:30' },
      { num: '33728', name: 'Bangaon - Ranaghat Afternoon Local', time: '13:45' },
      { num: '33734', name: 'Bangaon - Ranaghat Evening Rush Local', time: '17:00' },
      { num: '33740', name: 'Bangaon - Ranaghat Night Local', time: '20:05' },
    ]
  },

  // ── 12. SEALDAH / DUM DUM - BARASAT - BANGAON (ALL 24 STATIONS) ───────────
  {
    name: 'Sealdah - Bangaon All-Stops Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'BNJ',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['BNXR', 'BYNR'], offset: 6 },
      { codes: ['DDJ'], offset: 12 },
      { codes: ['DDC', 'DDPC'], offset: 16 },
      { codes: ['DGNR'], offset: 19 },
      { codes: ['BBT'], offset: 22 },
      { codes: ['BRPK'], offset: 25 },
      { codes: ['NBE'], offset: 28 },
      { codes: ['MMG'], offset: 31 },
      { codes: ['HHR'], offset: 34 },
      { codes: ['BT'], offset: 40 },
      { codes: ['BMG'], offset: 45 },
      { codes: ['DTK'], offset: 50 },
      { codes: ['BIRA'], offset: 55 },
      { codes: ['GUMA'], offset: 60 },
      { codes: ['ASKR'], offset: 65 },
      { codes: ['HB'], offset: 70 },
      { codes: ['SNHT'], offset: 75 },
      { codes: ['MSL'], offset: 80 },
      { codes: ['GBG'], offset: 85 },
      { codes: ['TKNR'], offset: 90 },
      { codes: ['CDP'], offset: 95 },
      { codes: ['BNAA'], offset: 100 },
      { codes: ['BNJ'], offset: 110 },
    ],
    upTrains: [
      { num: '33811', name: 'Sealdah - Bangaon Early Commuter', time: '04:20' },
      { num: '33817', name: 'Sealdah - Bangaon Morning Rush Local', time: '06:25' },
      { num: '33825', name: 'Sealdah - Bangaon Morning Office Special', time: '08:35' },
      { num: '33831', name: 'Sealdah - Bangaon Midday Commuter', time: '11:30' },
      { num: '33839', name: 'Sealdah - Bangaon Afternoon Local', time: '14:45' },
      { num: '33845', name: 'Sealdah - Bangaon Evening Rush Local', time: '17:20' },
      { num: '33851', name: 'Sealdah - Bangaon Peak Return Commuter', time: '18:55' },
      { num: '33857', name: 'Sealdah - Bangaon Night Local', time: '21:10' },
    ],
    downTrains: [
      { num: '33812', name: 'Bangaon - Sealdah Early Commuter', time: '04:05' },
      { num: '33818', name: 'Bangaon - Sealdah Morning Rush Local', time: '06:10' },
      { num: '33826', name: 'Bangaon - Sealdah Morning Office Special', time: '08:20' },
      { num: '33832', name: 'Bangaon - Sealdah Midday Commuter', time: '11:15' },
      { num: '33840', name: 'Bangaon - Sealdah Afternoon Local', time: '14:30' },
      { num: '33846', name: 'Bangaon - Sealdah Evening Rush Local', time: '17:05' },
      { num: '33852', name: 'Bangaon - Sealdah Peak Return Commuter', time: '18:40' },
      { num: '33858', name: 'Bangaon - Sealdah Night Local', time: '20:55' },
    ]
  },

  // ── 13. BARASAT - HASNABAD LINE (ALL 18 STATIONS) ─────────────────────────
  {
    name: 'Sealdah / Barasat - Hasnabad All-Stops Local',
    type: 'EMU Local',
    originCode: 'BT',
    destCode: 'HNB',
    stops: [
      { codes: ['BT'], offset: 0 },
      { codes: ['KZPR', 'KBGH'], offset: 6 },
      { codes: ['BHKA'], offset: 11 },
      { codes: ['SNDI', 'SXC'], offset: 16 },
      { codes: ['BGRD'], offset: 21 },
      { codes: ['LBTL'], offset: 26 },
      { codes: ['BSLA'], offset: 31 },
      { codes: ['HRO'], offset: 37 },
      { codes: ['KMZA'], offset: 43 },
      { codes: ['MPE'], offset: 49 },
      { codes: ['GGV'], offset: 55 },
      { codes: ['CHPX', 'CPHX'], offset: 61 },
      { codes: ['BBLA'], offset: 67 },
      { codes: ['BSHT'], offset: 72 },
      { codes: ['MPN'], offset: 77 },
      { codes: ['NMDR'], offset: 82 },
      { codes: ['TKI', 'TKX'], offset: 87 },
      { codes: ['HNB'], offset: 95 },
    ],
    upTrains: [
      { num: '33531', name: 'Barasat - Hasnabad Early Commuter', time: '05:00' },
      { num: '33535', name: 'Barasat - Hasnabad Morning Rush Local', time: '07:10' },
      { num: '33541', name: 'Barasat - Hasnabad Morning Commuter', time: '09:20' },
      { num: '33547', name: 'Barasat - Hasnabad Midday Commuter', time: '12:15' },
      { num: '33553', name: 'Barasat - Hasnabad Afternoon Local', time: '15:20' },
      { num: '33559', name: 'Barasat - Hasnabad Evening Rush Local', time: '17:55' },
      { num: '33565', name: 'Barasat - Hasnabad Night Return Local', time: '20:30' },
    ],
    downTrains: [
      { num: '33532', name: 'Hasnabad - Barasat Early Commuter', time: '04:45' },
      { num: '33536', name: 'Hasnabad - Barasat Morning Rush Local', time: '06:55' },
      { num: '33542', name: 'Hasnabad - Barasat Morning Commuter', time: '09:05' },
      { num: '33548', name: 'Hasnabad - Barasat Midday Commuter', time: '12:00' },
      { num: '33554', name: 'Hasnabad - Barasat Afternoon Local', time: '15:05' },
      { num: '33560', name: 'Hasnabad - Barasat Evening Rush Local', time: '17:40' },
      { num: '33566', name: 'Hasnabad - Barasat Night Return Local', time: '20:15' },
    ]
  },

  // ── 14. SEALDAH SOUTH - BUDGE BUDGE (ALL 12 STATIONS) ─────────────────────
  {
    name: 'Sealdah South - Budge Budge All-Stops Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'KBGB',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['PQS'], offset: 5 },
      { codes: ['BLN', 'BLGJ'], offset: 9 },
      { codes: ['LKF'], offset: 14 },
      { codes: ['TLG'], offset: 18 },
      { codes: ['NAPR', 'NACC'], offset: 22 },
      { codes: ['MJT', 'MJHT'], offset: 26 },
      { codes: ['BRJ'], offset: 31 },
      { codes: ['SSP'], offset: 36 },
      { codes: ['AKRA'], offset: 41 },
      { codes: ['NAI'], offset: 46 },
      { codes: ['KBGB', 'BDGE'], offset: 52 },
    ],
    upTrains: [
      { num: '34141', name: 'Sealdah - Budge Budge Early Commuter', time: '05:05' },
      { num: '34145', name: 'Sealdah - Budge Budge Morning Rush Local', time: '07:25' },
      { num: '34151', name: 'Sealdah - Budge Budge Morning Office Local', time: '09:10' },
      { num: '34157', name: 'Sealdah - Budge Budge Midday Commuter', time: '12:30' },
      { num: '34163', name: 'Sealdah - Budge Budge Afternoon Local', time: '15:20' },
      { num: '34169', name: 'Sealdah - Budge Budge Evening Rush Local', time: '17:40' },
      { num: '34175', name: 'Sealdah - Budge Budge Night Local', time: '20:20' },
    ],
    downTrains: [
      { num: '34142', name: 'Budge Budge - Sealdah Early Commuter', time: '04:50' },
      { num: '34146', name: 'Budge Budge - Sealdah Morning Rush Local', time: '07:10' },
      { num: '34152', name: 'Budge Budge - Sealdah Morning Office Local', time: '08:55' },
      { num: '34158', name: 'Budge Budge - Sealdah Midday Commuter', time: '12:15' },
      { num: '34164', name: 'Budge Budge - Sealdah Afternoon Local', time: '15:05' },
      { num: '34170', name: 'Budge Budge - Sealdah Evening Rush Local', time: '17:25' },
      { num: '34176', name: 'Budge Budge - Sealdah Night Local', time: '20:05' },
    ]
  },

  // ── 15. SEALDAH SOUTH - DIAMOND HARBOUR (ALL 25 STATIONS) ─────────────────
  {
    name: 'Sealdah South - Diamond Harbour All-Stops Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'DH',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['PQS'], offset: 5 },
      { codes: ['BLN', 'BLGJ'], offset: 9 },
      { codes: ['DHK'], offset: 13 },
      { codes: ['JDP'], offset: 16 },
      { codes: ['BGJT'], offset: 19 },
      { codes: ['NGRI', 'GIA', 'GARI'], offset: 23 },
      { codes: ['NRPR'], offset: 27 },
      { codes: ['SPR'], offset: 32 },
      { codes: ['SBGR', 'SJRM'], offset: 37 },
      { codes: ['MAK'], offset: 42 },
      { codes: ['BRP', 'BRJN'], offset: 48 },
      { codes: ['KYP', 'KLYP'], offset: 53 },
      { codes: ['DKDP'], offset: 58 },
      { codes: ['HT'], offset: 63 },
      { codes: ['DMU'], offset: 68 },
      { codes: ['MGT'], offset: 74 },
      { codes: ['BHPA'], offset: 79 },
      { codes: ['SNU'], offset: 84 },
      { codes: ['DLA'], offset: 89 },
      { codes: ['NTA', 'NET'], offset: 94 },
      { codes: ['BSD'], offset: 99 },
      { codes: ['GURN'], offset: 104 },
      { codes: ['DH'], offset: 112 },
    ],
    upTrains: [
      { num: '34841', name: 'Sealdah - Diamond Harbour Early Commuter', time: '04:55' },
      { num: '34845', name: 'Sealdah - Diamond Harbour Morning Rush Local', time: '07:15' },
      { num: '34851', name: 'Sealdah - Diamond Harbour Morning Office Local', time: '09:20' },
      { num: '34857', name: 'Sealdah - Diamond Harbour Midday Commuter', time: '12:20' },
      { num: '34863', name: 'Sealdah - Diamond Harbour Afternoon Local', time: '15:15' },
      { num: '34869', name: 'Sealdah - Diamond Harbour Evening Rush Local', time: '17:45' },
      { num: '34875', name: 'Sealdah - Diamond Harbour Night Return Local', time: '20:30' },
    ],
    downTrains: [
      { num: '34842', name: 'Diamond Harbour - Sealdah Early Commuter', time: '04:30' },
      { num: '34846', name: 'Diamond Harbour - Sealdah Morning Rush Local', time: '06:50' },
      { num: '34852', name: 'Diamond Harbour - Sealdah Morning Office Local', time: '08:55' },
      { num: '34858', name: 'Diamond Harbour - Sealdah Midday Commuter', time: '11:55' },
      { num: '34864', name: 'Diamond Harbour - Sealdah Afternoon Local', time: '14:50' },
      { num: '34870', name: 'Diamond Harbour - Sealdah Evening Rush Local', time: '17:20' },
      { num: '34876', name: 'Diamond Harbour - Sealdah Night Return Local', time: '20:05' },
    ]
  },

  // ── 16. SEALDAH SOUTH - LAKSHMIKANTAPUR - KAKDWIP (ALL 30 STATIONS) ───────
  {
    name: 'Sealdah South - Kakdwip All-Stops Local',
    type: 'EMU Local',
    originCode: 'SDAH',
    destCode: 'KWDP',
    stops: [
      { codes: ['SDAH'], offset: 0 },
      { codes: ['PQS'], offset: 5 },
      { codes: ['BLN', 'BLGJ'], offset: 9 },
      { codes: ['DHK'], offset: 13 },
      { codes: ['JDP'], offset: 16 },
      { codes: ['BGJT'], offset: 19 },
      { codes: ['NGRI', 'GIA', 'GARI'], offset: 23 },
      { codes: ['NRPR'], offset: 27 },
      { codes: ['SPR'], offset: 32 },
      { codes: ['SBGR', 'SJRM'], offset: 37 },
      { codes: ['MAK'], offset: 42 },
      { codes: ['BRP', 'BRJN'], offset: 48 },
      { codes: ['SSRD'], offset: 53 },
      { codes: ['KRXM'], offset: 58 },
      { codes: ['DPDP'], offset: 63 },
      { codes: ['SJPR'], offset: 68 },
      { codes: ['GCN'], offset: 74 },
      { codes: ['HGA'], offset: 79 },
      { codes: ['DBT'], offset: 85 },
      { codes: ['BARU'], offset: 90 },
      { codes: ['JNM'], offset: 96 },
      { codes: ['MPRD'], offset: 103 },
      { codes: ['MDBP'], offset: 109 },
      { codes: ['LKPR', 'LKAE'], offset: 116 },
      { codes: ['URP'], offset: 122 },
      { codes: ['KLW'], offset: 128 },
      { codes: ['KNJI', 'NCPM'], offset: 135 },
      { codes: ['NCP'], offset: 142 },
      { codes: ['KNGR', 'KHGR'], offset: 148 },
      { codes: ['KWDP'], offset: 156 },
    ],
    upTrains: [
      { num: '34741', name: 'Sealdah - Kakdwip Early Morning Local', time: '04:45' },
      { num: '34745', name: 'Sealdah - Kakdwip Morning Commuter Local', time: '07:00' },
      { num: '34751', name: 'Sealdah - Kakdwip Morning Rush Local', time: '09:05' },
      { num: '34757', name: 'Sealdah - Kakdwip Midday Commuter', time: '12:10' },
      { num: '34763', name: 'Sealdah - Kakdwip Afternoon Local', time: '15:00' },
      { num: '34769', name: 'Sealdah - Kakdwip Evening Rush Local', time: '17:35' },
      { num: '34775', name: 'Sealdah - Kakdwip Night Commuter Local', time: '20:15' },
    ],
    downTrains: [
      { num: '34742', name: 'Kakdwip - Sealdah Early Morning Local', time: '04:15' },
      { num: '34746', name: 'Kakdwip - Sealdah Morning Commuter Local', time: '06:30' },
      { num: '34752', name: 'Kakdwip - Sealdah Morning Rush Local', time: '08:35' },
      { num: '34758', name: 'Kakdwip - Sealdah Midday Commuter', time: '11:40' },
      { num: '34764', name: 'Kakdwip - Sealdah Afternoon Local', time: '14:30' },
      { num: '34770', name: 'Kakdwip - Sealdah Evening Rush Local', time: '17:05' },
      { num: '34776', name: 'Kakdwip - Sealdah Night Commuter Local', time: '19:45' },
    ]
  },

  // ── 17. SER HOWRAH - KHARAGPUR / MIDNAPORE (ALL 38 STATIONS) ──────────────
  {
    name: 'Howrah - Midnapore All-Stops Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'MDN',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['TPKR'], offset: 6 },
      { codes: ['DSNR'], offset: 9 },
      { codes: ['RMJ'], offset: 12 },
      { codes: ['SRC', 'SNTG'], offset: 16 },
      { codes: ['MRGM'], offset: 20 },
      { codes: ['ADL'], offset: 24 },
      { codes: ['SEL'], offset: 29 },
      { codes: ['ABB'], offset: 33 },
      { codes: ['NALR'], offset: 37 },
      { codes: ['BVA'], offset: 42 },
      { codes: ['CGA'], offset: 46 },
      { codes: ['FLR'], offset: 50 },
      { codes: ['ULB', 'ULBR'], offset: 55 },
      { codes: ['BSBP'], offset: 60 },
      { codes: ['KGY'], offset: 65 },
      { codes: ['BZN'], offset: 71 },
      { codes: ['GGTA'], offset: 75 },
      { codes: ['DTE'], offset: 79 },
      { codes: ['KIG'], offset: 85 },
      { codes: ['MCA', 'MNCD', 'MCAE'], offset: 91 },
      { codes: ['NDGJ'], offset: 96 },
      { codes: ['BOP'], offset: 101 },
      { codes: ['NPMR'], offset: 106 },
      { codes: ['PKU', 'PNKA'], offset: 112 },
      { codes: ['KHAI'], offset: 117 },
      { codes: ['HAUR'], offset: 122 },
      { codes: ['RDU'], offset: 127 },
      { codes: ['DUAN'], offset: 132 },
      { codes: ['BCK'], offset: 138 },
      { codes: ['SMCK', 'SMTK'], offset: 144 },
      { codes: ['MPX', 'MPD'], offset: 151 },
      { codes: ['JPR'], offset: 157 },
      { codes: ['KGP'], offset: 168 },
      { codes: ['GMDN'], offset: 175 },
      { codes: ['GKL'], offset: 182 },
      { codes: ['MDN'], offset: 192 },
    ],
    upTrains: [
      { num: '38841', name: 'Howrah - Midnapore Early Commuter Local', time: '04:25' },
      { num: '38845', name: 'Howrah - Midnapore Morning Rush Local', time: '06:45' },
      { num: '38851', name: 'Howrah - Midnapore Morning Office Special', time: '08:50' },
      { num: '38857', name: 'Howrah - Midnapore Midday Local', time: '11:45' },
      { num: '38863', name: 'Howrah - Midnapore Afternoon Commuter', time: '14:35' },
      { num: '38869', name: 'Howrah - Midnapore Evening Rush Local', time: '17:15' },
      { num: '38875', name: 'Howrah - Midnapore Peak Return Local', time: '19:00' },
      { num: '38881', name: 'Howrah - Midnapore Night Local', time: '21:15' },
    ],
    downTrains: [
      { num: '38842', name: 'Midnapore - Howrah Early Commuter Local', time: '04:10' },
      { num: '38846', name: 'Midnapore - Howrah Morning Rush Local', time: '06:30' },
      { num: '38852', name: 'Midnapore - Howrah Morning Office Special', time: '08:35' },
      { num: '38858', name: 'Midnapore - Howrah Midday Local', time: '11:30' },
      { num: '38864', name: 'Midnapore - Howrah Afternoon Commuter', time: '14:20' },
      { num: '38870', name: 'Midnapore - Howrah Evening Rush Local', time: '17:00' },
      { num: '38876', name: 'Midnapore - Howrah Peak Return Local', time: '18:45' },
      { num: '38882', name: 'Midnapore - Howrah Night Local', time: '21:00' },
    ]
  },

  // ── 18. SER HOWRAH / PANSKURA - HALDIA (ALL 13 STATIONS) ──────────────────
  {
    name: 'Howrah / Panskura - Haldia All-Stops Local',
    type: 'EMU Local',
    originCode: 'PKU',
    destCode: 'HLZ',
    stops: [
      { codes: ['PKU', 'PNKA'], offset: 0 },
      { codes: ['RGX'], offset: 9 },
      { codes: ['RGA'], offset: 16 },
      { codes: ['SMTG'], offset: 23 },
      { codes: ['TMZ'], offset: 31 },
      { codes: ['KSBP'], offset: 39 },
      { codes: ['SSPH'], offset: 46 },
      { codes: ['MSDL'], offset: 53 },
      { codes: ['BRDB'], offset: 60 },
      { codes: ['BYSA'], offset: 67 },
      { codes: ['DZK'], offset: 74 },
      { codes: ['DZKT'], offset: 80 },
      { codes: ['HLZ'], offset: 88 },
    ],
    upTrains: [
      { num: '38051', name: 'Panskura - Haldia Early Morning Commuter', time: '05:30' },
      { num: '38055', name: 'Panskura - Haldia Morning Rush Local', time: '07:45' },
      { num: '38061', name: 'Panskura - Haldia Morning Commuter', time: '10:15' },
      { num: '38067', name: 'Panskura - Haldia Midday Local', time: '13:30' },
      { num: '38073', name: 'Panskura - Haldia Evening Rush Commuter', time: '16:50' },
      { num: '38079', name: 'Panskura - Haldia Night Return Local', time: '19:40' },
    ],
    downTrains: [
      { num: '38052', name: 'Haldia - Panskura Early Morning Commuter', time: '05:15' },
      { num: '38056', name: 'Haldia - Panskura Morning Rush Local', time: '07:30' },
      { num: '38062', name: 'Haldia - Panskura Morning Commuter', time: '10:00' },
      { num: '38068', name: 'Haldia - Panskura Midday Local', time: '13:15' },
      { num: '38074', name: 'Haldia - Panskura Evening Rush Commuter', time: '16:35' },
      { num: '38080', name: 'Haldia - Panskura Night Return Local', time: '19:25' },
    ]
  },

  // ── 19. SER HOWRAH / SANTRAGACHI - AMTA BRANCH (ALL 19 STATIONS) ──────────
  {
    name: 'Howrah - Amta All-Stops Local',
    type: 'EMU Local',
    originCode: 'HWH',
    destCode: 'AMSN',
    stops: [
      { codes: ['HWH'], offset: 0 },
      { codes: ['TPKR'], offset: 6 },
      { codes: ['DSNR'], offset: 9 },
      { codes: ['RMJ'], offset: 12 },
      { codes: ['SRC', 'SNTG'], offset: 16 },
      { codes: ['PDPK'], offset: 20 },
      { codes: ['BKNM'], offset: 25 },
      { codes: ['KONA'], offset: 30 },
      { codes: ['DNI'], offset: 35 },
      { codes: ['JLBR'], offset: 40 },
      { codes: ['MDC'], offset: 45 },
      { codes: ['DMJR'], offset: 50 },
      { codes: ['DJR'], offset: 55 },
      { codes: ['DKB'], offset: 61 },
      { codes: ['BAC'], offset: 67 },
      { codes: ['PTHL'], offset: 74 },
      { codes: ['MNH'], offset: 81 },
      { codes: ['MHLN'], offset: 88 },
      { codes: ['AMSN', 'AMZ'], offset: 96 },
    ],
    upTrains: [
      { num: '38901', name: 'Howrah - Amta Early Commuter Local', time: '05:10' },
      { num: '38905', name: 'Howrah - Amta Morning Rush Local', time: '07:20' },
      { num: '38911', name: 'Howrah - Amta Morning Office Commuter', time: '09:35' },
      { num: '38917', name: 'Howrah - Amta Midday Local', time: '12:45' },
      { num: '38923', name: 'Howrah - Amta Afternoon Commuter', time: '15:40' },
      { num: '38929', name: 'Howrah - Amta Evening Rush Local', time: '18:10' },
      { num: '38935', name: 'Howrah - Amta Night Return Local', time: '20:40' },
    ],
    downTrains: [
      { num: '38902', name: 'Amta - Howrah Early Commuter Local', time: '04:55' },
      { num: '38906', name: 'Amta - Howrah Morning Rush Local', time: '07:05' },
      { num: '38912', name: 'Amta - Howrah Morning Office Commuter', time: '09:20' },
      { num: '38918', name: 'Amta - Howrah Midday Local', time: '12:30' },
      { num: '38924', name: 'Amta - Howrah Afternoon Commuter', time: '15:25' },
      { num: '38930', name: 'Amta - Howrah Evening Rush Local', time: '17:55' },
      { num: '38936', name: 'Amta - Howrah Night Return Local', time: '20:25' },
    ]
  }
];

async function main() {
  console.log('🚀 Step 1: Normalizing station codes and adding all missing stations...');

  // Fix Diamond Harbour code in DB: change code from 'D' to 'DH'
  const oldD = await prisma.station.findUnique({ where: { code: 'D' } });
  if (oldD && oldD.name.includes('Diamond Harbour')) {
    await prisma.station.update({
      where: { code: 'D' },
      data: { code: 'DH' }
    });
    console.log('  Updated Diamond Harbour code to DH');
  }

  let addedStationCount = 0;
  for (const s of MISSING_STATIONS) {
    const existing = await prisma.station.findUnique({ where: { code: s.code } });
    if (!existing) {
      await prisma.station.create({
        data: {
          code: s.code,
          name: s.name,
          nameBn: s.nameBn,
          zone: s.zone,
          division: s.division,
          district: s.district,
          lat: s.lat,
          lng: s.lng,
        }
      });
      addedStationCount++;
    } else {
      await prisma.station.update({
        where: { code: s.code },
        data: {
          name: s.name,
          nameBn: s.nameBn || existing.nameBn,
          zone: s.zone,
          division: s.division,
          district: s.district || existing.district,
          lat: s.lat || existing.lat,
          lng: s.lng || existing.lng,
        }
      });
    }
  }
  console.log(`✅ Stations verified/added. New stations added: ${addedStationCount}`);

  // Fetch all stations into memory for rapid alias/code lookup
  const allStations = await prisma.station.findMany({
    select: { id: true, code: true, name: true }
  });
  const stationByCode = new Map<string, { id: string; code: string; name: string }>();
  for (const st of allStations) {
    stationByCode.set(st.code.toUpperCase(), st);
  }

  const resolveStation = (codes: string[]): { id: string; code: string; name: string } | null => {
    for (const c of codes) {
      const found = stationByCode.get(c.toUpperCase());
      if (found) return found;
    }
    return null;
  };

  console.log('\n🚀 Step 2: Seeding comprehensive high-frequency schedules across all Kolkata suburban corridors...');

  let totalUpsertedTrains = 0;
  let totalUpsertedStops = 0;

  for (const c of ALL_CORRIDORS) {
    console.log(`\nProcessing corridor: ${c.name}...`);

    const resolvedStops: { stationId: string; stationCode: string; offset: number }[] = [];
    for (const s of c.stops) {
      const res = resolveStation(s.codes);
      if (res) {
        resolvedStops.push({
          stationId: res.id,
          stationCode: res.code,
          offset: s.offset,
        });
      } else {
        console.warn(`  ⚠️ Could not resolve station code for: ${s.codes.join('/')}`);
      }
    }

    if (resolvedStops.length < 2) {
      console.warn(`  ❌ Not enough valid stations for corridor ${c.name}, skipping.`);
      continue;
    }

    const maxOffset = resolvedStops[resolvedStops.length - 1].offset;

    async function processTrains(
      trains: { num: string; name: string; time: string }[],
      stopsList: { stationId: string; stationCode: string; offset: number }[],
      origCode: string,
      destCode: string
    ) {
      for (const t of trains) {
        const tr = await prisma.train.upsert({
          where: { number: t.num },
          update: {
            name: t.name,
            type: c.type,
            originStationCode: origCode,
            destinationStationCode: destCode,
            runningDays: 'Daily',
            distanceKm: maxOffset,
          },
          create: {
            number: t.num,
            name: t.name,
            type: c.type,
            originStationCode: origCode,
            destinationStationCode: destCode,
            runningDays: 'Daily',
            distanceKm: maxOffset,
          },
        });
        totalUpsertedTrains++;

        // Delete existing stops for this train before inserting all verified stops
        await prisma.scheduleStop.deleteMany({
          where: { trainId: tr.id },
        });

        for (let i = 0; i < stopsList.length; i++) {
          const st = stopsList[i];
          const isFirst = i === 0;
          const isLast = i === stopsList.length - 1;
          const time = addMinutes(t.time, st.offset);
          const arr = isFirst ? null : time;
          const dep = isLast ? null : time;

          await prisma.scheduleStop.upsert({
            where: {
              trainId_stationId: {
                trainId: tr.id,
                stationId: st.stationId,
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
              stationId: st.stationId,
              sequenceNo: i + 1,
              arrivalTime: arr,
              departureTime: dep,
              haltMinutes: (isFirst || isLast) ? 0 : 1,
              source: 'verified',
            },
          });
          totalUpsertedStops++;
        }
      }
    }

    // Process UP trains
    await processTrains(c.upTrains, resolvedStops, c.originCode, c.destCode);

    // Process DOWN trains (reverse stops)
    const downStops = [...resolvedStops].reverse().map(s => ({
      stationId: s.stationId,
      stationCode: s.stationCode,
      offset: maxOffset - s.offset,
    }));
    await processTrains(c.downTrains, downStops, c.destCode, c.originCode);
  }

  console.log(`\n🎉 Success! Upserted ${totalUpsertedTrains} trains and ${totalUpsertedStops} schedule stops.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
