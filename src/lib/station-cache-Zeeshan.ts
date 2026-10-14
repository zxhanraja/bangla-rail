/**
 * Unified Station Cache - Re-exports from stationService for clean modularity
 */
export {
  getAllStations,
  findStationByCode,
  findStationById,
  searchStations,
  resolveStation,
  getStationWithSchedule,
  type CachedStation,
} from '@/services/stationService';
