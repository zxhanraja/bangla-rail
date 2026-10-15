import { NextResponse } from 'next/server';
import { getCachedTrainByNumber } from '@/lib/cache/trainDataCache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  const train = await getCachedTrainByNumber(number);

  if (!train) {
    return NextResponse.json({ error: 'Train not found' }, { status: 404 });
  }

  return NextResponse.json(train, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

