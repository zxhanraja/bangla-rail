import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    const defaultTrains = await prisma.train.findMany({
      take: 15,
      orderBy: { number: 'asc' },
    });
    return NextResponse.json(defaultTrains, {
      headers: {
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
      },
    });
  }

  const trains = await prisma.train.findMany({
    where: {
      OR: [
        { number: { contains: q } },
        { name: { contains: q } },
        { type: { contains: q } },
      ],
    },
    take: 20,
    orderBy: { number: 'asc' },
  });

  return NextResponse.json(trains, {
    headers: {
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
    },
  });
}
