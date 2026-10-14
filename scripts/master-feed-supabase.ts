import { createClient } from '@supabase/supabase-js';
import { prisma } from '../src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qiujipyowxlcpqpvphjg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdWppcHlvd3hsY3BxcHZwaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTA3MjcsImV4cCI6MjEwMzI4NjcyN30.pG-YAEyyhEXLgqy7iy7HiMr3O5eNGfzdx7Dkeyq-FIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function masterFeedSupabase() {
  console.log('🚀 Starting Comprehensive 2026 West Bengal Stations & Trains Feed to Supabase...\n');

  // Read all stations from local database
  const stations = await prisma.station.findMany();
  console.log(`📦 Preparing ${stations.length} West Bengal stations for Supabase...`);

  const stationPayload = stations.map(s => ({
    id: s.id,
    code: s.code,
    name: s.name,
    name_bn: s.nameBn,
    zone: s.zone,
    division: s.division,
    district: s.district,
    lat: s.lat,
    lng: s.lng,
  }));

  const chunkSize = 50;
  for (let i = 0; i < stationPayload.length; i += chunkSize) {
    const chunk = stationPayload.slice(i, i + chunkSize);
    const { error } = await supabase.from('stations').upsert(chunk, { onConflict: 'code' });
    if (error) {
      console.error(`❌ Stations Chunk ${i / chunkSize + 1} Error:`, error.message);
    } else {
      console.log(`✅ Stations Synced: ${i + 1} to ${Math.min(i + chunkSize, stationPayload.length)}`);
    }
  }

  // Read all trains from local database
  const trains = await prisma.train.findMany();
  console.log(`\n📦 Preparing ${trains.length} West Bengal trains for Supabase...`);

  const trainPayload = trains.map(t => ({
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
      console.log(`✅ Trains Synced: ${i + 1} to ${Math.min(i + chunkSize, trainPayload.length)}`);
    }
  }

  // Read all schedule stops
  const stops = await prisma.scheduleStop.findMany();
  console.log(`\n📦 Preparing ${stops.length} schedule stops for Supabase...`);

  const stopPayload = stops.map(s => ({
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
      console.log(`✅ Schedule Stops Synced: ${i + 1} to ${Math.min(i + chunkSize, stopPayload.length)}`);
    }
  }

  // Verify counts in Supabase
  console.log('\n🔍 Verifying Supabase Database Record Counts...');
  const { count: countStations } = await supabase.from('stations').select('*', { count: 'exact', head: true });
  const { count: countTrains } = await supabase.from('trains').select('*', { count: 'exact', head: true });
  const { count: countStops } = await supabase.from('schedule_stops').select('*', { count: 'exact', head: true });

  console.log(`\n🎉 SUPABASE LIVE METRICS:`);
  console.log(`   📍 Stations in Supabase: ${countStations}`);
  console.log(`   🚆 Trains in Supabase:   ${countTrains}`);
  console.log(`   ⏱️ Schedule Stops:      ${countStops}`);
  console.log(`\n✅ All data successfully fed into Supabase!`);
}

masterFeedSupabase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
