import { prisma } from '@/lib/prisma';
import { getCachedTrainByNumber } from '@/lib/cache/trainDataCache';

export async function getTrainByNumber(trainNumber: string) {
  return getCachedTrainByNumber(trainNumber);
}

export async function searchTrains(query: string, limit = 20) {
  const q = query.trim();
  if (!q) return [];

  return prisma.train.findMany({
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
}
