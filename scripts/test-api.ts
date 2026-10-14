import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function runTests() {
  console.log('🧪 Starting Bangla Rail System Tests...\n');

  try {
    // Test 1: Verify Stations count
    const stationCount = await prisma.station.count();
    console.log(`✅ [DB Check] West Bengal Stations in DB: ${stationCount}`);
    if (stationCount < 10) throw new Error('Expected at least 10 stations in database');

    // Test 2: Search station by code (SDAH) and Bengali name (হাওড়া)
    const sdah = await prisma.station.findUnique({ where: { code: 'SDAH' } });
    if (!sdah) throw new Error('Sealdah (SDAH) station not found');
    console.log(`✅ [Station Test] Found station: ${sdah.name} (${sdah.code}) - Bengali: ${sdah.nameBn}`);

    const hwh = await prisma.station.findFirst({ where: { nameBn: { contains: 'হাওড়া' } } });
    if (!hwh) throw new Error('Howrah station by Bengali name not found');
    console.log(`✅ [Bengali Search] Found station by Bengali name: ${hwh.name} (${hwh.code})`);

    // Test 3: Verify Train 31211 (Sealdah - Ranaghat Local) and its stops
    const train31211 = await prisma.train.findUnique({
      where: { number: '31211' },
      include: {
        scheduleStops: {
          include: { station: true },
          orderBy: { sequenceNo: 'asc' },
        },
      },
    });

    if (!train31211) throw new Error('Train 31211 not found');
    console.log(`✅ [Train Route Test] Train ${train31211.number} - ${train31211.name} has ${train31211.scheduleStops.length} stops.`);
    console.log(`   Stops: ${train31211.scheduleStops.map(s => `${s.station.code} (${s.departureTime || s.arrivalTime})`).join(' -> ')}`);

    // Test 4: Verify Station-to-Station Direct Route Planning (SDAH to CG)
    const fromStation = await prisma.station.findUnique({ where: { code: 'SDAH' } });
    const toStation = await prisma.station.findUnique({ where: { code: 'CG' } });

    if (fromStation && toStation) {
      const fromStops = await prisma.scheduleStop.findMany({
        where: { stationId: fromStation.id },
      });

      let directCount = 0;
      for (const fStop of fromStops) {
        const tStop = await prisma.scheduleStop.findFirst({
          where: {
            trainId: fStop.trainId,
            stationId: toStation.id,
            sequenceNo: { gt: fStop.sequenceNo },
          },
        });
        if (tStop) directCount++;
      }
      console.log(`✅ [Route Planner Test] Direct trains from SDAH to CG: ${directCount}`);
    }

    // Test 4b: Verify Adisaptagram (ADST) to Howrah (HWH) all-day timetable
    const adstStation = await prisma.station.findUnique({ where: { code: 'ADST' } });
    const hwhStation = await prisma.station.findUnique({ where: { code: 'HWH' } });
    if (adstStation && hwhStation) {
      const adstStops = await prisma.scheduleStop.findMany({
        where: { stationId: adstStation.id },
        include: { train: true }
      });

      const adstToHwhTrains = [];
      for (const fStop of adstStops) {
        const tStop = await prisma.scheduleStop.findFirst({
          where: {
            trainId: fStop.trainId,
            stationId: hwhStation.id,
            sequenceNo: { gt: fStop.sequenceNo },
          },
        });
        if (tStop) {
          adstToHwhTrains.push({
            trainNumber: fStop.train.number,
            trainName: fStop.train.name,
            dep: fStop.departureTime || fStop.arrivalTime,
            arr: tStop.arrivalTime || tStop.departureTime
          });
        }
      }
      adstToHwhTrains.sort((a, b) => (a.dep || '').localeCompare(b.dep || ''));
      console.log(`✅ [ADST -> HWH Test] Total Daily Trains from Adisaptagram to Howrah: ${adstToHwhTrains.length}`);
      adstToHwhTrains.forEach(t => {
        console.log(`   Train ${t.trainNumber} - ${t.trainName}: ADST ${t.dep} -> HWH ${t.arr}`);
      });
    }

    // Test 5: Verify Moderation Queue & Admin Auth
    const pendingCount = await prisma.correction.count({ where: { status: 'pending' } });
    console.log(`✅ [Moderation Queue Test] Pending corrections awaiting owner review: ${pendingCount}`);

    const admin = await prisma.adminUser.findUnique({ where: { email: 'admin@banglarail.in' } });
    if (!admin) throw new Error('Admin user not found');

    const validPass = await bcrypt.compare('admin123', admin.passwordHash);
    if (!validPass) throw new Error('Admin password hash verification failed');
    console.log(`✅ [Admin Auth Test] Admin password check passed for ${admin.email}`);

    console.log('\n🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Test failure:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
