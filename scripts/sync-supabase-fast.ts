import { createClient } from '@supabase/supabase-js';
import { prisma } from '../src/lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qiujipyowxlcpqpvphjg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdWppcHlvd3hsY3BxcHZwaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTA3MjcsImV4cCI6MjEwMzI4NjcyN30.pG-YAEyyhEXLgqy7iy7HiMr3O5eNGfzdx7Dkeyq-FIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncToSupabase() {
  console.log('🚀 Starting Fast Synchronization to Supabase Database...\n');

  try {
    // 1. Fetch all stations
    const stations = await prisma.station.findMany();
    console.log(`Found ${stations.length} stations to sync to Supabase...`);

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

    const chunkSize = 200;
    for (let i = 0; i < stationPayload.length; i += chunkSize) {
      const chunk = stationPayload.slice(i, i + chunkSize);
      const { error } = await supabase.from('stations').upsert(chunk, { onConflict: 'code' });
      if (error) {
        console.error(`Error syncing stations batch:`, error.message);
      }
    }
    console.log(`✅ All stations synced to Supabase.`);

    // 2. Fetch all trains
    const trains = await prisma.train.findMany();
    console.log(`\nFound ${trains.length} trains to sync to Supabase...`);

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
        console.error(`Error syncing trains batch:`, error.message);
      }
    }
    console.log(`✅ All trains synced to Supabase.`);

    // 3. Fetch all schedule stops
    const stops = await prisma.scheduleStop.findMany();
    console.log(`\nFound ${stops.length} schedule stops to sync to Supabase...`);

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

    for (let i = 0; i < stopPayload.length; i += 500) {
      const chunk = stopPayload.slice(i, i + 500);
      const { error } = await supabase.from('schedule_stops').upsert(chunk, { onConflict: 'train_id,station_id' });
      if (error) {
        console.error(`Error syncing schedule stops batch ${i}:`, error.message);
      }
    }
    console.log(`✅ All schedule stops synced to Supabase.`);

    console.log('\n🎉 Fast Supabase synchronization completed successfully!');
  } catch (error) {
    console.error('❌ Sync error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncToSupabase();
