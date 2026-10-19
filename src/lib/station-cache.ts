import { prisma } from './prisma';
import { supabase } from './supabase';

export interface CachedStation {
  id: string;
  code: string;
  name: string;
  nameBn: string | null;
  zone: string;
  division: string;
  district: string | null;
  lat: number | null;
  lng: number | null;
}

let cachedStations: CachedStation[] | null = null;
let stationByCode = new Map<string, CachedStation>();
let stationById = new Map<string, CachedStation>();
let cachePromise: Promise<CachedStation[]> | null = null;

export async function getAllStations(): Promise<CachedStation[]> {
  if (cachedStations) return cachedStations;
  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    try {
      let list: any[] = [];
      try {
        list = await prisma.station.findMany({
          orderBy: { name: 'asc' },
        });
      } catch (prismaErr) {
        console.warn('[station-cache] Prisma query failed, fetching stations from Supabase fallback...');
      }

      // If Prisma returned empty list (e.g. SQLite on Vercel Serverless), fetch from Supabase
      if (!list || list.length === 0) {
        const { data, error } = await supabase
          .from('stations')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('[station-cache] Supabase stations error:', error.message);
        } else if (data && data.length > 0) {
          list = data.map((s) => ({
            id: s.id,
            code: s.code,
            name: s.name,
            nameBn: s.name_bn || null,
            zone: s.zone || 'ER',
            division: s.division || 'Sealdah',
            district: s.district || null,
            lat: s.lat != null ? Number(s.lat) : null,
            lng: s.lng != null ? Number(s.lng) : null,
          }));
        }
      }

      // Filter out phantom duplicate codes from user-facing list
      const cleanList = list.filter((s) => !PHANTOM_DUPLICATE_CODES.has(s.code.toUpperCase()));
      cachedStations = cleanList;
      stationByCode = new Map(list.map((s) => [s.code.toUpperCase(), s]));
      // Map alias and phantom duplicate codes to their canonical active station
      for (const [phantomCode, canonicalCode] of Object.entries(STATION_ALIASES)) {
        const canonical = stationByCode.get(canonicalCode.toUpperCase());
        if (canonical) {
          stationByCode.set(phantomCode.toUpperCase(), canonical);
        }
      }
      stationById = new Map(list.map((s) => [s.id, s]));
      return cleanList;
    } catch (e) {
      console.error('Failed to load stations into cache:', e);
      return [];
    } finally {
      cachePromise = null;
    }
  })();

  return cachePromise;
}

export async function findStationByCode(code: string): Promise<CachedStation | null> {
  await getAllStations();
  return stationByCode.get(code.trim().toUpperCase()) || null;
}

export async function findStationById(id: string): Promise<CachedStation | null> {
  await getAllStations();
  return stationById.get(id) || null;
}

// ── Levenshtein Distance for Typo-Tolerant Fuzzy Search ──────────────────────
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export const STATION_ALIASES: Record<string, string> = {
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
  CP: 'KOAA',
  KOAA: 'CP',
  'M-SECTOR-V': 'M-SCV',
  'M-HOWRAH-MAIDAN': 'M-HMD',
  'M-ESP2': 'M-ESP',
  'M-ESP': 'M-ESP2',
  'M-JOKA': 'M-JOK',
  'M-JOK': 'M-JOKA',
  'M-SEALDAH': 'M-SDAH',
  'M-HOWRAH': 'M-HWH',

  // Tribeni & Kuntighat & Majerhat
  TRS: 'TBAE',
  TBAE: 'TRS',
  KGT: 'KJU',
  KJU: 'KGT',
  MJHT: 'MJT',
  MJT: 'MJHT',
  TKI: 'TKNR',
  TKNR: 'TKI',
  PKRA: 'FNAE',
  FNAE: 'PKRA',
  CLAH: 'CDH',
  CDH: 'CLAH',

  // Phantom duplicate codes mapped to active canonical stations
  CNJG: 'CG',
  DMHB: 'D',
  BDGE: 'BGB',
  BJNJ: 'BNJ',
  DKE: 'DDJ',
  DKJN: 'DDJ',
  NKPR: 'NH',
  SNTG: 'SRC',
  ULBR: 'ULB',
  MNCD: 'MCA',
  MCAE: 'MCA',
  PNKA: 'PKU',
  DGSM: 'DGHA',
  TRSE: 'TAK',
  ARSW: 'AMBG',
  BRJN: 'BRP',
  BLGJ: 'BLN',
  BYNR: 'BNXR',
  KLYJ: 'KYI',
  KNST: 'KLMJ',
  KLYM: 'KLMJ',
  SNTP: 'STB',
  KRSJ: 'KNJ',
  LGLJ: 'LGL',
  BRMP: 'BPC',
  DGRP: 'DGP',
  BPST: 'BHP',
  RMPH: 'RPH',
  RNGE: 'RNG',
  ANDL: 'UDL',
  PNGH: 'PAN',
  HBRH: 'HB',
  GBDG: 'GBG',
  CRPD: 'CDP',
  KHNA: 'KDH',
  AGPD: 'AGP',
  SGMR: 'SNR',
  TLGD: 'TGH',
  KLAE: 'KNR',
  MGAE: 'MGM',
  PHDE: 'PDA',
  SKLE: 'SKG',
  TMLK: 'TMZ',
  JGRM: 'JGM',
  BNKR: 'BQA',
  PRLJ: 'PRR',
  BSNP: 'VSU',
  RYGJ: 'RGJ',
  HKAE: 'HPL',
  ALDE: 'APDJ',
  JLPD: 'JPG',
  CHLS: 'CLD',
  HSMR: 'HSA',
  BPSN: 'BOE',
  GRYA: 'GARI',
  NSE: 'NSF',
  BQH: 'BQY',
  HSTN: 'HLR',
};

// Codes of phantom duplicate stations that have 0 trains and duplicate active stations
export const PHANTOM_DUPLICATE_CODES = new Set([
  'CNJG', 'DMHB', 'BDGE', 'BJNJ', 'DKE', 'DKJN', 'NKPR', 'SNTG', 'ULBR',
  'MNCD', 'PNKA', 'DGSM', 'TRSE', 'ARSW', 'BRJN', 'BLGJ', 'BYNR', 'KLYJ',
  'KNST', 'SNTP', 'KRSJ', 'LGLJ', 'BRMP', 'DGRP', 'BPST', 'RMPH', 'RNGE', 'ANDL',
  'PNGH', 'HBRH', 'GBDG', 'CRPD', 'KHNA', 'AGPD', 'SGMR', 'TLGD', 'KLAE', 'MGAE',
  'PHDE', 'SKLE', 'TMLK', 'JGRM', 'BNKR', 'PRLJ', 'BSNP', 'RYGJ', 'HKAE', 'ALDE',
  'JLPD', 'CHLS', 'HSMR', 'BPSN', 'GRYA', 'NSE', 'BQH', 'HSTN', 'TRS', 'KGT', 'MJHT'
]);

// Common typos, transliterations, and colloquial Station Search Queries
export const COMMON_TYPOS_AND_SYNONYMS: Record<string, string> = {
  // Howrah variations & typos
  howrha: 'HWH',
  howrah: 'HWH',
  haora: 'HWH',
  howra: 'HWH',
  howrahjn: 'HWH',
  howrahjunction: 'HWH',
  hawrah: 'HWH',
  howarah: 'HWH',
  hwh: 'HWH',

  // Sealdah variations & typos
  sealdha: 'SDAH',
  seldah: 'SDAH',
  sealdah: 'SDAH',
  saldah: 'SDAH',
  sealdahjn: 'SDAH',
  sealdahmain: 'SDAH',
  sdah: 'SDAH',

  // Mankundu variations
  mankundu: 'MUU',
  mkd: 'MUU',
  mankunduflag: 'MUU',
  mankundustation: 'MUU',
  muu: 'MUU',

  // Barddhaman / Burdwan variations
  burdwan: 'BWN',
  bardhaman: 'BWN',
  barddhaman: 'BWN',
  bardhamanjn: 'BWN',
  barddhamanjunction: 'BWN',
  burdwanjn: 'BWN',
  bwn: 'BWN',

  // Bandel
  bandel: 'BDC',
  bndl: 'BDC',
  bandeljn: 'BDC',
  bdc: 'BDC',

  // Kharagpur
  kharagpur: 'KGP',
  khargpur: 'KGP',
  kharagpurjn: 'KGP',
  kgp: 'KGP',

  // Kolkata / Calcutta / Chitpur
  kolkata: 'KOAA',
  calcutta: 'HWH',
  chitpur: 'KOAA',
  kolkataterminal: 'KOAA',
  koaa: 'KOAA',
  shalimar: 'SHM',
  shm: 'SHM',

  // Serampore
  serampore: 'SRP',
  srirampur: 'SRP',
  shreerampore: 'SRP',
  serampur: 'SRP',
  srp: 'SRP',

  // Chandannagar
  chandannagar: 'CGR',
  chandernagore: 'CGR',
  chandannagore: 'CGR',
  cgr: 'CHN',
  chn: 'CHN',

  // Chinsurah
  chinsurah: 'CNS',
  chuchura: 'CNS',
  chinsura: 'CNS',
  cns: 'CHT',
  cht: 'CHT',

  // Hindmotor
  hindmotor: 'HMZ',
  hindmotorstation: 'HMZ',
  'hind-motor': 'HMZ',
  hmz: 'HM',
  hm: 'HM',

  // Konnagar
  konnagar: 'KOG',
  kog: 'KON',
  kon: 'KON',

  // Rishra
  rishra: 'RIS',
  ris: 'RIS',

  // Uttarpara
  uttarpara: 'UPA',
  upa: 'UPA',

  // Belur
  belur: 'BEQ',
  beq: 'BEQ',
  belurmath: 'BRMH',
  brmh: 'BRMH',

  // Liluah
  liluah: 'LLH',
  llh: 'LLH',

  // Bally
  bally: 'BLY',
  bly: 'BLY',
  ballygunge: 'BLN',
  bln: 'BLN',

  // Naihati
  naihati: 'NH',
  nh: 'NH',

  // Barrackpore
  barrackpore: 'BP',
  barackpore: 'BP',
  bp: 'BP',

  // Dum Dum
  dumdum: 'DDJ',
  'dum-dum': 'DDJ',
  ddj: 'DDJ',
  dumdumcantt: 'DDC',
  ddc: 'DDC',

  // Ranaghat
  ranaghat: 'RHA',
  rha: 'RHA',

  // Krishnanagar
  krishnanagar: 'KNJ',
  krishnagar: 'KNJ',
  knj: 'KNJ',

  // Shantipur
  shantipur: 'STB',
  santipur: 'STB',
  stb: 'STB',

  // Bangaon
  bangaon: 'BNJ',
  bongaon: 'BNJ',
  bonbaon: 'BNJ',
  bnj: 'BNJ',

  // Barasat
  barasat: 'BT',
  bt: 'BT',

  // Habra
  habra: 'HB',
  hb: 'HB',

  // Tarakeswar
  tarakeswar: 'TAK',
  tarakeshwar: 'TAK',
  tarkeshwar: 'TAK',
  tak: 'TAK',

  // Canning
  canning: 'CG',
  kaning: 'CG',
  cg: 'CG',

  // Diamond Harbour
  diamondharbour: 'DH',
  'diamond-harbour': 'DH',
  dh: 'DH',

  // Budge Budge
  budgebudge: 'BGB',
  'budge-budge': 'BGB',
  bajbaj: 'BGB',
  bgb: 'BGB',

  // Baruipur
  baruipur: 'BRP',
  brp: 'BRP',

  // Sonarpur
  sonarpur: 'SPR',
  spr: 'SPR',

  // Majerhat
  majerhat: 'MJT',
  majherhat: 'MJT',
  mjt: 'MJT',

  // Dankuni
  dankuni: 'DKAE',
  dkae: 'DKAE',

  // Digha
  digha: 'DGHA',
  dgha: 'DGHA',

  // Malda
  malda: 'MLDT',
  maldah: 'MLDT',
  maldatown: 'MLDT',
  mldt: 'MLDT',

  // New Jalpaiguri / Siliguri
  njp: 'NJP',
  newjalpaiguri: 'NJP',
  siliguri: 'SGUJ',
  sguj: 'SGUJ',

  // Asansol
  asansol: 'ASN',
  asansoljn: 'ASN',
  asn: 'ASN',

  // Durgapur
  durgapur: 'DGR',
  dgr: 'DGR',

  // Bolpur Shantiniketan
  bolpur: 'BHP',
  shantiniketan: 'BHP',
  bolpurshantiniketan: 'BHP',
  bhp: 'BHP',

  // Rampurhat
  rampurhat: 'RPH',
  rph: 'RPH',

  // Katwa
  katwa: 'KWAE',
  katwajn: 'KWAE',
  kwae: 'KWAE',

  // Bansberia
  bansberia: 'BSAE',
  bsae: 'BSAE',

  // Tribeni
  tribeni: 'TBAE',
  tbae: 'TBAE',

  // Kuntighat
  kuntighat: 'KJU',
  kju: 'KJU',

  // Ambika Kalna
  ambikakalna: 'ABKA',
  kalna: 'ABKA',
  abka: 'ABKA',

  // Nabadwip Dham
  nabadwip: 'NDAE',
  nabadwipdham: 'NDAE',
  ndae: 'NDAE',

  // Metro Lines
  esplanade: 'M-ESP',
  dakshineswar: 'M-DKS',
  kavisubhash: 'M-KVS',
  sectorv: 'M-SCV',
  'sector-v': 'M-SCV',
  saltlake: 'M-SCV',
  howrahmaidan: 'M-HMD',
  'howrah-maidan': 'M-HMD',
};

function cleanSearchTerm(str: string): string {
  return str
    .toLowerCase()
    .replace(/[(),]/g, ' ')
    .replace(/-to-/g, ' ')
    .replace(/\b(trains?|local|suburban|express|special|fast|mail|emu|memu|metro)\b/g, '')
    .replace(/\b(timings?|time\s*table|timetable|schedules?|today|daily|up|down)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function searchStations(q: string, limit = 25): Promise<CachedStation[]> {
  const stations = await getAllStations();
  const trimmed = q.trim();
  if (!trimmed) {
    return stations.slice(0, limit);
  }

  const cleaned = cleanSearchTerm(trimmed);
  const normalizedKey = cleaned.replace(/[\s\-_]/g, '');
  const lower = trimmed.toLowerCase();
  const upper = trimmed.toUpperCase();

  // 1. Direct typo/synonym alias match
  let typoMatchedStation: CachedStation | null = null;
  const aliasCode = COMMON_TYPOS_AND_SYNONYMS[normalizedKey] || STATION_ALIASES[upper];
  if (aliasCode) {
    typoMatchedStation = stationByCode.get(aliasCode.toUpperCase()) || null;
  }

  // 2. Direct code exact match
  const exactCode = stationByCode.get(upper);

  const codePrefix: CachedStation[] = [];
  const namePrefix: CachedStation[] = [];
  const nameContains: CachedStation[] = [];
  const others: CachedStation[] = [];

  const seenIds = new Set<string>();
  if (exactCode) seenIds.add(exactCode.id);
  if (typoMatchedStation) seenIds.add(typoMatchedStation.id);

  for (const s of stations) {
    if (seenIds.has(s.id)) continue;

    const sCode = s.code.toUpperCase();
    const sNameLower = s.name.toLowerCase();

    if (sCode.startsWith(upper)) {
      codePrefix.push(s);
      seenIds.add(s.id);
    } else if (sNameLower.startsWith(lower) || (cleaned && sNameLower.startsWith(cleaned))) {
      namePrefix.push(s);
      seenIds.add(s.id);
    } else if (sNameLower.includes(lower) || (cleaned && sNameLower.includes(cleaned))) {
      nameContains.push(s);
      seenIds.add(s.id);
    } else if (
      (s.nameBn && s.nameBn.includes(trimmed)) ||
      (s.district && s.district.toLowerCase().includes(lower))
    ) {
      others.push(s);
      seenIds.add(s.id);
    }
  }

  // 3. Fuzzy Levenshtein match fallback if < 3 results
  const fuzzyMatches: CachedStation[] = [];
  if (cleaned.length >= 4 && (codePrefix.length + namePrefix.length + nameContains.length < 5)) {
    for (const s of stations) {
      if (seenIds.has(s.id)) continue;
      const sClean = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const dist = levenshtein(normalizedKey, sClean.slice(0, normalizedKey.length + 2));
      if (dist <= 2) {
        fuzzyMatches.push(s);
        seenIds.add(s.id);
      }
    }
  }

  const results = [
    ...(exactCode ? [exactCode] : []),
    ...(typoMatchedStation && (!exactCode || typoMatchedStation.id !== exactCode.id) ? [typoMatchedStation] : []),
    ...codePrefix,
    ...namePrefix,
    ...nameContains,
    ...fuzzyMatches,
    ...others,
  ];

  return results.slice(0, limit);
}

export async function resolveStation(query: string): Promise<CachedStation | null> {
  if (!query) return null;
  const raw = query.trim();
  if (!raw) return null;

  await getAllStations();

  // 1. Extract code if in format "Station Name (CODE)" or if query is directly "CODE"
  const codeMatch = raw.match(/\(([A-Za-z0-9\-]+)\)$/);
  const codeCandidate = (codeMatch ? codeMatch[1] : raw).toUpperCase();

  // Direct code match
  const byCode = stationByCode.get(codeCandidate);
  if (byCode) return byCode;

  // Code alias match
  const aliasCode = STATION_ALIASES[codeCandidate];
  if (aliasCode && stationByCode.has(aliasCode)) {
    return stationByCode.get(aliasCode)!;
  }

  // 2. Check normalized dictionary for common typos / transliterations (e.g. howrha -> HWH)
  const cleaned = cleanSearchTerm(raw);
  const normalizedKey = cleaned.replace(/[\s\-_]/g, '');

  if (normalizedKey && COMMON_TYPOS_AND_SYNONYMS[normalizedKey]) {
    const targetCode = COMMON_TYPOS_AND_SYNONYMS[normalizedKey].toUpperCase();
    const st = stationByCode.get(targetCode);
    if (st) return st;
  }

  // Check raw without hyphens in dictionary
  const rawNorm = raw.toLowerCase().replace(/[\s\-_()]/g, '');
  if (rawNorm && COMMON_TYPOS_AND_SYNONYMS[rawNorm]) {
    const targetCode = COMMON_TYPOS_AND_SYNONYMS[rawNorm].toUpperCase();
    const st = stationByCode.get(targetCode);
    if (st) return st;
  }

  // 3. Exact name matching
  const clean = raw.replace(/[()]/g, '').trim();
  const lowerClean = clean.toLowerCase();
  const lowerCleanNoHyphen = clean.replace(/-/g, ' ').toLowerCase();

  for (const s of cachedStations || []) {
    const sNameLower = s.name.toLowerCase();
    if (sNameLower === lowerClean || sNameLower === lowerCleanNoHyphen) return s;
    if (cleaned && sNameLower === cleaned) return s;
  }

  // 4. Match without common suffixes like "junction", "jn", "metro", "flag", "halt", "road"
  const stripSuffixes = (str: string) =>
    str.toLowerCase().replace(/\b(junction|jn|metro|flag|halt|road|cantt|cantonment|station)\b/g, '').trim();

  const strippedQuery = stripSuffixes(lowerCleanNoHyphen);
  if (strippedQuery.length >= 3) {
    for (const s of cachedStations || []) {
      const strippedSName = stripSuffixes(s.name);
      if (strippedSName === strippedQuery) return s;
    }
  }

  // 5. Starts-with name or code match
  for (const s of cachedStations || []) {
    const sNameLower = s.name.toLowerCase();
    const sCodeLower = s.code.toLowerCase();
    if (
      sNameLower.startsWith(lowerClean) ||
      sNameLower.startsWith(lowerCleanNoHyphen) ||
      (cleaned && sNameLower.startsWith(cleaned)) ||
      sCodeLower.startsWith(lowerClean) ||
      sCodeLower.startsWith(codeCandidate.toLowerCase())
    ) {
      return s;
    }
  }

  // 6. Bengali name match
  if (/[\u0980-\u09FF]/.test(raw)) {
    for (const s of cachedStations || []) {
      if (s.nameBn && s.nameBn.includes(raw)) return s;
    }
  }

  // 7. Substring match
  for (const s of cachedStations || []) {
    const sNameLower = s.name.toLowerCase();
    if (
      sNameLower.includes(lowerClean) ||
      sNameLower.includes(lowerCleanNoHyphen) ||
      (cleaned && cleaned.length >= 3 && sNameLower.includes(cleaned))
    ) {
      return s;
    }
  }

  // 8. Fuzzy Levenshtein matching fallback for typos (distance <= 2)
  if (normalizedKey.length >= 4) {
    let closestStation: CachedStation | null = null;
    let minDistance = 999;

    for (const s of cachedStations || []) {
      const sClean = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const sPrefix = sClean.slice(0, normalizedKey.length);
      const d = levenshtein(normalizedKey, sPrefix);
      if (d <= 2 && d < minDistance) {
        minDistance = d;
        closestStation = s;
        if (d === 1) break; // Close enough
      }
    }

    if (closestStation && minDistance <= 2) {
      return closestStation;
    }
  }

  return null;
}
