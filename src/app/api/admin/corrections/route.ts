import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromCookies } from '@/lib/auth';

export async function GET(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || 'pending';

  const corrections = await prisma.correction.findMany({
    where: statusFilter === 'all' ? {} : { status: statusFilter },
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json(corrections);
}

export async function PUT(request: Request) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const { id, action, arrivalTime, departureTime } = await request.json();

    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Valid id and action (approve/reject) are required' }, { status: 400 });
    }

    const correction = await prisma.correction.findUnique({ where: { id: Number(id) } });
    if (!correction) {
      return NextResponse.json({ error: 'Correction request not found' }, { status: 404 });
    }

    if (action === 'reject') {
      const updated = await prisma.correction.update({
        where: { id: Number(id) },
        data: {
          status: 'rejected',
          reviewedBy: admin.email,
          reviewedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, correction: updated });
    }

    // Approve Action: Merge into schedule_stops
    // 1. Ensure station exists
    let station = await prisma.station.findUnique({
      where: { code: correction.stationCode },
    });

    if (!station) {
      station = await prisma.station.create({
        data: {
          code: correction.stationCode,
          name: correction.stationName || `Station ${correction.stationCode}`,
          nameBn: correction.stationName || `স্টেশন ${correction.stationCode}`,
          zone: 'ER',
          division: 'West Bengal',
        },
      });
    }

    // 2. Ensure train exists
    let train = await prisma.train.findUnique({
      where: { number: correction.trainNumber },
    });

    if (!train) {
      train = await prisma.train.create({
        data: {
          number: correction.trainNumber,
          name: correction.trainName || `Train ${correction.trainNumber}`,
          type: 'Passenger',
          originStationCode: correction.fromStation || 'HWH',
          destinationStationCode: correction.toStation || 'SDAH',
          runningDays: 'Daily',
        },
      });
    }

    // 3. Upsert schedule stop
    const arr = arrivalTime || correction.arrivalTime;
    const dep = departureTime || correction.departureTime;

    const existingStop = await prisma.scheduleStop.findFirst({
      where: {
        trainId: train.id,
        stationId: station.id,
      },
    });

    if (existingStop) {
      await prisma.scheduleStop.update({
        where: { id: existingStop.id },
        data: {
          arrivalTime: arr,
          departureTime: dep,
          source: 'community',
          lastVerifiedAt: new Date(),
        },
      });
    } else {
      // Find max sequence number to append
      const lastStop = await prisma.scheduleStop.findFirst({
        where: { trainId: train.id },
        orderBy: { sequenceNo: 'desc' },
      });
      const seq = lastStop ? lastStop.sequenceNo + 1 : 1;

      await prisma.scheduleStop.create({
        data: {
          trainId: train.id,
          stationId: station.id,
          sequenceNo: seq,
          arrivalTime: arr,
          departureTime: dep,
          source: 'community',
          lastVerifiedAt: new Date(),
        },
      });
    }

    // 4. Update correction record
    const updatedCorrection = await prisma.correction.update({
      where: { id: Number(id) },
      data: {
        status: 'approved',
        reviewedBy: admin.email,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Correction approved and schedule merged successfully',
      correction: updatedCorrection,
    });
  } catch (error) {
    console.error('Admin correction approval error:', error);
    return NextResponse.json({ error: 'Failed to process correction' }, { status: 500 });
  }
}
