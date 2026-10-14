import { NextResponse } from 'next/server';
import { searchStations, getAllStations } from '@/lib/station-cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';
  const all = searchParams.get('all') === 'true';

  const results = all ? await getAllStations() : await searchStations(q, q ? 25 : 30);

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
