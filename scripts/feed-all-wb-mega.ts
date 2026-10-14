import { createClient } from '@supabase/supabase-js';
import { prisma } from '../src/lib/prisma';
import { MEGA_WB_STATIONS } from './mega-wb-stations';
import { MEGA_WB_TRAINS } from './mega-wb-trains';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qiujipyowxlcpqpvphjg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdWppcHlvd3hsY3BxcHZwaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTA3MjcsImV4cCI6MjEwMzI4NjcyN30.pG-YAEyyhEXLgqy7iy7HiMr3O5eNGfzdx7Dkeyq-FIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMegaFeed() {
  console.log('🚄 Starting 100% Comprehensive West Bengal Stations, Trains & Metro Feed to Supabase...\n');

  // =========================================================================
  // STEP 1: Process & Upsert All Unique Stations in Local Prisma DB
  // =========================================================================
  const stationCodeMap = new Map<string, typeof MEGA_WB_STATIONS[0]>();
  for (const s of MEGA_WB_STATIONS) {
    stationCodeMap.set(s.code, s);
  }
  const uniqueStations = Array.from(stationCodeMap.values());
  console.log(`📍 Processing ${uniqueStations.length} unique West Bengal stations (Metro, Local, Express)...`);

  const dbStationIdMap = new Map<string, string>();

  for (const s of uniqueStations) {
    const upserted = await prisma.station.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        nameBn: s.nameBn,
        zone: s.zone,
        division: s.division,
        district: s.district,
      },
      create: {
        code: s.code,
        name: s.name,
        nameBn: s.nameBn,
        zone: s.zone,
        division: s.division,
        district: s.district,
      },
    });
    dbStationIdMap.set(s.code, upserted.id);
  }
  console.log(`✅ Stored ${uniqueStations.length} stations in local database.`);

  // =========================================================================
  // STEP 2: Upsert All Stations to Supabase
  // =========================================================================
  console.log(`\n☁️ Uploading all ${uniqueStations.length} stations to Supabase in batches...`);
  const stationPayload = uniqueStations.map(s => ({
    id: dbStationIdMap.get(s.code),
    code: s.code,
    name: s.name,
    name_bn: s.nameBn,
    zone: s.zone,
    division: s.division,
    district: s.district,
  }));

  const chunkSize = 50;
  for (let i = 0; i < stationPayload.length; i += chunkSize) {
    const chunk = stationPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('stations').upsert(chunk, { onConflict: 'code' });
    if (error) {
      console.error(`❌ Stations Chunk ${i / chunkSize + 1} Error:`, error.message);
    } else {
      console.log(`   ✅ Stations Synced: ${i + 1} to ${Math.min(i + chunkSize, stationPayload.length)}`);
    }
  }

  // =========================================================================
  // STEP 3: Process & Upsert All Trains & Schedules in Local DB
  // =========================================================================
  console.log(`\n🚆 Processing ${MEGA_WB_TRAINS.length} West Bengal Trains (Metro Lines, Vande Bharat, Locals, Express)...`);

  for (const t of MEGA_WB_TRAINS) {
    const destCode = (t.stops[t.stops.length - 1] as any[])[0] as string;

    const createdTrain = await prisma.train.upsert({
      where: { number: t.num },
      update: {
        name: t.name,
        type: t.type,
        originStationCode: t.orig,
        destinationStationCode: destCode,
        runningDays: t.days,
        distanceKm: t.km,
      },
      create: {
        number: t.num,
        name: t.name,
        type: t.type,
        originStationCode: t.orig,
        destinationStationCode: destCode,
        runningDays: t.days,
        distanceKm: t.km,
      },
    });

    for (const [code, arr, dep, seq, halt] of t.stops) {
      const stationId = dbStationIdMap.get(code as string);
      if (!stationId) {
        console.warn(`⚠️ Warning: Station code "${code}" not found for train ${t.num}`);
        continue;
      }

      await prisma.scheduleStop.upsert({
        where: {
          trainId_stationId: {
            trainId: createdTrain.id,
            stationId: stationId,
          },
        },
        update: {
          arrivalTime: arr,
          departureTime: dep,
          sequenceNo: seq,
          haltMinutes: halt,
          source: 'verified',
        },
        create: {
          trainId: createdTrain.id,
          stationId: stationId,
          arrivalTime: arr,
          departureTime: dep,
          sequenceNo: seq,
          haltMinutes: halt,
          source: 'verified',
        },
      });
    }
  }
  console.log(`✅ Stored all trains and stops in local database.`);

  // =========================================================================
  // STEP 4: Upsert All Trains to Supabase
  // =========================================================================
  const allDbTrains = await prisma.train.findMany();
  console.log(`\n☁️ Uploading ${allDbTrains.length} total trains to Supabase...`);
  const trainPayload = allDbTrains.map(t => ({
    id: t.id,
    number: t.number,
    name: t.name,
    type: t.type,
    origin_station_code: t.originStationCode,
    destination_station_code: t.destinationStationCode,
    running_days: t.runningDays,
    distance_km: t.distanceKm,
  }));

  for (let i = 0; i < trainPayload.length; i += chunkSize) {
    const chunk = trainPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('trains').upsert(chunk, { onConflict: 'number' });
    if (error) {
      console.error(`❌ Trains Chunk ${i / chunkSize + 1} Error:`, error.message);
    } else {
      console.log(`   ✅ Trains Synced: ${i + 1} to ${Math.min(i + chunkSize, trainPayload.length)}`);
    }
  }

  // =========================================================================
  // STEP 5: Upsert All Schedule Stops to Supabase
  // =========================================================================
  const allDbStops = await prisma.scheduleStop.findMany();
  console.log(`\n☁️ Uploading ${allDbStops.length} total schedule stops to Supabase...`);
  const stopPayload = allDbStops.map(s => ({
    train_id: s.trainId,
    station_id: s.stationId,
    sequence_no: s.sequenceNo,
    day_offset: s.dayOffset,
    arrival_time: s.arrivalTime,
    departure_time: s.departureTime,
    halt_minutes: s.haltMinutes,
    source: s.source,
  }));

  for (let i = 0; i < stopPayload.length; i += chunkSize) {
    const chunk = stopPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('schedule_stops').upsert(chunk, { onConflict: 'train_id,station_id' });
    if (error) {
      console.error(`❌ Schedule Stops Chunk ${i / chunkSize + 1} Error:`, error.message);
    } else {
      console.log(`   ✅ Schedule Stops Synced: ${i + 1} to ${Math.min(i + chunkSize, stopPayload.length)}`);
    }
  }

  // =========================================================================
  // STEP 6: Verify Live Metrics Directly from Supabase
  // =========================================================================
  console.log(`\n🔍 Verifying Live Database Numbers on Supabase...`);
  const { count: countStations } = await supabase.from('stations').select('*', { count: 'exact', head: true });
  const { count: countTrains } = await supabase.from('trains').select('*', { count: 'exact', head: true });
  const { count: countStops } = await supabase.from('schedule_stops').select('*', { count: 'exact', head: true });

  console.log(`\n======================================================`);
  console.log(`🎉 SUPABASE LIVE METRICS (WEST BENGAL 2026 RAILWAY NETWORK):`);
  console.log(`   📍 Total West Bengal Stations: ${countStations}`);
  console.log(`   🚆 Total Trains & Metro Lines:  ${countTrains}`);
  console.log(`   ⏱️ Total Schedule Stops:        ${countStops}`);
  console.log(`======================================================\n`);
  console.log(`✅ All West Bengal stations and trains successfully fed into Supabase!`);
}

runMegaFeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
