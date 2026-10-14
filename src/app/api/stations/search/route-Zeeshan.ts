import { NextResponse } from 'next/server';
import { searchStations, getAllStations } from '@/services/stationService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const isAll = searchParams.get('all') === '1' || searchParams.get('limit') === 'all';

  const results = isAll ? await getAllStations() : await searchStations(q, q ? 25 : 35);

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
    },
  });
}

