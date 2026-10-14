import { NextResponse } from 'next/server';
import { getStationWithSchedule } from '@/services/stationService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const station = await getStationWithSchedule(code);

  if (!station) {
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  }

  return NextResponse.json(station, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
