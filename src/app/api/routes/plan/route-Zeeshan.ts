import { NextResponse } from 'next/server';
import { planRoute } from '@/services/routeService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromQuery = searchParams.get('from')?.trim();
  const toQuery = searchParams.get('to')?.trim();

  if (!fromQuery || !toQuery) {
    return NextResponse.json(
      { error: 'Both from and to station queries are required' },
      { status: 400 }
    );
  }

  const result = await planRoute(fromQuery, toQuery);

  if ('error' in result) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
