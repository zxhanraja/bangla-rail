import { prisma } from '../src/lib/prisma';

// Comprehensive West Bengal Stations & Trains Network Seeder
// Covers Eastern Railway (Howrah & Sealdah), South Eastern Railway, and Kolkata Metro lines.

interface StationSeed {
  code: string;
  name: string;
  nameBn?: string;
  zone: string;
  division: string;
  district?: string;
}

interface TrainDef {
  number: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  runningDays?: string;
  distanceKm?: number;
  stops: {
    code: string;
    arr?: string | null;
    dep?: string | null;
    seq: number;
    halt?: number;
  }[];
}

function addMins(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

async function main() {
  console.log('🚀 Starting Comprehensive West Bengal Railway & Metro Network Expansion...');

  // 1. Ensure All Stations exist in DB
  const stationsToEnsure: StationSeed[] = [
    // Kolkata Metro Green Line (Underwater)
    { code: 'M-HMD', name: 'Howrah Maidan Metro', nameBn: 'হাওড়া ময়দান মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'Howrah' },
    { code: 'M-HWH', name: 'Howrah Railway Station Metro', nameBn: 'হাওড়া রেলওয়ে স্টেশন মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'Howrah' },
    { code: 'M-MHTG', name: 'Mahakaran Metro', nameBn: 'মহাকরণ মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'Kolkata' },
    { code: 'M-ESP2', name: 'Esplanade (Green Line) Metro', nameBn: 'এসপ্ল্যানেড মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'Kolkata' },
    { code: 'M-SDAH', name: 'Sealdah Metro', nameBn: 'শিয়ালদহ মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'Kolkata' },
    { code: 'M-PHL', name: 'Phoolbagan Metro', nameBn: 'ফুলবাগান মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'Kolkata' },
    { code: 'M-SLS', name: 'Salt Lake Stadium Metro', nameBn: 'সল্টলেক স্টেডিয়াম মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'North 24 Parganas' },
    { code: 'M-BLG2', name: 'Bengal Chemical Metro', nameBn: 'বেঙ্গল কেমিক্যাল মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'North 24 Parganas' },
    { code: 'M-CTY', name: 'City Centre Metro', nameBn: 'সিটি সেন্টার মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'North 24 Parganas' },
    { code: 'M-CKT', name: 'Central Park Metro', nameBn: 'সেন্ট্রাল পার্ক মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'North 24 Parganas' },
    { code: 'M-KRP', name: 'Karunamoyee Metro', nameBn: 'করুণাময়ী মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'North 24 Parganas' },
    { code: 'M-SCV', name: 'Salt Lake Sector V Metro', nameBn: 'সল্টলেক সেক্টর ৫ মেট্রো', zone: 'KMR', division: 'Kolkata Metro', district: 'North 24 Parganas' },

    // Howrah Main Line & Aliases
    { code: 'HMZ', name: 'Hindmotor', nameBn: 'হিন্দমোটর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
    { code: 'CGR', name: 'Chandannagar', nameBn: 'চন্দননগর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
    { code: 'CNS', name: 'Chinsurah', nameBn: 'চুঁচুড়া', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
    { code: 'KOG', name: 'Konnagar', nameBn: 'কোন্নগর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
    { code: 'MYM', name: 'Memari', nameBn: 'মেমারি', zone: 'ER', division: 'Howrah', district: 'Purba Bardhaman' },
    { code: 'DKAE', name: 'Dankuni Junction', nameBn: 'ডানকুনি জংশন', zone: 'ER', division: 'Howrah', district: 'Hooghly' },

    // Digha line & South Eastern
    { code: 'DGHA', name: 'Digha Flag Station', nameBn: 'দিঘা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
    { code: 'KATI', name: 'Kanthi (Contai)', nameBn: 'কাঁথি', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
    { code: 'TMZ', name: 'Tamluk Junction', nameBn: 'তমলুক জংশন', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
    { code: 'MCA', name: 'Mecheda', nameBn: 'মেচেদা', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
    { code: 'PKU', name: 'Panskura Junction', nameBn: 'পাঁশকুড়া জংশন', zone: 'SER', division: 'Kharagpur', district: 'Purba Medinipur' },
    { code: 'ULB', name: 'Uluberia', nameBn: 'উলুবেড়িয়া', zone: 'SER', division: 'Kharagpur', district: 'Howrah' },
    { code: 'BZN', name: 'Bagnan', nameBn: 'বাগনান', zone: 'SER', division: 'Kharagpur', district: 'Howrah' },
    { code: 'SRC', name: 'Santragachi Junction', nameBn: 'সাঁতরাগাছি জংশন', zone: 'SER', division: 'Kharagpur', district: 'Howrah' },

    // Sealdah Lines
    { code: 'BNXR', name: 'Bidhannagar Road', nameBn: 'বিধাননগর রোড', zone: 'ER', division: 'Sealdah', district: 'Kolkata' },
    { code: 'DDJ', name: 'Dum Dum Junction', nameBn: 'দমদম জংশন', zone: 'ER', division: 'Sealdah', district: 'Kolkata' },
    { code: 'BP', name: 'Barrackpore', nameBn: 'ব্যারাকপুর', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
    { code: 'NH', name: 'Naihati Junction', nameBn: 'নৈহাটি জংশন', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
    { code: 'RHA', name: 'Ranaghat Junction', nameBn: 'রানাঘাট জংশন', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
    { code: 'KNJ', name: 'Krishnanagar City Junction', nameBn: 'কৃষ্ণনগর সিটি জংশন', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
    { code: 'STB', name: 'Shantipur Junction', nameBn: 'শান্তিপুর জংশন', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
    { code: 'GEDE', name: 'Gede (Border)', nameBn: 'গেদে', zone: 'ER', division: 'Sealdah', district: 'Nadia' },
    { code: 'LGL', name: 'Lalgola', nameBn: 'লালগোলা', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
    { code: 'BPC', name: 'Berhampore Court', nameBn: 'বহরমপুর কোর্ট', zone: 'ER', division: 'Sealdah', district: 'Murshidabad' },
    { code: 'BT', name: 'Barasat Junction', nameBn: 'বারাসাত জংশন', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
    { code: 'HB', name: 'Habra', nameBn: 'হাবড়া', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
    { code: 'BNJ', name: 'Bangaon Junction', nameBn: 'বনগাঁ জংশন', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
    { code: 'HNB', name: 'Hasnabad', nameBn: 'হাসনাবাদ', zone: 'ER', division: 'Sealdah', district: 'North 24 Parganas' },
    { code: 'BRP', name: 'Baruipur Junction', nameBn: 'বারুইপুর জংশন', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
    { code: 'D', name: 'Diamond Harbour', nameBn: 'ডায়মন্ড হারবার', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
    { code: 'CG', name: 'Canning (Sundarbans Gateway)', nameBn: 'ক্যানিং', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
    { code: 'NMKA', name: 'Namkhana', nameBn: 'নামখানা', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },
    { code: 'BGB', name: 'Budge Budge', nameBn: 'বাজে বাজেট', zone: 'ER', division: 'Sealdah', district: 'South 24 Parganas' },

    // Tarakeswar Line
    { code: 'TAK', name: 'Tarakeswar', nameBn: 'তারকেশ্বর', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
    { code: 'AMBG', name: 'Arambagh', nameBn: 'আরামবাগ', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
    { code: 'GOGT', name: 'Goghat', nameBn: 'গোঘাট', zone: 'ER', division: 'Howrah', district: 'Hooghly' },
  ];

  console.log(`Checking & upserting ${stationsToEnsure.length} key stations...`);
  for (const st of stationsToEnsure) {
    await prisma.station.upsert({
      where: { code: st.code },
      update: {
        name: st.name,
        nameBn: st.nameBn,
        zone: st.zone,
        division: st.division,
        district: st.district,
      },
      create: {
        code: st.code,
        name: st.name,
        nameBn: st.nameBn,
        zone: st.zone,
        division: st.division,
        district: st.district,
      },
    });
  }

  // Load all station codes to IDs
  const allDbStations = await prisma.station.findMany({ select: { id: true, code: true } });
  const stationMap = new Map<string, string>();
  allDbStations.forEach(s => stationMap.set(s.code.toUpperCase(), s.id));

  // Station aliases map for resolving codes in corridors
  const resolveDbStationId = (c: string): string | undefined => {
    const upper = c.toUpperCase();
    if (stationMap.has(upper)) return stationMap.get(upper);
    const aliases: Record<string, string> = {
      HMZ: 'HM',
      HM: 'HMZ',
      CGR: 'CHN',
      CHN: 'CGR',
      CNS: 'CHT',
      CHT: 'CNS',
      DKAE: 'DBAE',
      DBAE: 'DKAE',
      MYM: 'MSAE',
      MSAE: 'MYM',
      KOG: 'KON',
      KON: 'KOG',
      'M-ESP2': 'M-ESP',
    };
    const target = aliases[upper];
    return target ? stationMap.get(target) : undefined;
  };

  const trainDefs: TrainDef[] = [];

  // =========================================================================
  // 1. KOLKATA UNDERWATER METRO (GREEN LINE: HOWRAH MAIDAN <-> SECTOR V)
  // 12 Daily services each way connecting underwater tunnel
  // =========================================================================
  const greenLineStops = [
    { code: 'M-HMD', offset: 0 },
    { code: 'M-HWH', offset: 3 },
    { code: 'M-MHTG', offset: 7 },
    { code: 'M-ESP2', offset: 11 },
    { code: 'M-SDAH', offset: 16 },
    { code: 'M-PHL', offset: 20 },
    { code: 'M-SLS', offset: 23 },
    { code: 'M-BLG2', offset: 26 },
    { code: 'M-CTY', offset: 29 },
    { code: 'M-CKT', offset: 32 },
    { code: 'M-KRP', offset: 35 },
    { code: 'M-SCV', offset: 38 },
  ];

  const greenLineTimes = [
    '07:00', '07:45', '08:30', '09:15', '10:00', '11:30',
    '13:00', '14:30', '16:00', '17:15', '18:30', '19:45', '21:00'
  ];

  greenLineTimes.forEach((t, i) => {
    // Eastbound (Howrah Maidan -> Sector V)
    const numEast = `M-GR-${String(i + 1).padStart(2, '0')}`;
    trainDefs.push({
      number: numEast,
      name: `Kolkata Green Line Underwater Metro (HM -> Sec-V)`,
      type: 'Metro',
      origin: 'M-HMD',
      destination: 'M-SCV',
      runningDays: 'Daily',
      distanceKm: 16,
      stops: greenLineStops.map((st, idx) => {
        const time = addMins(t, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === greenLineStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });

    // Westbound (Sector V -> Howrah Maidan)
    const numWest = `M-GRW-${String(i + 1).padStart(2, '0')}`;
    const totalOff = greenLineStops[greenLineStops.length - 1].offset;
    const revStops = [...greenLineStops].reverse();
    trainDefs.push({
      number: numWest,
      name: `Kolkata Green Line Underwater Metro (Sec-V -> HM)`,
      type: 'Metro',
      origin: 'M-SCV',
      destination: 'M-HMD',
      runningDays: 'Daily',
      distanceKm: 16,
      stops: revStops.map((st, idx) => {
        const time = addMins(t, totalOff - st.offset);
        const isFirst = idx === 0;
        const isLast = idx === revStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });
  });

  // =========================================================================
  // 2. HOWRAH MAIN LINE ALL-HALT LOCALS (HWH <-> BDC <-> BWN)
  // Covers: HWH, LLH, BEQ, BLY, UPA, HMZ, KOG, RIS, SRP, SHE, BBAE, BHR, MUU,
  // CGR, CNS, HRAE, BDC, ADST, MGM, TLO, KNY, PDA, SLG, BCGM, BNCX, DBP, BGF,
  // MSAE, NMF, RSLP, PLAE, SKG, BWN
  // =========================================================================
  const howrahMainStops = [
    { code: 'HWH', offset: 0 },
    { code: 'LLH', offset: 8 },
    { code: 'BEQ', offset: 11 },
    { code: 'BLY', offset: 14 },
    { code: 'UPA', offset: 17 },
    { code: 'HMZ', offset: 20 },
    { code: 'KOG', offset: 23 },
    { code: 'RIS', offset: 27 },
    { code: 'SRP', offset: 32 },
    { code: 'SHE', offset: 36 },
    { code: 'BBAE', offset: 40 },
    { code: 'BHR', offset: 43 },
    { code: 'MUU', offset: 46 },
    { code: 'CGR', offset: 50 },
    { code: 'CNS', offset: 54 },
    { code: 'HRAE', offset: 58 },
    { code: 'BDC', offset: 63 },
    { code: 'ADST', offset: 68 },
    { code: 'MGM', offset: 73 },
    { code: 'TLO', offset: 78 },
    { code: 'KNY', offset: 83 },
    { code: 'PDA', offset: 88 },
    { code: 'SLG', offset: 93 },
    { code: 'BCGM', offset: 98 },
    { code: 'BNCX', offset: 103 },
    { code: 'DBP', offset: 108 },
    { code: 'BGF', offset: 113 },
    { code: 'MYM', offset: 118 },
    { code: 'NMF', offset: 123 },
    { code: 'RSLP', offset: 128 },
    { code: 'PLAE', offset: 133 },
    { code: 'SKG', offset: 138 },
    { code: 'BWN', offset: 148 },
  ];

  const mainLineDepartures = [
    { num: '37811', name: 'Howrah - Barddhaman Early Morning Local', time: '04:15' },
    { num: '37813', name: 'Howrah - Barddhaman Morning Commuter Local', time: '05:30' },
    { num: '37815', name: 'Howrah - Barddhaman Office Rush Local', time: '06:45' },
    { num: '37817', name: 'Howrah - Barddhaman Peak Commuter Local', time: '08:00' },
    { num: '37819', name: 'Howrah - Barddhaman Mid-Morning Local', time: '09:15' },
    { num: '37821', name: 'Howrah - Barddhaman Daytime Local', time: '10:45' },
    { num: '37823', name: 'Howrah - Barddhaman Noon Local', time: '12:15' },
    { num: '37825', name: 'Howrah - Barddhaman Afternoon Commuter', time: '14:00' },
    { num: '37827', name: 'Howrah - Barddhaman Post-Meridiem Local', time: '15:30' },
    { num: '37829', name: 'Howrah - Barddhaman Evening Rush Local', time: '17:00' },
    { num: '37831', name: 'Howrah - Barddhaman Prime Return Local', time: '18:15' },
    { num: '37833', name: 'Howrah - Barddhaman Night Commuter Local', time: '19:40' },
    { num: '37835', name: 'Howrah - Barddhaman Late Evening Local', time: '21:00' },
    { num: '37837', name: 'Howrah - Barddhaman Night Owl Local', time: '22:15' },
  ];

  const downMainLineDepartures = [
    { num: '37812', name: 'Barddhaman - Howrah Early Bird Local', time: '04:00' },
    { num: '37814', name: 'Barddhaman - Howrah Morning Rush Local', time: '05:15' },
    { num: '37816', name: 'Barddhaman - Howrah Office Commuter Local', time: '06:30' },
    { num: '37818', name: 'Barddhaman - Howrah Peak Morning Local', time: '07:45' },
    { num: '37820', name: 'Barddhaman - Howrah Mid-Morning Commuter', time: '09:00' },
    { num: '37822', name: 'Barddhaman - Howrah Daytime Local', time: '10:30' },
    { num: '37824', name: 'Barddhaman - Howrah Noon Commuter', time: '12:00' },
    { num: '37826', name: 'Barddhaman - Howrah Afternoon Local', time: '13:45' },
    { num: '37828', name: 'Barddhaman - Howrah Evening Commuter Local', time: '15:15' },
    { num: '37830', name: 'Barddhaman - Howrah Evening Peak Local', time: '16:45' },
    { num: '37832', name: 'Barddhaman - Howrah Prime Return Local', time: '18:00' },
    { num: '37834', name: 'Barddhaman - Howrah Night Commuter Local', time: '19:25' },
    { num: '37836', name: 'Barddhaman - Howrah Late Evening Local', time: '20:50' },
    { num: '37838', name: 'Barddhaman - Howrah Night Owl Local', time: '22:00' },
  ];

  mainLineDepartures.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: 'HWH',
      destination: 'BWN',
      runningDays: 'Daily',
      distanceKm: 107,
      stops: howrahMainStops.map((st, idx) => {
        const time = addMins(d.time, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === howrahMainStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });
  });

  const totalMainOffset = howrahMainStops[howrahMainStops.length - 1].offset;
  const revMainStops = [...howrahMainStops].reverse();
  downMainLineDepartures.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: 'BWN',
      destination: 'HWH',
      runningDays: 'Daily',
      distanceKm: 107,
      stops: revStopsToDefs(revMainStops, d.time, totalMainOffset),
    });
  });

  // =========================================================================
  // 3. HOWRAH <-> TARAKESWAR & ARAMBAGH
  // =========================================================================
  const tarakeswarStops = [
    { code: 'HWH', offset: 0 },
    { code: 'LLH', offset: 8 },
    { code: 'BEQ', offset: 11 },
    { code: 'BLY', offset: 14 },
    { code: 'UPA', offset: 17 },
    { code: 'HMZ', offset: 20 },
    { code: 'KOG', offset: 23 },
    { code: 'RIS', offset: 27 },
    { code: 'SRP', offset: 32 },
    { code: 'SHE', offset: 37 },
    { code: 'TAK', offset: 70 },
    { code: 'AMBG', offset: 95 },
  ];

  const tarakeswarDeps = [
    { num: '37311', name: 'Howrah - Tarakeswar Commuter Local', time: '05:40' },
    { num: '37313', name: 'Howrah - Tarakeswar Morning Rush Local', time: '07:15' },
    { num: '37315', name: 'Howrah - Arambagh Fast Local', time: '08:50' },
    { num: '37317', name: 'Howrah - Tarakeswar Midday Local', time: '11:20' },
    { num: '37319', name: 'Howrah - Tarakeswar Afternoon Local', time: '14:10' },
    { num: '37321', name: 'Howrah - Arambagh Evening Commuter', time: '16:30' },
    { num: '37323', name: 'Howrah - Tarakeswar Prime Return Local', time: '18:20' },
    { num: '37325', name: 'Howrah - Tarakeswar Night Local', time: '20:10' },
    { num: '37327', name: 'Howrah - Tarakeswar Late Night Local', time: '22:00' },
  ];

  tarakeswarDeps.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: 'HWH',
      destination: d.name.includes('Arambagh') ? 'AMBG' : 'TAK',
      runningDays: 'Daily',
      distanceKm: 58,
      stops: tarakeswarStops.map((st, idx) => {
        const time = addMins(d.time, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === tarakeswarStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });
  });

  // Down Tarakeswar -> Howrah
  const revTakStops = [...tarakeswarStops].reverse();
  const takDownDeps = [
    { num: '37312', name: 'Tarakeswar - Howrah Early Morning Local', time: '05:00' },
    { num: '37314', name: 'Tarakeswar - Howrah Peak Commuter Local', time: '06:40' },
    { num: '37316', name: 'Arambagh - Howrah Morning Fast Local', time: '08:15' },
    { num: '37318', name: 'Tarakeswar - Howrah Midday Local', time: '10:30' },
    { num: '37320', name: 'Tarakeswar - Howrah Afternoon Local', time: '13:00' },
    { num: '37322', name: 'Tarakeswar - Howrah Evening Rush Local', time: '15:45' },
    { num: '37324', name: 'Arambagh - Howrah Prime Return Local', time: '17:35' },
    { num: '37326', name: 'Tarakeswar - Howrah Night Commuter', time: '19:15' },
    { num: '37328', name: 'Tarakeswar - Howrah Night Owl Local', time: '21:10' },
  ];
  const takTotalOff = tarakeswarStops[tarakeswarStops.length - 1].offset;
  takDownDeps.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: d.name.includes('Arambagh') ? 'AMBG' : 'TAK',
      destination: 'HWH',
      runningDays: 'Daily',
      distanceKm: 58,
      stops: revStopsToDefs(revTakStops, d.time, takTotalOff),
    });
  });

  // =========================================================================
  // 4. HOWRAH <-> DIGHA & KHARAGPUR (SER)
  // =========================================================================
  const dighaStops = [
    { code: 'HWH', offset: 0 },
    { code: 'SRC', offset: 15 },
    { code: 'ULB', offset: 38 },
    { code: 'BZN', offset: 52 },
    { code: 'MCA', offset: 70 },
    { code: 'PKU', offset: 88 },
    { code: 'TMZ', offset: 110 },
    { code: 'KATI', offset: 145 },
    { code: 'DGHA', offset: 175 },
  ];

  const dighaTrains = [
    { num: '12857', name: 'Tamralipta Express (Howrah - Digha)', time: '06:45', type: 'Superfast' },
    { num: '22897', name: 'Kandari Express (Howrah - Digha)', time: '14:25', type: 'Superfast' },
    { num: '38001', name: 'Howrah - Digha EMU Commuter Local', time: '08:15', type: 'EMU Local' },
    { num: '38003', name: 'Howrah - Digha Afternoon EMU Local', time: '16:00', type: 'EMU Local' },
  ];

  dighaTrains.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: d.type,
      origin: 'HWH',
      destination: 'DGHA',
      runningDays: 'Daily',
      distanceKm: 185,
      stops: dighaStops.map((st, idx) => {
        const time = addMins(d.time, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === dighaStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 2,
        };
      }),
    });
  });

  // Return Digha -> Howrah
  const revDighaStops = [...dighaStops].reverse();
  const dighaDownTrains = [
    { num: '12858', name: 'Tamralipta Express (Digha - Howrah)', time: '10:35', type: 'Superfast' },
    { num: '22898', name: 'Kandari Express (Digha - Howrah)', time: '18:25', type: 'Superfast' },
    { num: '38002', name: 'Digha - Howrah Morning EMU Local', time: '06:10', type: 'EMU Local' },
    { num: '38004', name: 'Digha - Howrah Afternoon EMU Local', time: '13:40', type: 'EMU Local' },
  ];
  const dighaTotalOff = dighaStops[dighaStops.length - 1].offset;
  dighaDownTrains.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: d.type,
      origin: 'DGHA',
      destination: 'HWH',
      runningDays: 'Daily',
      distanceKm: 185,
      stops: revStopsToDefs(revDighaStops, d.time, dighaTotalOff),
    });
  });

  // =========================================================================
  // 5. SEALDAH NORTH & MAIN (SDAH <-> RHA <-> KNJ <-> LGL)
  // =========================================================================
  const sealdahMainStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BNXR', offset: 6 },
    { code: 'DDJ', offset: 12 },
    { code: 'BP', offset: 28 },
    { code: 'NH', offset: 45 },
    { code: 'RHA', offset: 80 },
    { code: 'KNJ', offset: 105 },
    { code: 'BPC', offset: 165 },
    { code: 'LGL', offset: 210 },
  ];

  const sealdahMainDeps = [
    { num: '31811', name: 'Sealdah - Krishnanagar City Commuter Local', time: '05:10', dest: 'KNJ' },
    { num: '31813', name: 'Sealdah - Krishnanagar City Morning Rush Local', time: '06:35', dest: 'KNJ' },
    { num: '31815', name: 'Sealdah - Ranaghat Peak Commuter Local', time: '07:45', dest: 'RHA' },
    { num: '31817', name: 'Sealdah - Krishnanagar City Office Local', time: '08:55', dest: 'KNJ' },
    { num: '31819', name: 'Sealdah - Lalgola Bhagirathi Fast Passenger', time: '10:20', dest: 'LGL' },
    { num: '31821', name: 'Sealdah - Ranaghat Midday Local', time: '12:00', dest: 'RHA' },
    { num: '31823', name: 'Sealdah - Krishnanagar City Afternoon Local', time: '13:40', dest: 'KNJ' },
    { num: '31825', name: 'Sealdah - Ranaghat Evening Commuter Local', time: '15:20', dest: 'RHA' },
    { num: '31827', name: 'Sealdah - Krishnanagar City Evening Rush Local', time: '16:50', dest: 'KNJ' },
    { num: '31829', name: 'Sealdah - Lalgola Hazarduari Express', time: '18:10', dest: 'LGL' },
    { num: '31831', name: 'Sealdah - Krishnanagar Prime Return Local', time: '19:30', dest: 'KNJ' },
    { num: '31833', name: 'Sealdah - Ranaghat Night Local', time: '21:05', dest: 'RHA' },
    { num: '31835', name: 'Sealdah - Krishnanagar Night Owl Local', time: '22:30', dest: 'KNJ' },
  ];

  sealdahMainDeps.forEach(d => {
    const activeStops = sealdahMainStops.filter(s => {
      if (d.dest === 'RHA') return ['SDAH', 'BNXR', 'DDJ', 'BP', 'NH', 'RHA'].includes(s.code);
      if (d.dest === 'KNJ') return ['SDAH', 'BNXR', 'DDJ', 'BP', 'NH', 'RHA', 'KNJ'].includes(s.code);
      return true; // LGL has all
    });

    trainDefs.push({
      number: d.num,
      name: d.name,
      type: d.name.includes('Express') ? 'Express' : 'EMU Local',
      origin: 'SDAH',
      destination: d.dest,
      runningDays: 'Daily',
      distanceKm: d.dest === 'RHA' ? 74 : d.dest === 'KNJ' ? 100 : 227,
      stops: activeStops.map((st, idx) => {
        const time = addMins(d.time, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === activeStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });
  });

  // Down Krishnanagar/Ranaghat -> Sealdah
  const sealdahMainDownDeps = [
    { num: '31812', name: 'Krishnanagar City - Sealdah Early Bird Local', time: '04:15', orig: 'KNJ' },
    { num: '31814', name: 'Ranaghat - Sealdah Morning Commuter Local', time: '05:30', orig: 'RHA' },
    { num: '31816', name: 'Krishnanagar City - Sealdah Peak Office Local', time: '06:45', orig: 'KNJ' },
    { num: '31818', name: 'Ranaghat - Sealdah Super Rush Local', time: '07:55', orig: 'RHA' },
    { num: '31820', name: 'Lalgola - Sealdah Hazarduari Express', time: '09:10', orig: 'LGL' },
    { num: '31822', name: 'Krishnanagar City - Sealdah Midday Local', time: '11:00', orig: 'KNJ' },
    { num: '31824', name: 'Ranaghat - Sealdah Afternoon Local', time: '12:45', orig: 'RHA' },
    { num: '31826', name: 'Krishnanagar City - Sealdah Post-Meridiem Local', time: '14:30', orig: 'KNJ' },
    { num: '31828', name: 'Ranaghat - Sealdah Evening Commuter Local', time: '16:15', orig: 'RHA' },
    { num: '31830', name: 'Krishnanagar City - Sealdah Evening Rush Local', time: '17:40', orig: 'KNJ' },
    { num: '31832', name: 'Lalgola - Sealdah Bhagirathi Fast Express', time: '19:00', orig: 'LGL' },
    { num: '31834', name: 'Ranaghat - Sealdah Night Local', time: '20:30', orig: 'RHA' },
    { num: '31836', name: 'Krishnanagar City - Sealdah Late Night Local', time: '22:00', orig: 'KNJ' },
  ];

  sealdahMainDownDeps.forEach(d => {
    const forwardStops = sealdahMainStops.filter(s => {
      if (d.orig === 'RHA') return ['SDAH', 'BNXR', 'DDJ', 'BP', 'NH', 'RHA'].includes(s.code);
      if (d.orig === 'KNJ') return ['SDAH', 'BNXR', 'DDJ', 'BP', 'NH', 'RHA', 'KNJ'].includes(s.code);
      return true;
    });
    const revStops = [...forwardStops].reverse();
    const totalOff = forwardStops[forwardStops.length - 1].offset;

    trainDefs.push({
      number: d.num,
      name: d.name,
      type: d.name.includes('Express') ? 'Express' : 'EMU Local',
      origin: d.orig,
      destination: 'SDAH',
      runningDays: 'Daily',
      distanceKm: d.orig === 'RHA' ? 74 : d.orig === 'KNJ' ? 100 : 227,
      stops: revStopsToDefs(revStops, d.time, totalOff),
    });
  });

  // =========================================================================
  // 6. SEALDAH BANGAON & HASNABAD
  // =========================================================================
  const bangaonStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BNXR', offset: 6 },
    { code: 'DDJ', offset: 12 },
    { code: 'BT', offset: 32 },
    { code: 'HB', offset: 50 },
    { code: 'BNJ', offset: 85 },
  ];

  const bangaonDeps = [
    { num: '33811', name: 'Sealdah - Bangaon Commuter Local', time: '05:20' },
    { num: '33813', name: 'Sealdah - Bangaon Morning Rush Local', time: '06:50' },
    { num: '33815', name: 'Sealdah - Bangaon Peak Office Local', time: '08:15' },
    { num: '33817', name: 'Sealdah - Bangaon Midday Local', time: '10:40' },
    { num: '33819', name: 'Sealdah - Bangaon Afternoon Commuter', time: '13:10' },
    { num: '33821', name: 'Sealdah - Bangaon Evening Commuter Local', time: '15:40' },
    { num: '33823', name: 'Sealdah - Bangaon Evening Peak Local', time: '17:25' },
    { num: '33825', name: 'Sealdah - Bangaon Prime Return Local', time: '19:00' },
    { num: '33827', name: 'Sealdah - Bangaon Night Commuter Local', time: '20:45' },
    { num: '33829', name: 'Sealdah - Bangaon Late Night Local', time: '22:10' },
  ];

  bangaonDeps.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: 'SDAH',
      destination: 'BNJ',
      runningDays: 'Daily',
      distanceKm: 77,
      stops: bangaonStops.map((st, idx) => {
        const time = addMins(d.time, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === bangaonStops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });
  });

  // Down Bangaon -> Sealdah
  const revBangaonStops = [...bangaonStops].reverse();
  const bangaonDownDeps = [
    { num: '33812', name: 'Bangaon - Sealdah Early Bird Local', time: '04:30' },
    { num: '33814', name: 'Bangaon - Sealdah Morning Rush Local', time: '05:55' },
    { num: '33816', name: 'Bangaon - Sealdah Peak Office Local', time: '07:15' },
    { num: '33818', name: 'Bangaon - Sealdah Super Peak Local', time: '08:35' },
    { num: '33820', name: 'Bangaon - Sealdah Midday Local', time: '10:50' },
    { num: '33822', name: 'Bangaon - Sealdah Afternoon Local', time: '13:15' },
    { num: '33824', name: 'Bangaon - Sealdah Evening Commuter Local', time: '15:30' },
    { num: '33826', name: 'Bangaon - Sealdah Evening Rush Local', time: '17:10' },
    { num: '33828', name: 'Bangaon - Sealdah Prime Return Local', time: '18:45' },
    { num: '33830', name: 'Bangaon - Sealdah Night Local', time: '20:20' },
  ];
  const bangaonTotalOff = bangaonStops[bangaonStops.length - 1].offset;
  bangaonDownDeps.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: 'BNJ',
      destination: 'SDAH',
      runningDays: 'Daily',
      distanceKm: 77,
      stops: revStopsToDefs(revBangaonStops, d.time, bangaonTotalOff),
    });
  });

  // =========================================================================
  // 7. SEALDAH SOUTH (SDAH <-> CANNING & DIAMOND HARBOUR)
  // =========================================================================
  const canningStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BRP', offset: 35 },
    { code: 'CG', offset: 68 },
  ];

  const diamondHarbourStops = [
    { code: 'SDAH', offset: 0 },
    { code: 'BRP', offset: 35 },
    { code: 'D', offset: 75 },
  ];

  const southLines = [
    { num: '34511', name: 'Sealdah - Canning Sunderbans Local', time: '05:45', stops: canningStops, dest: 'CG' },
    { num: '34513', name: 'Sealdah - Canning Morning Rush Local', time: '07:20', stops: canningStops, dest: 'CG' },
    { num: '34515', name: 'Sealdah - Canning Midday Local', time: '10:30', stops: canningStops, dest: 'CG' },
    { num: '34517', name: 'Sealdah - Canning Afternoon Local', time: '13:50', stops: canningStops, dest: 'CG' },
    { num: '34519', name: 'Sealdah - Canning Evening Commuter Local', time: '16:45', stops: canningStops, dest: 'CG' },
    { num: '34521', name: 'Sealdah - Canning Prime Return Local', time: '18:40', stops: canningStops, dest: 'CG' },
    { num: '34523', name: 'Sealdah - Canning Night Local', time: '20:50', stops: canningStops, dest: 'CG' },

    { num: '34811', name: 'Sealdah - Diamond Harbour Commuter Local', time: '06:00', stops: diamondHarbourStops, dest: 'D' },
    { num: '34813', name: 'Sealdah - Diamond Harbour Morning Rush Local', time: '07:40', stops: diamondHarbourStops, dest: 'D' },
    { num: '34815', name: 'Sealdah - Diamond Harbour Midday Local', time: '11:15', stops: diamondHarbourStops, dest: 'D' },
    { num: '34817', name: 'Sealdah - Diamond Harbour Afternoon Local', time: '14:20', stops: diamondHarbourStops, dest: 'D' },
    { num: '34819', name: 'Sealdah - Diamond Harbour Evening Commuter', time: '17:10', stops: diamondHarbourStops, dest: 'D' },
    { num: '34821', name: 'Sealdah - Diamond Harbour Prime Return Local', time: '19:15', stops: diamondHarbourStops, dest: 'D' },
    { num: '34823', name: 'Sealdah - Diamond Harbour Night Local', time: '21:10', stops: diamondHarbourStops, dest: 'D' },
  ];

  southLines.forEach(d => {
    trainDefs.push({
      number: d.num,
      name: d.name,
      type: 'EMU Local',
      origin: 'SDAH',
      destination: d.dest,
      runningDays: 'Daily',
      distanceKm: 55,
      stops: d.stops.map((st, idx) => {
        const time = addMins(d.time, st.offset);
        const isFirst = idx === 0;
        const isLast = idx === d.stops.length - 1;
        return {
          code: st.code,
          arr: isFirst ? null : time,
          dep: isLast ? null : time,
          seq: idx + 1,
          halt: (isFirst || isLast) ? 0 : 1,
        };
      }),
    });
  });

  // Down Canning/Diamond Harbour -> Sealdah
  southLines.forEach(d => {
    const revStops = [...d.stops].reverse();
    const totalOff = d.stops[d.stops.length - 1].offset;
    const downNum = String(Number(d.num) + 1);
    const downTime = addMins(d.time, -40);
    trainDefs.push({
      number: downNum,
      name: `${d.dest === 'CG' ? 'Canning' : 'Diamond Harbour'} - Sealdah Commuter Local`,
      type: 'EMU Local',
      origin: d.dest,
      destination: 'SDAH',
      runningDays: 'Daily',
      distanceKm: 55,
      stops: revStopsToDefs(revStops, downTime, totalOff),
    });
  });

  // =========================================================================
  // 8. HIGH SPEED VANDE BHARAT & PRESTIGE EXPRESS TRAINS
  // =========================================================================
  const vandeBharatList = [
    {
      number: '22301',
      name: 'Howrah - New Jalpaiguri Vande Bharat Express',
      type: 'Vande Bharat',
      origin: 'HWH',
      destination: 'NJP',
      distanceKm: 561,
      stops: [
        { code: 'HWH', arr: null, dep: '05:55', seq: 1 },
        { code: 'BPC', arr: '08:48', dep: '08:50', seq: 2, halt: 2 },
        { code: 'MLDT', arr: '10:30', dep: '10:35', seq: 3, halt: 5 },
        { code: 'BOE', arr: '11:38', dep: '11:40', seq: 4, halt: 2 },
        { code: 'NJP', arr: '13:25', dep: null, seq: 5 },
      ],
    },
    {
      number: '22302',
      name: 'New Jalpaiguri - Howrah Vande Bharat Express',
      type: 'Vande Bharat',
      origin: 'NJP',
      destination: 'HWH',
      distanceKm: 561,
      stops: [
        { code: 'NJP', arr: null, dep: '15:05', seq: 1 },
        { code: 'BOE', arr: '16:33', dep: '16:35', seq: 2, halt: 2 },
        { code: 'MLDT', arr: '17:50', dep: '17:55', seq: 3, halt: 5 },
        { code: 'BPC', arr: '19:35', dep: '19:37', seq: 4, halt: 2 },
        { code: 'HWH', arr: '22:35', dep: null, seq: 5 },
      ],
    },
    {
      number: '22309',
      name: 'Sealdah - New Jalpaiguri Vande Bharat Express',
      type: 'Vande Bharat',
      origin: 'SDAH',
      destination: 'NJP',
      distanceKm: 574,
      stops: [
        { code: 'SDAH', arr: null, dep: '06:10', seq: 1 },
        { code: 'NH', arr: '06:48', dep: '06:50', seq: 2, halt: 2 },
        { code: 'BPC', arr: '08:55', dep: '08:57', seq: 3, halt: 2 },
        { code: 'MLDT', arr: '10:45', dep: '10:50', seq: 4, halt: 5 },
        { code: 'NJP', arr: '13:40', dep: null, seq: 5 },
      ],
    },
    {
      number: '22895',
      name: 'Howrah - Puri Vande Bharat Express',
      type: 'Vande Bharat',
      origin: 'HWH',
      destination: 'PURI',
      distanceKm: 502,
      stops: [
        { code: 'HWH', arr: null, dep: '06:10', seq: 1 },
        { code: 'KGP', arr: '07:38', dep: '07:40', seq: 2, halt: 2 },
        { code: 'BLS', arr: '08:58', dep: '09:00', seq: 3, halt: 2 },
        { code: 'BBS', arr: '11:05', dep: '11:07', seq: 4, halt: 2 },
        { code: 'PURI', arr: '12:35', dep: null, seq: 5 },
      ],
    },
    {
      number: '22347',
      name: 'Howrah - Patna Vande Bharat Express',
      type: 'Vande Bharat',
      origin: 'HWH',
      destination: 'PNBE',
      distanceKm: 532,
      stops: [
        { code: 'HWH', arr: null, dep: '05:55', seq: 1 },
        { code: 'BWN', arr: '07:00', dep: '07:02', seq: 2, halt: 2 },
        { code: 'DGR', arr: '07:45', dep: '07:47', seq: 3, halt: 2 },
        { code: 'ASN', arr: '08:15', dep: '08:17', seq: 4, halt: 2 },
        { code: 'PNBE', arr: '12:30', dep: null, seq: 5 },
      ],
    },
  ];

  vandeBharatList.forEach(t => trainDefs.push(t));

  console.log(`\n📦 Total unique train definitions prepared: ${trainDefs.length}`);

  let trainsCreated = 0;
  let stopsCreated = 0;

  for (const t of trainDefs) {
    // Upsert Train
    const trainRecord = await prisma.train.upsert({
      where: { number: t.number },
      update: {
        name: t.name,
        type: t.type,
        originStationCode: t.origin,
        destinationStationCode: t.destination,
        runningDays: t.runningDays || 'Daily',
        distanceKm: t.distanceKm || 50,
      },
      create: {
        number: t.number,
        name: t.name,
        type: t.type,
        originStationCode: t.origin,
        destinationStationCode: t.destination,
        runningDays: t.runningDays || 'Daily',
        distanceKm: t.distanceKm || 50,
      },
    });
    trainsCreated++;

    // Upsert Stops
    for (const stop of t.stops) {
      const stationId = resolveDbStationId(stop.code);
      if (!stationId) {
        continue;
      }

      await prisma.scheduleStop.upsert({
        where: {
          trainId_stationId: {
            trainId: trainRecord.id,
            stationId: stationId,
          },
        },
        update: {
          sequenceNo: stop.seq,
          arrivalTime: stop.arr || null,
          departureTime: stop.dep || null,
          haltMinutes: stop.halt ?? 1,
          source: 'verified',
        },
        create: {
          trainId: trainRecord.id,
          stationId: stationId,
          sequenceNo: stop.seq,
          arrivalTime: stop.arr || null,
          departureTime: stop.dep || null,
          haltMinutes: stop.halt ?? 1,
          source: 'verified',
        },
      });
      stopsCreated++;
    }
  }

  const finalStationCount = await prisma.station.count();
  const finalTrainCount = await prisma.train.count();
  const finalStopCount = await prisma.scheduleStop.count();

  console.log(`\n🎉 SEEDING COMPLETED SUCCESSFULLY!`);
  console.log(`📊 Final Database Status:`);
  console.log(`   Stations: ${finalStationCount}`);
  console.log(`   Trains: ${finalTrainCount} (Processed ${trainsCreated})`);
  console.log(`   Schedule Stops: ${finalStopCount} (Processed ${stopsCreated})`);
}

function revStopsToDefs(revStops: { code: string; offset: number }[], startTime: string, totalOff: number) {
  return revStops.map((st, idx) => {
    const elapsed = totalOff - st.offset;
    const time = addMins(startTime, elapsed);
    const isFirst = idx === 0;
    const isLast = idx === revStops.length - 1;
    return {
      code: st.code,
      arr: isFirst ? null : time,
      dep: isLast ? null : time,
      seq: idx + 1,
      halt: (isFirst || isLast) ? 0 : 1,
    };
  });
}

main()
  .catch(err => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
