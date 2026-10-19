import { getCachedStationWithSchedule, searchRouteTrains } from '../src/lib/cache/trainDataCache';

async function main() {
  console.log('🧪 Testing station schedule retrieval & route planning on updated network...\n');

  const testCodes = ['BZL', 'BMAE', 'DH', 'AMSN', 'TAK', 'GEDE', 'HLZ', 'KWAE', 'CG', 'KWDP', 'MGAE', 'BNJ', 'HNB'];

  for (const code of testCodes) {
    const station = await getCachedStationWithSchedule(code);
    if (!station) {
      console.log(`❌ Station ${code} not found!`);
    } else {
      const stopCount = station.scheduleStops?.length || 0;
      console.log(`✅ ${station.name} (${station.code}): ${stopCount} trains stopping.`);
    }
  }

  console.log('\n🧪 Testing Route Planning:');
  // Howrah to Belmuri (on Chord line)
  const route1 = await searchRouteTrains('HWH', 'BMAE');
  console.log(`  Route HWH -> BMAE: found ${route1.directTrains.length} direct trains`);

  // Sealdah to Kakdwip
  const route2 = await searchRouteTrains('SDAH', 'KWDP');
  console.log(`  Route SDAH -> KWDP: found ${route2.directTrains.length} direct trains`);

  // Howrah to Amta
  const route3 = await searchRouteTrains('HWH', 'AMSN');
  console.log(`  Route HWH -> AMSN: found ${route3.directTrains.length} direct trains`);

  // Panskura to Haldia
  const route4 = await searchRouteTrains('PKU', 'HLZ');
  console.log(`  Route PKU -> HLZ: found ${route4.directTrains.length} direct trains`);
}

main().catch(console.error);
