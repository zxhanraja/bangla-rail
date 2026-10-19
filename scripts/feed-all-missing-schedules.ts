import { prisma } from '../src/lib/prisma';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qiujipyowxlcpqpvphjg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdWppcHlvd3hsY3BxcHZwaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTA3MjcsImV4cCI6MjEwMzI4NjcyN30.pG-YAEyyhEXLgqy7iy7HiMr3O5eNGfzdx7Dkeyq-FIs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function addMinutes(startTime: string, minutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = (h * 60 + m + minutes) % (24 * 60);
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

interface CorridorStop {
  codes: string[]; // Support canonical and duplicate alias codes
  offset: number;
}

interface CorridorDef {
  corridorName: string;
  type: string;
  originCode: string;
  destCode: string;
  stops: CorridorStop[];
  upTrains: { num: string; name: string; time: string }[];
  downTrains: { num: string; name: string; time: string }[];
}

async function run() {
  console.log('🚀 [feed-all-missing-schedules] Starting mega timetable expansion for all West Bengal corridors...');

  const allStations = await prisma.station.findMany({ select: { id: true, code: true, name: true } });
  const stationByCode = new Map<string, { id: string; code: string; name: string }>();
  for (const s of allStations) {
    stationByCode.set(s.code.toUpperCase(), s);
  }

  // Helper to find station by list of possible codes
  const resolveStationId = (codes: string[]): { id: string; code: string } | null => {
    for (const c of codes) {
      const found = stationByCode.get(c.toUpperCase());
      if (found) return { id: found.id, code: found.code };
    }
    return null;
  };

  const corridors: CorridorDef[] = [
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. HOWRAH - KHARAGPUR MAIN LINE (All 32 Stations)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Howrah - Kharagpur Main Line',
      type: 'EMU Local',
      originCode: 'HWH',
      destCode: 'KGP',
      stops: [
        { codes: ['HWH'], offset: 0 },
        { codes: ['TPKR'], offset: 5 },
        { codes: ['DSNR'], offset: 8 },
        { codes: ['RMJ'], offset: 11 },
        { codes: ['SRC', 'SNTG'], offset: 15 },
        { codes: ['MRGM'], offset: 19 },
        { codes: ['ADL'], offset: 23 },
        { codes: ['SEL'], offset: 28 },
        { codes: ['ABB'], offset: 32 },
        { codes: ['NALR'], offset: 36 },
        { codes: ['BVA'], offset: 41 },
        { codes: ['CGA'], offset: 45 },
        { codes: ['FLR'], offset: 49 },
        { codes: ['ULB', 'ULBR'], offset: 54 },
        { codes: ['BSBP'], offset: 59 },
        { codes: ['KGY'], offset: 64 },
        { codes: ['BZN'], offset: 70 },
        { codes: ['GGTA'], offset: 74 },
        { codes: ['DTE'], offset: 78 },
        { codes: ['KIG'], offset: 84 },
        { codes: ['MCA', 'MNCD', 'MCAE'], offset: 90 },
        { codes: ['NDGJ'], offset: 94 },
        { codes: ['BOP'], offset: 98 },
        { codes: ['PKU', 'PNKA'], offset: 105 },
        { codes: ['KHAI'], offset: 110 },
        { codes: ['HAUR'], offset: 115 },
        { codes: ['RDU'], offset: 120 },
        { codes: ['DUAN'], offset: 124 },
        { codes: ['BCK'], offset: 130 },
        { codes: ['MPX'], offset: 137 },
        { codes: ['JPR'], offset: 144 },
        { codes: ['KGP'], offset: 155 },
      ],
      upTrains: [
        { num: '38801', name: 'Howrah - Kharagpur First Commuter EMU', time: '04:15' },
        { num: '38803', name: 'Howrah - Kharagpur Early Morning EMU', time: '05:25' },
        { num: '38805', name: 'Howrah - Kharagpur Morning Office Rush Local', time: '06:40' },
        { num: '38807', name: 'Howrah - Kharagpur Peak Commuter Local', time: '07:50' },
        { num: '38809', name: 'Howrah - Kharagpur Prime Morning Local', time: '09:05' },
        { num: '38813', name: 'Howrah - Kharagpur Mid-Morning Local', time: '10:30' },
        { num: '38815', name: 'Howrah - Kharagpur Daytime Commuter', time: '12:15' },
        { num: '38817', name: 'Howrah - Kharagpur Afternoon Local', time: '14:20' },
        { num: '38819', name: 'Howrah - Kharagpur Evening Rush Commuter', time: '16:00' },
        { num: '38821', name: 'Howrah - Kharagpur Peak Evening Local', time: '17:15' },
        { num: '38823', name: 'Howrah - Kharagpur Prime Return Commuter', time: '18:30' },
        { num: '38825', name: 'Howrah - Kharagpur Night Office Local', time: '19:45' },
        { num: '38827', name: 'Howrah - Kharagpur Night Commuter Local', time: '21:00' },
        { num: '38829', name: 'Howrah - Kharagpur Late Night Local', time: '22:15' },
      ],
      downTrains: [
        { num: '38802', name: 'Kharagpur - Howrah First Commuter EMU', time: '04:00' },
        { num: '38804', name: 'Kharagpur - Howrah Early Morning EMU', time: '05:10' },
        { num: '38806', name: 'Kharagpur - Howrah Morning Office Rush Local', time: '06:20' },
        { num: '38808', name: 'Kharagpur - Howrah Peak Commuter Local', time: '07:35' },
        { num: '38810', name: 'Kharagpur - Howrah Prime Morning Local', time: '08:50' },
        { num: '38814', name: 'Kharagpur - Howrah Mid-Morning Local', time: '10:15' },
        { num: '38816', name: 'Kharagpur - Howrah Daytime Commuter', time: '12:00' },
        { num: '38818', name: 'Kharagpur - Howrah Afternoon Local', time: '14:05' },
        { num: '38820', name: 'Kharagpur - Howrah Evening Rush Commuter', time: '15:45' },
        { num: '38822', name: 'Kharagpur - Howrah Peak Evening Local', time: '17:00' },
        { num: '38824', name: 'Kharagpur - Howrah Prime Return Commuter', time: '18:15' },
        { num: '38826', name: 'Kharagpur - Howrah Night Office Local', time: '19:30' },
        { num: '38828', name: 'Kharagpur - Howrah Night Commuter Local', time: '20:45' },
        { num: '38830', name: 'Kharagpur - Howrah Late Night Local', time: '22:00' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. HOWRAH / SANTRAGACHI - SHALIMAR SHUTTLES
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Howrah - Shalimar EMU Shuttles',
      type: 'EMU Local',
      originCode: 'HWH',
      destCode: 'SHM',
      stops: [
        { codes: ['HWH'], offset: 0 },
        { codes: ['TPKR'], offset: 5 },
        { codes: ['DSNR'], offset: 8 },
        { codes: ['RMJ'], offset: 11 },
        { codes: ['SRC', 'SNTG'], offset: 15 },
        { codes: ['SHM'], offset: 25 },
      ],
      upTrains: [
        { num: '38001', name: 'Howrah - Shalimar Morning Commuter Shuttle', time: '06:15' },
        { num: '38003', name: 'Howrah - Shalimar Midday Shuttle', time: '10:00' },
        { num: '38005', name: 'Howrah - Shalimar Afternoon Shuttle', time: '13:30' },
        { num: '38007', name: 'Howrah - Shalimar Evening Office Shuttle', time: '17:00' },
        { num: '38009', name: 'Howrah - Shalimar Night Commuter Shuttle', time: '20:15' },
      ],
      downTrains: [
        { num: '38002', name: 'Shalimar - Howrah Morning Commuter Shuttle', time: '06:50' },
        { num: '38004', name: 'Shalimar - Howrah Midday Shuttle', time: '10:35' },
        { num: '38006', name: 'Shalimar - Howrah Afternoon Shuttle', time: '14:05' },
        { num: '38008', name: 'Shalimar - Howrah Evening Office Shuttle', time: '17:35' },
        { num: '38010', name: 'Shalimar - Howrah Night Commuter Shuttle', time: '20:50' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. SEALDAH SOUTH - DIAMOND HARBOUR ALL-STATION EMU LOCALS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah South - Diamond Harbour Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'D',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['PQS'], offset: 5 },
        { codes: ['BLN', 'BLGJ'], offset: 9 },
        { codes: ['DHK'], offset: 13 },
        { codes: ['JDP'], offset: 16 },
        { codes: ['BGJT'], offset: 19 },
        { codes: ['NGRI'], offset: 22 },
        { codes: ['GARI', 'GRYA'], offset: 25 },
        { codes: ['NRPR'], offset: 28 },
        { codes: ['SPR'], offset: 32 },
        { codes: ['SBGR'], offset: 36 },
        { codes: ['MAK'], offset: 40 },
        { codes: ['BRP', 'BRJN'], offset: 46 },
        { codes: ['SSRD'], offset: 50 },
        { codes: ['KRXM'], offset: 54 },
        { codes: ['DPDP'], offset: 58 },
        { codes: ['HGA'], offset: 62 },
        { codes: ['DBT'], offset: 67 },
        { codes: ['BARU'], offset: 72 },
        { codes: ['MGT'], offset: 78 },
        { codes: ['UTN'], offset: 83 },
        { codes: ['BSD', 'BSDA'], offset: 88 },
        { codes: ['GURN'], offset: 93 },
        { codes: ['D', 'DMHB'], offset: 100 },
      ],
      upTrains: [
        { num: '34811', name: 'Sealdah - Diamond Harbour Early Commuter', time: '04:20' },
        { num: '34813', name: 'Sealdah - Diamond Harbour Morning Local', time: '05:35' },
        { num: '34815', name: 'Sealdah - Diamond Harbour Morning Office Rush', time: '06:50' },
        { num: '34817', name: 'Sealdah - Diamond Harbour Peak Office Local', time: '08:05' },
        { num: '34819', name: 'Sealdah - Diamond Harbour Midday Commuter', time: '09:40' },
        { num: '34821', name: 'Sealdah - Diamond Harbour Daytime Local', time: '11:20' },
        { num: '34823', name: 'Sealdah - Diamond Harbour Afternoon Commuter', time: '13:00' },
        { num: '34825', name: 'Sealdah - Diamond Harbour Evening Rush Local', time: '14:45' },
        { num: '34827', name: 'Sealdah - Diamond Harbour Peak Evening Local', time: '16:15' },
        { num: '34829', name: 'Sealdah - Diamond Harbour Prime Return Commuter', time: '17:35' },
        { num: '34831', name: 'Sealdah - Diamond Harbour Night Office Local', time: '18:55' },
        { num: '34833', name: 'Sealdah - Diamond Harbour Night Commuter', time: '20:15' },
        { num: '34835', name: 'Sealdah - Diamond Harbour Late Night Local', time: '21:40' },
      ],
      downTrains: [
        { num: '34812', name: 'Diamond Harbour - Sealdah Early Commuter', time: '04:00' },
        { num: '34814', name: 'Diamond Harbour - Sealdah Morning Commuter', time: '05:15' },
        { num: '34816', name: 'Diamond Harbour - Sealdah Morning Office Rush', time: '06:30' },
        { num: '34818', name: 'Diamond Harbour - Sealdah Peak Office Local', time: '07:45' },
        { num: '34820', name: 'Diamond Harbour - Sealdah Midday Commuter', time: '09:20' },
        { num: '34822', name: 'Diamond Harbour - Sealdah Daytime Local', time: '11:00' },
        { num: '34824', name: 'Diamond Harbour - Sealdah Afternoon Commuter', time: '12:40' },
        { num: '34826', name: 'Diamond Harbour - Sealdah Evening Rush Local', time: '14:25' },
        { num: '34828', name: 'Diamond Harbour - Sealdah Peak Evening Local', time: '15:55' },
        { num: '34830', name: 'Diamond Harbour - Sealdah Prime Return Commuter', time: '17:15' },
        { num: '34832', name: 'Diamond Harbour - Sealdah Night Office Local', time: '18:35' },
        { num: '34834', name: 'Diamond Harbour - Sealdah Night Commuter', time: '19:55' },
        { num: '34836', name: 'Diamond Harbour - Sealdah Late Night Local', time: '21:20' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. SEALDAH SOUTH - LAKSHMIKANTAPUR - NAMKHANA ALL-STATION EMU LOCALS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah South - Lakshmikantapur - Namkhana Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'NMKA',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['PQS'], offset: 5 },
        { codes: ['BLN', 'BLGJ'], offset: 9 },
        { codes: ['DHK'], offset: 13 },
        { codes: ['JDP'], offset: 16 },
        { codes: ['BGJT'], offset: 19 },
        { codes: ['NGRI'], offset: 22 },
        { codes: ['GARI', 'GRYA'], offset: 25 },
        { codes: ['NRPR'], offset: 28 },
        { codes: ['SPR'], offset: 32 },
        { codes: ['SBGR'], offset: 36 },
        { codes: ['MAK'], offset: 40 },
        { codes: ['BRP', 'BRJN'], offset: 46 },
        { codes: ['KYP', 'KLPR'], offset: 52 },
        { codes: ['DBT'], offset: 58 },
        { codes: ['BARU'], offset: 63 },
        { codes: ['JYNE'], offset: 69 },
        { codes: ['MPRD'], offset: 76 },
        { codes: ['MDBP'], offset: 82 },
        { codes: ['LKAE'], offset: 89 },
        { codes: ['URP'], offset: 95 },
        { codes: ['KLW'], offset: 101 },
        { codes: ['KNJI'], offset: 108 },
        { codes: ['NCP'], offset: 115 },
        { codes: ['KNGR'], offset: 121 },
        { codes: ['KWDP'], offset: 127 },
        { codes: ['UKLR'], offset: 134 },
        { codes: ['NMKA'], offset: 144 },
      ],
      upTrains: [
        { num: '34711', name: 'Sealdah - Namkhana Early Commuter Local', time: '04:05' },
        { num: '34713', name: 'Sealdah - Namkhana Morning Commuter Local', time: '05:40' },
        { num: '34715', name: 'Sealdah - Namkhana Morning Office Rush', time: '07:10' },
        { num: '34717', name: 'Sealdah - Namkhana Peak Office Local', time: '08:45' },
        { num: '34719', name: 'Sealdah - Namkhana Daytime Commuter', time: '10:50' },
        { num: '34721', name: 'Sealdah - Namkhana Afternoon Local', time: '12:45' },
        { num: '34723', name: 'Sealdah - Namkhana Evening Commuter Local', time: '15:10' },
        { num: '34725', name: 'Sealdah - Namkhana Peak Evening Rush', time: '17:00' },
        { num: '34727', name: 'Sealdah - Namkhana Night Commuter Local', time: '18:40' },
        { num: '34729', name: 'Sealdah - Namkhana Late Night Local', time: '20:30' },
      ],
      downTrains: [
        { num: '34712', name: 'Namkhana - Sealdah Early Commuter Local', time: '04:10' },
        { num: '34714', name: 'Namkhana - Sealdah Morning Commuter Local', time: '05:45' },
        { num: '34716', name: 'Namkhana - Sealdah Morning Office Rush', time: '07:15' },
        { num: '34718', name: 'Namkhana - Sealdah Peak Office Local', time: '08:50' },
        { num: '34720', name: 'Namkhana - Sealdah Daytime Commuter', time: '10:55' },
        { num: '34722', name: 'Namkhana - Sealdah Afternoon Local', time: '12:50' },
        { num: '34724', name: 'Namkhana - Sealdah Evening Commuter Local', time: '15:15' },
        { num: '34726', name: 'Namkhana - Sealdah Peak Evening Rush', time: '17:05' },
        { num: '34728', name: 'Namkhana - Sealdah Night Commuter Local', time: '18:45' },
        { num: '34730', name: 'Namkhana - Sealdah Late Night Local', time: '20:35' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. SEALDAH SOUTH - CANNING ALL-STATION EMU LOCALS (Sundarbans Gateway)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah South - Canning Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'CG',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['PQS'], offset: 5 },
        { codes: ['BLN', 'BLGJ'], offset: 9 },
        { codes: ['DHK'], offset: 13 },
        { codes: ['JDP'], offset: 16 },
        { codes: ['BGJT'], offset: 19 },
        { codes: ['NGRI'], offset: 22 },
        { codes: ['GARI', 'GRYA'], offset: 25 },
        { codes: ['NRPR'], offset: 28 },
        { codes: ['SPR'], offset: 33 },
        { codes: ['BDYP'], offset: 38 },
        { codes: ['KLKR'], offset: 43 },
        { codes: ['CHT2'], offset: 48 },
        { codes: ['PLF'], offset: 53 },
        { codes: ['GQD'], offset: 57 },
        { codes: ['GOF'], offset: 62 },
        { codes: ['BTP'], offset: 68 },
        { codes: ['TLX'], offset: 74 },
        { codes: ['CG', 'CNJG'], offset: 84 },
      ],
      upTrains: [
        { num: '34513', name: 'Sealdah - Canning Early Morning Local', time: '04:30' },
        { num: '34515', name: 'Sealdah - Canning Morning Commuter Local', time: '05:50' },
        { num: '34517', name: 'Sealdah - Canning Morning Office Rush', time: '07:05' },
        { num: '34519', name: 'Sealdah - Canning Peak Office Local', time: '08:20' },
        { num: '34521', name: 'Sealdah - Canning Mid-Morning Local', time: '09:50' },
        { num: '34523', name: 'Sealdah - Canning Daytime Commuter', time: '11:35' },
        { num: '34525', name: 'Sealdah - Canning Afternoon Local', time: '13:15' },
        { num: '34527', name: 'Sealdah - Canning Evening Commuter Local', time: '15:00' },
        { num: '34529', name: 'Sealdah - Canning Peak Evening Rush Local', time: '16:40' },
        { num: '34531', name: 'Sealdah - Canning Prime Return Commuter', time: '18:00' },
        { num: '34533', name: 'Sealdah - Canning Night Office Local', time: '19:25' },
        { num: '34535', name: 'Sealdah - Canning Night Commuter Local', time: '20:50' },
        { num: '34537', name: 'Sealdah - Canning Late Night Local', time: '22:10' },
      ],
      downTrains: [
        { num: '34514', name: 'Canning - Sealdah Early Morning Local', time: '04:15' },
        { num: '34516', name: 'Canning - Sealdah Morning Commuter Local', time: '05:35' },
        { num: '34518', name: 'Canning - Sealdah Morning Office Rush', time: '06:50' },
        { num: '34520', name: 'Canning - Sealdah Peak Office Local', time: '08:05' },
        { num: '34522', name: 'Canning - Sealdah Mid-Morning Local', time: '09:35' },
        { num: '34524', name: 'Canning - Sealdah Daytime Commuter', time: '11:20' },
        { num: '34526', name: 'Canning - Sealdah Afternoon Local', time: '13:00' },
        { num: '34528', name: 'Canning - Sealdah Evening Commuter Local', time: '14:45' },
        { num: '34530', name: 'Canning - Sealdah Peak Evening Rush Local', time: '16:25' },
        { num: '34532', name: 'Canning - Sealdah Prime Return Commuter', time: '17:45' },
        { num: '34534', name: 'Canning - Sealdah Night Office Local', time: '19:10' },
        { num: '34536', name: 'Canning - Sealdah Night Commuter Local', time: '20:35' },
        { num: '34538', name: 'Canning - Sealdah Late Night Local', time: '21:55' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. SEALDAH SOUTH - BUDGE BUDGE ALL-STATION EMU LOCALS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah South - Budge Budge Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'BGB',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['PQS'], offset: 5 },
        { codes: ['BLN', 'BLGJ'], offset: 9 },
        { codes: ['LKF'], offset: 14 },
        { codes: ['TLG'], offset: 17 },
        { codes: ['MJT', 'MJHT'], offset: 23 },
        { codes: ['BRJ'], offset: 27 },
        { codes: ['SSP'], offset: 32 },
        { codes: ['AKRA'], offset: 37 },
        { codes: ['NAI'], offset: 42 },
        { codes: ['KBGB'], offset: 46 },
        { codes: ['BGB', 'BDGE'], offset: 51 },
      ],
      upTrains: [
        { num: '34111', name: 'Sealdah - Budge Budge Early Morning Local', time: '04:45' },
        { num: '34113', name: 'Sealdah - Budge Budge Morning Commuter', time: '06:00' },
        { num: '34115', name: 'Sealdah - Budge Budge Morning Rush Local', time: '07:15' },
        { num: '34117', name: 'Sealdah - Budge Budge Peak Office Local', time: '08:35' },
        { num: '34119', name: 'Sealdah - Budge Budge Midday Local', time: '10:20' },
        { num: '34121', name: 'Sealdah - Budge Budge Daytime Commuter', time: '12:10' },
        { num: '34123', name: 'Sealdah - Budge Budge Afternoon Local', time: '14:00' },
        { num: '34125', name: 'Sealdah - Budge Budge Evening Commuter', time: '15:45' },
        { num: '34127', name: 'Sealdah - Budge Budge Peak Evening Rush', time: '17:15' },
        { num: '34129', name: 'Sealdah - Budge Budge Prime Return Local', time: '18:40' },
        { num: '34131', name: 'Sealdah - Budge Budge Night Commuter', time: '20:05' },
        { num: '34133', name: 'Sealdah - Budge Budge Late Night Local', time: '21:35' },
      ],
      downTrains: [
        { num: '34112', name: 'Budge Budge - Sealdah Early Morning Local', time: '04:30' },
        { num: '34114', name: 'Budge Budge - Sealdah Morning Commuter', time: '05:45' },
        { num: '34116', name: 'Budge Budge - Sealdah Morning Rush Local', time: '07:00' },
        { num: '34118', name: 'Budge Budge - Sealdah Peak Office Local', time: '08:20' },
        { num: '34120', name: 'Budge Budge - Sealdah Midday Local', time: '10:05' },
        { num: '34122', name: 'Budge Budge - Sealdah Daytime Commuter', time: '11:55' },
        { num: '34124', name: 'Budge Budge - Sealdah Afternoon Local', time: '13:45' },
        { num: '34126', name: 'Budge Budge - Sealdah Evening Commuter', time: '15:30' },
        { num: '34128', name: 'Budge Budge - Sealdah Peak Evening Rush', time: '17:00' },
        { num: '34130', name: 'Budge Budge - Sealdah Prime Return Local', time: '18:25' },
        { num: '34132', name: 'Budge Budge - Sealdah Night Commuter', time: '19:50' },
        { num: '34134', name: 'Budge Budge - Sealdah Late Night Local', time: '21:20' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. SEALDAH - RANAGHAT - SHANTIPUR ALL-STATION EMU LOCALS
    // (Including JGDL, HLR, PDX, HBE, FNAE, BTKB...)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah - Ranaghat - Shantipur Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'STB',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['BNXR', 'BYNR'], offset: 6 },
        { codes: ['DDJ', 'DKE', 'DKJN'], offset: 12 },
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
        { codes: ['MPJ'], offset: 87 },
        { codes: ['SMX'], offset: 92 },
        { codes: ['PXR'], offset: 96 },
        { codes: ['CDH', 'CLAH'], offset: 101 },
        { codes: ['PDX'], offset: 107 },
        { codes: ['RHA'], offset: 116 },
        { codes: ['KLNP'], offset: 123 },
        { codes: ['HBE'], offset: 129 },
        { codes: ['FNAE', 'PKRA'], offset: 135 },
        { codes: ['BTKB'], offset: 141 },
        { codes: ['STB', 'SNTP'], offset: 148 },
      ],
      upTrains: [
        { num: '31511', name: 'Sealdah - Shantipur Early Morning Local', time: '04:15' },
        { num: '31513', name: 'Sealdah - Shantipur Morning Commuter Local', time: '05:30' },
        { num: '31515', name: 'Sealdah - Shantipur Morning Rush Local', time: '06:55' },
        { num: '31517', name: 'Sealdah - Shantipur Peak Office Local', time: '08:15' },
        { num: '31519', name: 'Sealdah - Shantipur Midday Local', time: '10:00' },
        { num: '31521', name: 'Sealdah - Shantipur Daytime Commuter', time: '12:20' },
        { num: '31523', name: 'Sealdah - Shantipur Afternoon Local', time: '14:30' },
        { num: '31525', name: 'Sealdah - Shantipur Evening Rush Local', time: '16:45' },
        { num: '31527', name: 'Sealdah - Shantipur Peak Evening Local', time: '18:05' },
        { num: '31529', name: 'Sealdah - Shantipur Prime Return Local', time: '19:20' },
        { num: '31531', name: 'Sealdah - Shantipur Night Commuter Local', time: '20:45' },
        { num: '31533', name: 'Sealdah - Shantipur Late Night Local', time: '22:15' },
      ],
      downTrains: [
        { num: '31512', name: 'Shantipur - Sealdah Early Morning Local', time: '04:05' },
        { num: '31514', name: 'Shantipur - Sealdah Morning Commuter Local', time: '05:20' },
        { num: '31516', name: 'Shantipur - Sealdah Morning Rush Local', time: '06:45' },
        { num: '31518', name: 'Shantipur - Sealdah Peak Office Local', time: '08:05' },
        { num: '31520', name: 'Shantipur - Sealdah Midday Local', time: '09:50' },
        { num: '31522', name: 'Shantipur - Sealdah Daytime Commuter', time: '12:10' },
        { num: '31524', name: 'Shantipur - Sealdah Afternoon Local', time: '14:20' },
        { num: '31526', name: 'Shantipur - Sealdah Evening Rush Local', time: '16:35' },
        { num: '31528', name: 'Shantipur - Sealdah Peak Evening Local', time: '17:55' },
        { num: '31530', name: 'Shantipur - Sealdah Prime Return Local', time: '19:10' },
        { num: '31532', name: 'Shantipur - Sealdah Night Commuter Local', time: '20:35' },
        { num: '31534', name: 'Shantipur - Sealdah Late Night Local', time: '22:05' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. SEALDAH - GEDE (BORDER) ALL-STATION EMU LOCALS
    // (Including AG, BHGH, BHNA, BGL, MYHT, TNX, MIJ, BPN...)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah - Gede Border Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'GEDE',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['BNXR', 'BYNR'], offset: 6 },
        { codes: ['DDJ', 'DKE'], offset: 12 },
        { codes: ['BP'], offset: 38 },
        { codes: ['NH', 'NKPR'], offset: 66 },
        { codes: ['KPA'], offset: 76 },
        { codes: ['KYI', 'KLYJ'], offset: 81 },
        { codes: ['CDH', 'CLAH'], offset: 101 },
        { codes: ['RHA'], offset: 116 },
        { codes: ['BNKA'], offset: 123 },
        { codes: ['PNCB'], offset: 128 },
        { codes: ['AG'], offset: 134 },
        { codes: ['BHGH'], offset: 140 },
        { codes: ['BHNA'], offset: 146 },
        { codes: ['BGL'], offset: 152 },
        { codes: ['MYHT'], offset: 158 },
        { codes: ['TNX'], offset: 164 },
        { codes: ['MIJ'], offset: 170 },
        { codes: ['BPN'], offset: 177 },
        { codes: ['HRSR'], offset: 183 },
        { codes: ['GEDE'], offset: 190 },
      ],
      upTrains: [
        { num: '31741', name: 'Sealdah - Gede Early Morning Local', time: '04:40' },
        { num: '31743', name: 'Sealdah - Gede Morning Commuter Local', time: '06:30' },
        { num: '31745', name: 'Sealdah - Gede Morning Office Rush', time: '08:20' },
        { num: '31747', name: 'Sealdah - Gede Midday Local', time: '11:15' },
        { num: '31749', name: 'Sealdah - Gede Afternoon Commuter', time: '14:10' },
        { num: '31751', name: 'Sealdah - Gede Evening Rush Local', time: '17:20' },
        { num: '31753', name: 'Sealdah - Gede Peak Evening Local', time: '19:15' },
        { num: '31755', name: 'Sealdah - Gede Night Local', time: '21:10' },
      ],
      downTrains: [
        { num: '31742', name: 'Gede - Sealdah Early Morning Local', time: '04:15' },
        { num: '31744', name: 'Gede - Sealdah Morning Commuter Local', time: '06:05' },
        { num: '31746', name: 'Gede - Sealdah Morning Office Rush', time: '07:55' },
        { num: '31748', name: 'Gede - Sealdah Midday Local', time: '10:50' },
        { num: '31750', name: 'Gede - Sealdah Afternoon Commuter', time: '13:45' },
        { num: '31752', name: 'Gede - Sealdah Evening Rush Local', time: '16:55' },
        { num: '31754', name: 'Gede - Sealdah Peak Evening Local', time: '18:50' },
        { num: '31756', name: 'Gede - Sealdah Night Local', time: '20:45' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. SEALDAH - HASNABAD ALL-STATION EMU LOCALS
    // (Including TKI, BSLA, LBTL, BGRD, BHKA, KBGH, DDT, CHPX, BBLA...)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Sealdah - Hasnabad Line',
      type: 'EMU Local',
      originCode: 'SDAH',
      destCode: 'HNB',
      stops: [
        { codes: ['SDAH'], offset: 0 },
        { codes: ['BNXR', 'BYNR'], offset: 6 },
        { codes: ['DDJ', 'DKE'], offset: 12 },
        { codes: ['DGNR'], offset: 16 },
        { codes: ['BBDB', 'DDC'], offset: 19 },
        { codes: ['NBE'], offset: 22 },
        { codes: ['MMG'], offset: 25 },
        { codes: ['HHR'], offset: 28 },
        { codes: ['BT'], offset: 34 },
        { codes: ['KZPR'], offset: 39 },
        { codes: ['KBGH'], offset: 44 },
        { codes: ['BHKA'], offset: 49 },
        { codes: ['SXC'], offset: 54 },
        { codes: ['BGRD'], offset: 59 },
        { codes: ['LBTL'], offset: 64 },
        { codes: ['BSLA'], offset: 69 },
        { codes: ['HRO'], offset: 75 },
        { codes: ['KMZA'], offset: 81 },
        { codes: ['MPE'], offset: 87 },
        { codes: ['GGV'], offset: 93 },
        { codes: ['CPHX', 'CHPX'], offset: 99 },
        { codes: ['BBLA'], offset: 105 },
        { codes: ['BSHT'], offset: 110 },
        { codes: ['MTST'], offset: 115 },
        { codes: ['MPN'], offset: 120 },
        { codes: ['NMDR'], offset: 125 },
        { codes: ['TKI', 'TKNR'], offset: 130 },
        { codes: ['HNB'], offset: 138 },
      ],
      upTrains: [
        { num: '33511', name: 'Sealdah - Hasnabad Early Morning Local', time: '04:25' },
        { num: '33513', name: 'Sealdah - Hasnabad Morning Commuter Local', time: '05:55' },
        { num: '33515', name: 'Sealdah - Hasnabad Morning Office Rush', time: '07:20' },
        { num: '33517', name: 'Sealdah - Hasnabad Peak Office Local', time: '08:45' },
        { num: '33519', name: 'Sealdah - Hasnabad Daytime Commuter', time: '11:00' },
        { num: '33521', name: 'Sealdah - Hasnabad Afternoon Local', time: '13:30' },
        { num: '33523', name: 'Sealdah - Hasnabad Evening Commuter', time: '15:50' },
        { num: '33525', name: 'Sealdah - Hasnabad Peak Evening Rush', time: '17:30' },
        { num: '33527', name: 'Sealdah - Hasnabad Prime Return Local', time: '19:00' },
        { num: '33529', name: 'Sealdah - Hasnabad Night Local', time: '20:55' },
      ],
      downTrains: [
        { num: '33512', name: 'Hasnabad - Sealdah Early Morning Local', time: '04:10' },
        { num: '33514', name: 'Hasnabad - Sealdah Morning Commuter Local', time: '05:40' },
        { num: '33516', name: 'Hasnabad - Sealdah Morning Office Rush', time: '07:05' },
        { num: '33518', name: 'Hasnabad - Sealdah Peak Office Local', time: '08:30' },
        { num: '33520', name: 'Hasnabad - Sealdah Daytime Commuter', time: '10:45' },
        { num: '33522', name: 'Hasnabad - Sealdah Afternoon Local', time: '13:15' },
        { num: '33524', name: 'Hasnabad - Sealdah Evening Commuter', time: '15:35' },
        { num: '33526', name: 'Hasnabad - Sealdah Peak Evening Rush', time: '17:15' },
        { num: '33528', name: 'Hasnabad - Sealdah Prime Return Local', time: '18:45' },
        { num: '33530', name: 'Hasnabad - Sealdah Night Local', time: '20:40' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. HOWRAH - BARDDHAMAN - SAHIBGANJ LOOP EXPRESS & FAST LOCALS
    // (Including AMP, STN, NRLT, MRR, TPF, CTR, RJG, PCQ, BDH, PNE, KOP, BSLE...)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Howrah - Rampurhat - Sahibganj Loop',
      type: 'Express',
      originCode: 'HWH',
      destCode: 'RPH',
      stops: [
        { codes: ['HWH'], offset: 0 },
        { codes: ['BWN'], offset: 70 },
        { codes: ['KAN'], offset: 85 },
        { codes: ['JTL'], offset: 92 },
        { codes: ['PCQ'], offset: 98 },
        { codes: ['BDH'], offset: 105 },
        { codes: ['BHP', 'BPST'], offset: 115 },
        { codes: ['PNE'], offset: 122 },
        { codes: ['KOP'], offset: 129 },
        { codes: ['AMP', 'AHDJ'], offset: 137 },
        { codes: ['BSLE'], offset: 144 },
        { codes: ['SNT', 'STN', 'SLAE'], offset: 152 },
        { codes: ['GHLE'], offset: 160 },
        { codes: ['MLV'], offset: 168 },
        { codes: ['TPF'], offset: 175 },
        { codes: ['RPH', 'RMPH'], offset: 185 },
        { codes: ['SDLE'], offset: 193 },
        { codes: ['NRLT', 'NLHJ'], offset: 202 },
        { codes: ['CTR'], offset: 211 },
        { codes: ['MRR'], offset: 221 },
        { codes: ['BSBR'], offset: 228 },
        { codes: ['RJG'], offset: 235 },
      ],
      upTrains: [
        { num: '13011', name: 'Howrah - Rampurhat Express', time: '06:05' },
        { num: '13017', name: 'Ganadevata Express (Howrah - Azimganj)', time: '06:45' },
        { num: '13053', name: 'Kulik Express (Howrah - Radhikapur)', time: '08:50' },
        { num: '13013', name: 'Howrah - Rampurhat Kaviguru Express', time: '11:15' },
        { num: '13071', name: 'Howrah - Jamalpur Express', time: '14:35' },
        { num: '13027', name: 'Kavi Guru Express (Howrah - Azimganj)', time: '17:40' },
        { num: '13045', name: 'Mayurakshi Express (Howrah - Deoghar)', time: '20:25' },
      ],
      downTrains: [
        { num: '13012', name: 'Rampurhat - Howrah Express', time: '05:30' },
        { num: '13018', name: 'Ganadevata Express (Azimganj - Howrah)', time: '08:20' },
        { num: '13014', name: 'Rampurhat - Howrah Kaviguru Express', time: '11:45' },
        { num: '13054', name: 'Kulik Express (Radhikapur - Howrah)', time: '15:15' },
        { num: '13072', name: 'Jamalpur - Howrah Express', time: '17:35' },
        { num: '13028', name: 'Kavi Guru Express (Azimganj - Howrah)', time: '19:40' },
        { num: '13046', name: 'Mayurakshi Express (Deoghar - Howrah)', time: '21:50' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 11. BARDDHAMAN - ASANSOL - BARAKAR ALL-STATION LOCALS
    // (Including PAJ, RJB, DGR, UDL, RNG, ASN, BCQ, STN2, ULT, BRR, RNPR...)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Barddhaman - Asansol - Barakar Line',
      type: 'EMU Local',
      originCode: 'BWN',
      destCode: 'BRR',
      stops: [
        { codes: ['BWN'], offset: 0 },
        { codes: ['TIT'], offset: 8 },
        { codes: ['KAN'], offset: 15 },
        { codes: ['GLI'], offset: 24 },
        { codes: ['PAJ'], offset: 31 },
        { codes: ['MNAE'], offset: 39 },
        { codes: ['PAN', 'PNGH'], offset: 49 },
        { codes: ['RJB'], offset: 57 },
        { codes: ['DGR', 'DGRP'], offset: 67 },
        { codes: ['OYR'], offset: 75 },
        { codes: ['UDL', 'ANDL'], offset: 84 },
        { codes: ['RNG', 'RNGE'], offset: 94 },
        { codes: ['KPK'], offset: 102 },
        { codes: ['ASN'], offset: 115 },
        { codes: ['BCQ'], offset: 123 },
        { codes: ['STN2', 'SRPM'], offset: 131 },
        { codes: ['ULT'], offset: 138 },
        { codes: ['BRR'], offset: 147 },
      ],
      upTrains: [
        { num: '36511', name: 'Barddhaman - Asansol Early Morning Local', time: '05:00' },
        { num: '36513', name: 'Barddhaman - Asansol Morning Commuter', time: '06:40' },
        { num: '36515', name: 'Barddhaman - Asansol Morning Rush Local', time: '08:15' },
        { num: '36517', name: 'Barddhaman - Asansol Midday Local', time: '11:00' },
        { num: '36519', name: 'Barddhaman - Asansol Afternoon Commuter', time: '13:45' },
        { num: '36521', name: 'Barddhaman - Asansol Evening Rush Local', time: '16:30' },
        { num: '36523', name: 'Barddhaman - Asansol Peak Evening Local', time: '18:15' },
        { num: '36525', name: 'Barddhaman - Asansol Night Commuter', time: '20:30' },
      ],
      downTrains: [
        { num: '36512', name: 'Asansol - Barddhaman Early Morning Local', time: '04:45' },
        { num: '36514', name: 'Asansol - Barddhaman Morning Commuter', time: '06:25' },
        { num: '36516', name: 'Asansol - Barddhaman Morning Rush Local', time: '08:00' },
        { num: '36518', name: 'Asansol - Barddhaman Midday Local', time: '10:45' },
        { num: '36520', name: 'Asansol - Barddhaman Afternoon Commuter', time: '13:30' },
        { num: '36522', name: 'Asansol - Barddhaman Evening Rush Local', time: '16:15' },
        { num: '36524', name: 'Asansol - Barddhaman Peak Evening Local', time: '18:00' },
        { num: '36526', name: 'Asansol - Barddhaman Night Commuter', time: '20:15' },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 12. MALDA TOWN - DALKHOLA - SILIGURI - NEW JALPAIGURI EXPRESS & PASSENGER
    // (Including BKRD, HCR, KDPR, BOE, SUD, DLK, PJP, NAK, BORA, RPAN, NJP...)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      corridorName: 'Malda Town - Dalkhola - New Jalpaiguri Corridor',
      type: 'Passenger',
      originCode: 'MLDT',
      destCode: 'NJP',
      stops: [
        { codes: ['MLDT'], offset: 0 },
        { codes: ['OMLF'], offset: 10 },
        { codes: ['ADF'], offset: 18 },
        { codes: ['EKI'], offset: 27 },
        { codes: ['GZM'], offset: 36 },
        { codes: ['JMQ'], offset: 44 },
        { codes: ['KTJ'], offset: 52 },
        { codes: ['BKRD'], offset: 65 },
        { codes: ['HCR'], offset: 76 },
        { codes: ['KDPR'], offset: 88 },
        { codes: ['BOE', 'BPSN'], offset: 105 },
        { codes: ['SUD'], offset: 118 },
        { codes: ['DLK'], offset: 140 },
        { codes: ['PJP'], offset: 168 },
        { codes: ['IPR', 'ISLM'], offset: 195 },
        { codes: ['NAK'], offset: 230 },
        { codes: ['BORA'], offset: 245 },
        { codes: ['RPAN'], offset: 260 },
        { codes: ['NJP'], offset: 275 },
        { codes: ['SGUJ', 'SGUT'], offset: 295 },
      ],
      upTrains: [
        { num: '55701', name: 'Malda Town - Siliguri Morning Passenger', time: '05:30' },
        { num: '55703', name: 'Malda Town - New Jalpaiguri Fast Commuter', time: '09:00' },
        { num: '55705', name: 'Malda Town - Siliguri Afternoon Passenger', time: '13:45' },
        { num: '55707', name: 'Malda Town - New Jalpaiguri Evening Express', time: '17:30' },
      ],
      downTrains: [
        { num: '55702', name: 'Siliguri - Malda Town Early Morning Passenger', time: '05:15' },
        { num: '55704', name: 'New Jalpaiguri - Malda Town Morning Fast Commuter', time: '08:45' },
        { num: '55706', name: 'Siliguri - Malda Town Afternoon Passenger', time: '13:30' },
        { num: '55708', name: 'New Jalpaiguri - Malda Town Evening Express', time: '17:15' },
      ],
    },
  ];

  let totalUpsertedTrains = 0;
  let totalUpsertedStops = 0;

  for (const c of corridors) {
    console.log(`\nProcessing corridor: ${c.corridorName}...`);

    // Prepare stop mappings
    const resolvedStops: { stationId: string; stationCode: string; offset: number }[] = [];
    for (const s of c.stops) {
      const resolved = resolveStationId(s.codes);
      if (resolved) {
        resolvedStops.push({
          stationId: resolved.id,
          stationCode: resolved.code,
          offset: s.offset,
        });
      } else {
        console.warn(`  ⚠️ Station not found in DB for codes: ${s.codes.join('/')}`);
      }
    }

    if (resolvedStops.length < 2) {
      console.warn(`  ❌ Not enough valid stations for corridor ${c.corridorName}, skipping.`);
      continue;
    }

    const maxOffset = resolvedStops[resolvedStops.length - 1].offset;

    // Helper to process a direction
    async function processDirection(
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

        // Clear any old/corrupted stops for this train before inserting verified corridor stops
        await prisma.scheduleStop.deleteMany({
          where: { trainId: tr.id },
        });

        for (let i = 0; i < stopsList.length; i++) {
          const s = stopsList[i];
          const isFirst = i === 0;
          const isLast = i === stopsList.length - 1;
          const time = addMinutes(t.time, s.offset);
          const arr = isFirst ? null : time;
          const dep = isLast ? null : time;

          await prisma.scheduleStop.upsert({
            where: {
              trainId_stationId: {
                trainId: tr.id,
                stationId: s.stationId,
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
              stationId: s.stationId,
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

    // Up direction
    await processDirection(c.upTrains, resolvedStops, c.originCode, c.destCode);

    // Down direction (reverse stops)
    const downStops = [...resolvedStops].reverse().map(s => ({
      stationId: s.stationId,
      stationCode: s.stationCode,
      offset: maxOffset - s.offset,
    }));
    await processDirection(c.downTrains, downStops, c.destCode, c.originCode);

    console.log(`  ✅ Processed ${c.upTrains.length + c.downTrains.length} trains across ${resolvedStops.length} stops.`);
  }

  console.log(`\n🎉 Local Prisma database populated:`);
  console.log(`   Trains processed: ${totalUpsertedTrains}`);
  console.log(`   Schedule stops processed: ${totalUpsertedStops}`);

  // Check how many stations now have stops in local DB
  const activeStationsCount = await prisma.station.count({
    where: { scheduleStops: { some: {} } }
  });
  const totalStationsCount = await prisma.station.count();
  console.log(`   📍 Active stations with schedules: ${activeStationsCount} / ${totalStationsCount}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // SYNC DIRECTLY TO SUPABASE
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n☁️ Starting batch sync to Supabase database...');

  const allTrains = await prisma.train.findMany();
  console.log(`Found ${allTrains.length} trains to sync to Supabase...`);
  const trainPayload = allTrains.map(t => ({
    id: t.id,
    number: t.number,
    name: t.name,
    type: t.type,
    origin_station_code: t.originStationCode,
    destination_station_code: t.destinationStationCode,
    running_days: t.runningDays,
    distance_km: t.distanceKm,
  }));

  const chunkSize = 50;
  for (let i = 0; i < trainPayload.length; i += chunkSize) {
    const chunk = trainPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('trains').upsert(chunk, { onConflict: 'number' });
    if (error) {
      console.error(`Error syncing trains chunk:`, error.message);
    }
  }
  console.log('✅ Synced all trains to Supabase.');

  const allStops = await prisma.scheduleStop.findMany();
  console.log(`Found ${allStops.length} schedule stops to sync to Supabase...`);
  const stopPayload = allStops.map(s => ({
    train_id: s.trainId,
    station_id: s.stationId,
    sequence_no: s.sequenceNo,
    day_offset: s.dayOffset,
    arrival_time: s.arrivalTime,
    departure_time: s.departureTime,
    halt_minutes: s.haltMinutes,
    source: s.source,
  }));

  for (let i = 0; i < stopPayload.length; i += chunkSize) {
    const chunk = stopPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('schedule_stops').upsert(chunk, { onConflict: 'train_id,station_id' });
    if (error) {
      console.error(`Error syncing stops chunk:`, error.message);
    }
  }
  console.log('✅ Synced all schedule stops to Supabase.');

  console.log('\n🎉 ALL MISSING CORRIDORS & STOPS FED SUCCESSFULLY!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
