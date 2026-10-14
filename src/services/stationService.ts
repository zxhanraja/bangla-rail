import { 
  StationData,
  getAllCachedStations, 
  getCachedStationByCode, 
  getCachedStationById, 
  searchCachedStations,
  getCachedStationWithSchedule 
} from '@/lib/cache/trainDataCache';

export type CachedStation = StationData;

export async function getAllStations(): Promise<CachedStation[]> {
  return getAllCachedStations();
}

export async function findStationByCode(code: string): Promise<CachedStation | null> {
  return getCachedStationByCode(code);
}

export async function findStationById(id: string): Promise<CachedStation | null> {
  return getCachedStationById(id);
}

export async function searchStations(q: string, limit = 25): Promise<CachedStation[]> {
  return searchCachedStations(q, limit);
}

export { resolveStation } from '@/lib/station-cache';

export async function getStationWithSchedule(code: string) {
  const station = await getCachedStationWithSchedule(code);
  if (!station) return null;

  const sortedStops = [...station.scheduleStops].sort((a: any, b: any) => {
    const timeA = a.departureTime || a.arrivalTime || '00:00';
    const timeB = b.departureTime || b.arrivalTime || '00:00';
    return timeA.localeCompare(timeB);
  });

  return {
    ...station,
    scheduleStops: sortedStops,
  };
}
