import { NextResponse } from 'next/server';
import { planRoute, invalidateRouteIndex } from '@/services/routeService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromQuery = searchParams.get('from')?.trim();
  const toQuery = searchParams.get('to')?.trim();
  const refresh = searchParams.get('refresh') === 'true';

  if (refresh) {
    invalidateRouteIndex();
  }

  if (!fromQuery || !toQuery) {
    return NextResponse.json({ error: 'Both from and to station queries are required' }, { status: 400 });
  }

  try {
    const result = await planRoute(fromQuery, toQuery);

    if ('error' in result && result.error) {
      return NextResponse.json(
        result,
        {
          status: 404,
          headers: {
            'Cache-Control': 'public, max-age=60',
          },
        }
      );
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Cache': 'HIT-ROUTER',
      },
    });
  } catch (error: any) {
    console.error('API /api/routes/plan error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to plan route' },
      { status: 500 }
    );
  }
}
