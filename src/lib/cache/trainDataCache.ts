import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
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
      let stations: any[] = [];
      try {
        stations = await prisma.station.findMany({
          orderBy: { name: 'asc' },
        });
      } catch (prismaErr) {
        console.warn('[trainDataCache] Prisma stations query failed, using Supabase fallback...');
      }

      if (!stations || stations.length === 0) {
        const { data, error } = await supabase
          .from('stations')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error('[trainDataCache] Supabase stations error:', error.message);
        } else if (data && data.length > 0) {
          stations = data.map((s) => ({
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

  let station: any = null;
  try {
    station = await prisma.station.findUnique({
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
  } catch (e) {
    // Prisma failed (e.g. SQLite missing on Vercel)
  }

  if (!station) {
    const { data: stData } = await supabase
      .from('stations')
      .select('*, schedule_stops(*, trains(*))')
      .eq('code', upper)
      .maybeSingle();

    if (stData) {
      const sortedStops = (stData.schedule_stops || [])
        .map((s: any) => ({
          id: s.id,
          trainId: s.train_id,
          stationId: s.station_id,
          sequenceNo: s.sequence_no,
          dayOffset: s.day_offset,
          arrivalTime: s.arrival_time,
          departureTime: s.departure_time,
          haltMinutes: s.halt_minutes,
          source: s.source,
          train: s.trains
            ? {
                id: s.trains.id,
                number: s.trains.number,
                name: s.trains.name,
                type: s.trains.type,
                originStationCode: s.trains.origin_station_code,
                destinationStationCode: s.trains.destination_station_code,
                runningDays: s.trains.running_days,
                distanceKm: s.trains.distance_km,
              }
            : null,
        }))
        .sort((a: any, b: any) => {
          const tA = a.departureTime || a.arrivalTime || '00:00';
          const tB = b.departureTime || b.arrivalTime || '00:00';
          return tA.localeCompare(tB);
        });

      station = {
        id: stData.id,
        code: stData.code,
        name: stData.name,
        nameBn: stData.name_bn,
        zone: stData.zone,
        division: stData.division,
        district: stData.district,
        lat: stData.lat,
        lng: stData.lng,
        scheduleStops: sortedStops,
      };
    }
  }

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

  let train: any = null;
  try {
    train = await prisma.train.findUnique({
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
  } catch (e) {
    // Prisma failed
  }

  if (!train) {
    const { data: trData } = await supabase
      .from('trains')
      .select('*, schedule_stops(*, stations(*))')
      .eq('number', clean)
      .maybeSingle();

    if (trData) {
      const sortedStops = (trData.schedule_stops || [])
        .map((s: any) => ({
          id: s.id,
          trainId: s.train_id,
          stationId: s.station_id,
          sequenceNo: s.sequence_no,
          dayOffset: s.day_offset,
          arrivalTime: s.arrival_time,
          departureTime: s.departure_time,
          haltMinutes: s.halt_minutes,
          source: s.source,
          station: s.stations
            ? {
                id: s.stations.id,
                code: s.stations.code,
                name: s.stations.name,
                nameBn: s.stations.name_bn,
                zone: s.stations.zone,
                division: s.stations.division,
              }
            : null,
        }))
        .sort((a: any, b: any) => a.sequenceNo - b.sequenceNo);

      train = {
        id: trData.id,
        number: trData.number,
        name: trData.name,
        type: trData.type,
        originStationCode: trData.origin_station_code,
        destinationStationCode: trData.destination_station_code,
        runningDays: trData.running_days,
        distanceKm: trData.distance_km,
        scheduleStops: sortedStops,
      };
    }
  }

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
