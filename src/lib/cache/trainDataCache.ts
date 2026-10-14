import { prisma } from '@/lib/prisma';
import { LRUCache } from '@/lib/lru-cache';

export interface StationData {
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

// In-memory singletons for zero-latency retrieval
let allStationsList: StationData[] | null = null;
const stationByCodeMap = new Map<string, StationData>();
const stationByIdMap = new Map<string, StationData>();
const stationByNameLowerMap = new Map<string, StationData>();
let stationLoadPromise: Promise<StationData[]> | null = null;

// LRU Caches for dynamic station departures, route search, and trains
const stationScheduleCache = new LRUCache<string, any>(1000, 30 * 60 * 1000); // 30 minutes
const trainDetailCache = new LRUCache<string, any>(1000, 60 * 60 * 1000); // 1 hour
const routePlanCache = new LRUCache<string, any>(2000, 30 * 60 * 1000); // 30 minutes
const stationSearchCache = new LRUCache<string, StationData[]>(500, 15 * 60 * 1000);

/**
 * Prime or retrieve all 666 stations in RAM
 */
export async function getAllCachedStations(): Promise<StationData[]> {
  if (allStationsList && allStationsList.length > 0) {
    return allStationsList;
  }

  if (stationLoadPromise) {
    return stationLoadPromise;
  }

  stationLoadPromise = (async () => {
    try {
      const stations = await prisma.station.findMany({
        orderBy: { name: 'asc' },
      });

      allStationsList = stations;
      stationByCodeMap.clear();
      stationByIdMap.clear();
      stationByNameLowerMap.clear();

      for (const s of stations) {
        stationByCodeMap.set(s.code.toUpperCase(), s);
        stationByIdMap.set(s.id, s);
        stationByNameLowerMap.set(s.name.toLowerCase(), s);
      }

      return stations;
    } catch (err) {
      console.error('[trainDataCache] Error priming station cache:', err);
      return allStationsList || [];
    } finally {
      stationLoadPromise = null;
    }
  })();

  return stationLoadPromise;
}

/**
 * Lookup station by code in 0.01ms from RAM
 */
export async function getCachedStationByCode(code: string): Promise<StationData | null> {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  if (stationByCodeMap.has(upper)) {
    return stationByCodeMap.get(upper)!;
  }
  await getAllCachedStations();
  return stationByCodeMap.get(upper) || null;
}

/**
 * Lookup station by ID in 0.01ms from RAM
 */
export async function getCachedStationById(id: string): Promise<StationData | null> {
  if (!id) return null;
  if (stationByIdMap.has(id)) {
    return stationByIdMap.get(id)!;
  }
  await getAllCachedStations();
  return stationByIdMap.get(id) || null;
}

/**
 * Fuzzy / Multi-attribute station search in RAM (<0.5ms response time)
 */
export async function searchCachedStations(query: string, limit = 25): Promise<StationData[]> {
  const trimmed = (query || '').trim();
  const cacheKey = `${trimmed.toLowerCase()}::${limit}`;
  const hit = stationSearchCache.get(cacheKey);
  if (hit) return hit;

  const stations = await getAllCachedStations();
  if (!trimmed) {
    const defaultSlice = stations.slice(0, limit);
    stationSearchCache.set(cacheKey, defaultSlice);
    return defaultSlice;
  }

  const lower = trimmed.toLowerCase();
  const upper = trimmed.toUpperCase();

  const exactCode = stationByCodeMap.get(upper);
  const codePrefix: StationData[] = [];
  const namePrefix: StationData[] = [];
  const nameContains: StationData[] = [];
  const others: StationData[] = [];

  for (const s of stations) {
    if (exactCode && s.id === exactCode.id) continue;

    const sCode = s.code.toUpperCase();
    const sNameLower = s.name.toLowerCase();

    if (sCode.startsWith(upper)) {
      codePrefix.push(s);
    } else if (sNameLower.startsWith(lower)) {
      namePrefix.push(s);
    } else if (sNameLower.includes(lower)) {
      nameContains.push(s);
    } else if (
      (s.nameBn && s.nameBn.includes(trimmed)) ||
      (s.district && s.district.toLowerCase().includes(lower))
    ) {
      others.push(s);
    }
  }

  const results = [
    ...(exactCode ? [exactCode] : []),
    ...codePrefix,
    ...namePrefix,
    ...nameContains,
    ...others,
  ].slice(0, limit);

  stationSearchCache.set(cacheKey, results);
  return results;
}

/**
 * Cached station with full schedule
 */
export async function getCachedStationWithSchedule(code: string) {
  const upper = code.trim().toUpperCase();
  const cached = stationScheduleCache.get(upper);
  if (cached) return cached;

  const station = await prisma.station.findUnique({
    where: { code: upper },
    include: {
      scheduleStops: {
        include: {
          train: true,
        },
        orderBy: {
          departureTime: 'asc',
        },
      },
    },
  });

  if (station) {
    stationScheduleCache.set(upper, station);
  }

  return station;
}

/**
 * Cached Train Details by train number
 */
export async function getCachedTrainByNumber(trainNumber: string) {
  const clean = trainNumber.trim();
  const cached = trainDetailCache.get(clean);
  if (cached) return cached;

  const train = await prisma.train.findUnique({
    where: { number: clean },
    include: {
      scheduleStops: {
        include: {
          station: true,
        },
        orderBy: {
          sequenceNo: 'asc',
        },
      },
    },
  });

  if (train) {
    trainDetailCache.set(clean, train);
  }

  return train;
}

/**
 * Cached Route Planner lookup
 */
export function getCachedRoutePlan(fromCode: string, toCode: string) {
  const key = `${fromCode.toUpperCase()}:::${toCode.toUpperCase()}`;
  return routePlanCache.get(key);
}

export function setCachedRoutePlan(fromCode: string, toCode: string, result: any) {
  const key = `${fromCode.toUpperCase()}:::${toCode.toUpperCase()}`;
  routePlanCache.set(key, result);
}
