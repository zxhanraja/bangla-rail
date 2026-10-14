import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const { number } = await params;

  const train = await prisma.train.findUnique({
    where: { number },
    include: {
      scheduleStops: {
        include: {
          station: true,
        },
        orderBy: {
          sequenceNo: 'asc',
        },
      },
    },
  });

  if (!train) {
    return NextResponse.json({ error: 'Train not found' }, { status: 404 });
  }

  return NextResponse.json(train, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
