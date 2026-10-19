import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { resolveStation, CachedStation } from '@/services/stationService';
import { LRUCache } from '@/lib/lru-cache';

export interface PlannedStop {
  station: string;
  code: string;
  arr: string;
  dep: string;
  halt: string;
  day: number;
  platform: string;
}

export interface PlannedTrain {
  train: {
    id: string;
    number: string;
    name: string;
    type: string;
    originStationCode: string;
    destinationStationCode: string;
    runningDays: string;
    distanceKm: number | null;
  };
  departureFrom: string;
  arrivalTo: string;
  fromSequence: number;
  toSequence: number;
  intermediateStopsCount: number;
  via: string;
  allStops: PlannedStop[];
}

export interface RoutePlanResult {
  fromStation: CachedStation;
  toStation: CachedStation;
  trains: PlannedTrain[];
}

// In-memory bounded LRU cache (10,000 route pairs, 30 minutes TTL)
const routeCache = new LRUCache<string, RoutePlanResult>(10000, 30 * 60 * 1000);

interface IndexedStop {
  trainId: string;
  stationId: string;
  stationName: string;
  stationCode: string;
  sequenceNo: number;
  arrivalTime: string | null;
  departureTime: string | null;
  haltMinutes: number;
  dayOffset: number;
}

interface IndexedTrain {
  id: string;
  number: string;
  name: string;
  type: string;
  originStationCode: string;
  destinationStationCode: string;
  runningDays: string;
  distanceKm: number | null;
  stops: IndexedStop[];
}

// ─── Index State ─────────────────────────────────────────────────────────────
// Use a global singleton to survive Next.js hot reloads in dev
const g = global as unknown as {
  _routeIndexState?: {
    isIndexed: boolean;
    isIndexing: boolean;
    indexPromise: Promise<void> | null;
    trainsByIdMap: Map<string, IndexedTrain>;
    stopsByStationIdMap: Map<string, IndexedStop[]>;
    stopsByStationCodeMap: Map<string, IndexedStop[]>; // fallback lookup by code
  };
};

if (!g._routeIndexState) {
  g._routeIndexState = {
    isIndexed: false,
    isIndexing: false,
    indexPromise: null,
    trainsByIdMap: new Map(),
    stopsByStationIdMap: new Map(),
    stopsByStationCodeMap: new Map(),
  };
}

const state = g._routeIndexState;

async function ensureRouteIndex(): Promise<void> {
  // Fast path: already indexed
  if (state.isIndexed) return;

  // Already indexing — wait for the existing promise
  if (state.isIndexing && state.indexPromise) {
    return state.indexPromise;
  }

  // Start indexing
  state.isIndexing = true;
  state.indexPromise = (async () => {
    try {
      console.log('[routeService] Building in-memory route index from DB...');
      const t0 = Date.now();

      let allTrains: any[] = [];
      try {
        allTrains = await prisma.train.findMany({
          select: {
            id: true,
            number: true,
            name: true,
            type: true,
            originStationCode: true,
            destinationStationCode: true,
            runningDays: true,
            distanceKm: true,
            scheduleStops: {
              select: {
                stationId: true,
                sequenceNo: true,
                arrivalTime: true,
                departureTime: true,
                haltMinutes: true,
                dayOffset: true,
                station: {
                  select: {
                    name: true,
                    code: true,
                  },
                },
              },
              orderBy: { sequenceNo: 'asc' },
            },
          },
        });
      } catch (prismaErr) {
        console.warn('[routeService] Prisma trains query failed, trying Supabase fallback...');
      }

      // If Prisma returned empty list (e.g. SQLite on Vercel Serverless), fetch from Supabase
      if (!allTrains || allTrains.length === 0) {
        const { data, error } = await supabase
          .from('trains')
          .select('*, schedule_stops(*, stations(name, code))');

        if (error) {
          console.error('[routeService] Supabase trains query error:', error.message);
        } else if (data && data.length > 0) {
          allTrains = data.map((t) => ({
            id: t.id,
            number: t.number,
            name: t.name,
            type: t.type,
            originStationCode: t.origin_station_code,
            destinationStationCode: t.destination_station_code,
            runningDays: t.running_days,
            distanceKm: t.distance_km,
            scheduleStops: (t.schedule_stops || [])
              .sort((a: any, b: any) => a.sequence_no - b.sequence_no)
              .map((s: any) => ({
                stationId: s.station_id,
                sequenceNo: s.sequence_no,
                arrivalTime: s.arrival_time,
                departureTime: s.departure_time,
                haltMinutes: s.halt_minutes,
                dayOffset: s.day_offset,
                station: {
                  name: s.stations?.name || '',
                  code: s.stations?.code || '',
                },
              })),
          }));
        }
      }

      state.trainsByIdMap.clear();
      state.stopsByStationIdMap.clear();
      state.stopsByStationCodeMap.clear();

      for (const t of allTrains) {
        const mappedStops: IndexedStop[] = (t.scheduleStops || []).map((s: any) => ({
          trainId: t.id,
          stationId: s.stationId,
          stationName: s.station?.name || '',
          stationCode: (s.station?.code || '').toUpperCase(),
          sequenceNo: s.sequenceNo,
          arrivalTime: s.arrivalTime,
          departureTime: s.departureTime,
          haltMinutes: s.haltMinutes,
          dayOffset: s.dayOffset,
        }));

        state.trainsByIdMap.set(t.id, {
          id: t.id,
          number: t.number,
          name: t.name,
          type: t.type,
          originStationCode: t.originStationCode,
          destinationStationCode: t.destinationStationCode,
          runningDays: t.runningDays,
          distanceKm: t.distanceKm,
          stops: mappedStops,
        });

        for (const stop of mappedStops) {
          // Index by station UUID
          const byId = state.stopsByStationIdMap.get(stop.stationId) || [];
          byId.push(stop);
          state.stopsByStationIdMap.set(stop.stationId, byId);

          // Index by station CODE (fallback, case-insensitive)
          const byCode = state.stopsByStationCodeMap.get(stop.stationCode) || [];
          byCode.push(stop);
          state.stopsByStationCodeMap.set(stop.stationCode, byCode);
        }
      }

      state.isIndexed = true;
      routeCache.clear();
      console.log(
        `[routeService] Route index built: ${allTrains.length} trains, ${state.stopsByStationIdMap.size} stations in ${Date.now() - t0}ms`
      );
    } catch (err) {
      console.error('[routeService] Error building route index:', err);
      // Don't mark as indexed so next request retries
      state.isIndexed = false;
    } finally {
      state.isIndexing = false;
      state.indexPromise = null;
    }
  })();

  return state.indexPromise;
}

// Call this after DB changes to force a fresh rebuild on next request
export function invalidateRouteIndex() {
  state.isIndexed = false;
  state.isIndexing = false;
  state.indexPromise = null;
  state.trainsByIdMap.clear();
  state.stopsByStationIdMap.clear();
  state.stopsByStationCodeMap.clear();
  routeCache.clear();
  console.log('[routeService] Route index invalidated — will rebuild on next request.');
}


const STATION_ALIASES: Record<string, string> = {
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

  // Tribeni & Kuntighat & Majerhat & Taki Road & Fulia
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

function getStopsForStation(stationId: string, stationCode: string): IndexedStop[] {
  const upper = stationCode.toUpperCase();
  const combinedMap = new Map<string, IndexedStop>();

  // Helper to add stops avoiding train duplicate entries (prefer lowest sequence)
  const addStops = (stops: IndexedStop[] | undefined) => {
    if (!stops) return;
    for (const s of stops) {
      const existing = combinedMap.get(s.trainId);
      if (!existing || s.sequenceNo < existing.sequenceNo) {
        combinedMap.set(s.trainId, s);
      }
    }
  };

  // 1. By station UUID
  addStops(state.stopsByStationIdMap.get(stationId));

  // 2. By canonical code
  addStops(state.stopsByStationCodeMap.get(upper));

  // 3. By aliases (e.g. M-ESP <-> M-ESP2, TBAE <-> TRS, KJU <-> KGT, MJT <-> MJHT)
  const alias = STATION_ALIASES[upper];
  if (alias) {
    addStops(state.stopsByStationCodeMap.get(alias));
    const revAlias = STATION_ALIASES[alias];
    if (revAlias && revAlias !== upper) {
      addStops(state.stopsByStationCodeMap.get(revAlias));
    }
  }

  return Array.from(combinedMap.values());
}

export async function planRoute(
  fromQuery: string,
  toQuery: string
): Promise<RoutePlanResult | { error: string; fromStation?: CachedStation | null; toStation?: CachedStation | null }> {
  const cacheKey = `${fromQuery.trim().toUpperCase()}:::${toQuery.trim().toUpperCase()}`;
  const cached = routeCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const [fromStation, toStation] = await Promise.all([
    resolveStation(fromQuery),
    resolveStation(toQuery),
  ]);

  if (!fromStation || !toStation) {
    return {
      error: `Station not found (${!fromStation ? fromQuery : toQuery})`,
      fromStation,
      toStation,
    };
  }

  await ensureRouteIndex();

  const fromStops = getStopsForStation(fromStation.id, fromStation.code);
  if (fromStops.length === 0) {
    const emptyResult: RoutePlanResult = { fromStation, toStation, trains: [] };
    routeCache.set(cacheKey, emptyResult);
    return emptyResult;
  }

  // Build fromStop map: trainId → stop at fromStation (use earliest occurrence = lowest seq)
  const fromStopMap = new Map<string, IndexedStop>();
  for (const s of fromStops) {
    const existing = fromStopMap.get(s.trainId);
    if (!existing || s.sequenceNo < existing.sequenceNo) {
      fromStopMap.set(s.trainId, s);
    }
  }

  const toStops = getStopsForStation(toStation.id, toStation.code);
  if (toStops.length === 0) {
    const emptyResult: RoutePlanResult = { fromStation, toStation, trains: [] };
    routeCache.set(cacheKey, emptyResult);
    return emptyResult;
  }

  const matchingTrains: PlannedTrain[] = [];

  for (const toStop of toStops) {
    const fromStop = fromStopMap.get(toStop.trainId);
    if (!fromStop || toStop.sequenceNo <= fromStop.sequenceNo) continue;

    const train = state.trainsByIdMap.get(toStop.trainId);
    if (!train) continue;

    const allStops = train.stops;
    const intermediateStops = allStops.filter(
      (s) => s.sequenceNo > fromStop.sequenceNo && s.sequenceNo < toStop.sequenceNo
    );

    const viaStations = intermediateStops
      .slice(0, 3)
      .map((s) => s.stationName.replace(' Junction', ' Jn'))
      .join(', ');

    matchingTrains.push({
      train: {
        id: train.id,
        number: train.number,
        name: train.name,
        type: train.type,
        originStationCode: train.originStationCode,
        destinationStationCode: train.destinationStationCode,
        runningDays: train.runningDays,
        distanceKm: train.distanceKm,
      },
      departureFrom: fromStop.departureTime || fromStop.arrivalTime || '--',
      arrivalTo: toStop.arrivalTime || toStop.departureTime || '--',
      fromSequence: fromStop.sequenceNo,
      toSequence: toStop.sequenceNo,
      intermediateStopsCount: intermediateStops.length,
      via: viaStations || `${fromStation.name} to ${toStation.name} Direct`,
      allStops: allStops.map((s) => ({
        station: s.stationName,
        code: s.stationCode,
        arr: s.arrivalTime || 'Source',
        dep: s.departureTime || 'Destination',
        halt: s.haltMinutes > 0 ? `${s.haltMinutes}m` : '--',
        day: s.dayOffset,
        platform: '1',
      })),
    });
  }

  // Sort by departure time ascending
  matchingTrains.sort((a, b) => {
    const tA = a.departureFrom || '00:00';
    const tB = b.departureFrom || '00:00';
    return tA.localeCompare(tB);
  });

  const responseData: RoutePlanResult = {
    fromStation,
    toStation,
    trains: matchingTrains,
  };

  routeCache.set(cacheKey, responseData);
  return responseData;
}

// Auto pre-warm top high-traffic corridors so first user gets <50ms response
if (typeof window === 'undefined') {
  setTimeout(() => {
    const prewarmCorridors = [
      ['HWH', 'BWN'],
      ['BWN', 'HWH'],
      ['HWH', 'BDC'],
      ['BDC', 'HWH'],
      ['SDAH', 'RHA'],
      ['RHA', 'SDAH'],
      ['SDAH', 'KNJ'],
      ['KNJ', 'SDAH'],
      ['SDAH', 'BNJ'],
      ['BNJ', 'SDAH'],
      ['HWH', 'KGP'],
      ['KGP', 'HWH'],
      ['HWH', 'DGHA'],
      ['BDC', 'KWAE'],
      // Howrah Main Line — high traffic stations
      ['HMZ', 'HWH'],  // Hindmotor → Howrah
      ['HWH', 'HMZ'],
      ['BWN', 'BDC'],
      ['DKAE', 'HWH'], // Dankuni → Howrah
      ['SRP', 'HWH'],  // Serampore → Howrah
      ['CGR', 'HWH'],  // Chandannagar → Howrah
    ];
    for (const [from, to] of prewarmCorridors) {
      planRoute(from, to).catch(() => { });
    }
  }, 50); // Pre-warm quickly on server start
}
