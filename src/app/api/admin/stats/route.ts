import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const [totalStations, totalTrains, totalStops, pendingCorrections, approvedCorrections] = await Promise.all([
    prisma.station.count(),
    prisma.train.count(),
    prisma.scheduleStop.count(),
    prisma.correction.count({ where: { status: 'pending' } }),
    prisma.correction.count({ where: { status: 'approved' } }),
  ]);

  return NextResponse.json({
    totalStations,
    totalTrains,
    totalStops,
    pendingCorrections,
    approvedCorrections,
  });
}
