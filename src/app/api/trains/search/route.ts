import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() || '';

  if (!q) {
    let defaultTrains: any[] = [];
    try {
      defaultTrains = await prisma.train.findMany({
        take: 15,
        orderBy: { number: 'asc' },
      });
    } catch (e) {
      // Prisma failed
    }

    if (!defaultTrains || defaultTrains.length === 0) {
      const { data } = await supabase
        .from('trains')
        .select('*')
        .order('number', { ascending: true })
        .limit(15);
      if (data) {
        defaultTrains = data.map((t) => ({
          id: t.id,
          number: t.number,
          name: t.name,
          type: t.type,
          originStationCode: t.origin_station_code,
          destinationStationCode: t.destination_station_code,
          runningDays: t.running_days,
          distanceKm: t.distance_km,
        }));
      }
    }

    return NextResponse.json(defaultTrains, {
      headers: {
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
      },
    });
  }

  let trains: any[] = [];
  try {
    trains = await prisma.train.findMany({
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
  } catch (e) {
    // Prisma failed
  }

  if (!trains || trains.length === 0) {
    const { data } = await supabase
      .from('trains')
      .select('*')
      .or(`number.ilike.%${q}%,name.ilike.%${q}%,type.ilike.%${q}%`)
      .order('number', { ascending: true })
      .limit(20);

    if (data) {
      trains = data.map((t) => ({
        id: t.id,
        number: t.number,
        name: t.name,
        type: t.type,
        originStationCode: t.origin_station_code,
        destinationStationCode: t.destination_station_code,
        runningDays: t.running_days,
        distanceKm: t.distance_km,
      }));
    }
  }

  return NextResponse.json(trains, {
    headers: {
      'Cache-Control': 'public, max-age=1800, stale-while-revalidate=86400',
    },
  });
}

