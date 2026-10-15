import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { getCachedTrainByNumber } from '@/lib/cache/trainDataCache';

export async function getTrainByNumber(trainNumber: string) {
  return getCachedTrainByNumber(trainNumber);
}

export async function searchTrains(query: string, limit = 20) {
  const q = query.trim();
  if (!q) return [];

  let list: any[] = [];
  try {
    list = await prisma.train.findMany({
      where: {
        OR: [
          { number: { contains: q } },
          { name: { contains: q } },
          { originStationCode: { contains: q.toUpperCase() } },
          { destinationStationCode: { contains: q.toUpperCase() } },
        ],
      },
      take: limit,
      orderBy: { number: 'asc' },
    });
  } catch (err) {
    // Prisma failed
  }

  if (!list || list.length === 0) {
    const { data } = await supabase
      .from('trains')
      .select('*')
      .or(`number.ilike.%${q}%,name.ilike.%${q}%,origin_station_code.ilike.%${q}%,destination_station_code.ilike.%${q}%`)
      .limit(limit);

    if (data && data.length > 0) {
      list = data.map((t) => ({
        id: t.id,
        number: t.number,
        name: t.name,
        type: t.type,
        originStationCode: t.origin_station_code,
        destinationStationCode: t.destination_station_code,
        runningDays: t.running_days,
        distanceKm: t.distance_km,
      }));
    }
  }

  return list;
}

