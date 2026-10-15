import { NextResponse } from 'next/server';
import { getCachedStationWithSchedule } from '@/lib/cache/trainDataCache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const station = await getCachedStationWithSchedule(upperCode);

  if (!station) {
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  }

  // Sort scheduleStops chronologically by departure or arrival time
  const sortedStops = [...(station.scheduleStops || [])].sort((a: any, b: any) => {
    const timeA = a.departureTime || a.arrivalTime || '00:00';
    const timeB = b.departureTime || b.arrivalTime || '00:00';
    return timeA.localeCompare(timeB);
  });

  return NextResponse.json(
    {
      ...station,
      scheduleStops: sortedStops,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  );
}

