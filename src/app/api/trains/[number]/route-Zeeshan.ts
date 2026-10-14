import { NextResponse } from 'next/server';
import { getTrainByNumber } from '@/services/trainService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;
  const train = await getTrainByNumber(number);

  if (!train) {
    return NextResponse.json({ error: 'Train not found' }, { status: 404 });
  }

  return NextResponse.json(train, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
