import { planRoute } from '../src/services/routeService';
import { prisma } from '../src/lib/prisma';

async function testRoutes() {
  console.log('🧪 Testing BanglaRail Route Planning Engine...\n');

  const testPairs = [
    // 1. Kolkata Metro Yellow Line (Line 4: Noapara to Jai Hind Airport)
    { from: 'M-NPR', to: 'M-APO', name: 'Yellow Line: Noapara ➔ Jai Hind Airport' },
    { from: 'M-APO', to: 'M-NPR', name: 'Yellow Line: Jai Hind Airport ➔ Noapara' },

    // 2. Kolkata Metro Orange Line Extension (Line 6: Kavi Subhash to Beliaghata)
    { from: 'M-KVS', to: 'M-BLG3', name: 'Orange Line: Kavi Subhash ➔ Beliaghata' },
    { from: 'M-BLG3', to: 'M-KVS', name: 'Orange Line: Beliaghata ➔ Kavi Subhash' },

    // 3. Kolkata Metro Green Line (Underwater)
    { from: 'M-HMD', to: 'M-SCV', name: 'Green Line: Howrah Maidan ➔ Sector V' },

    // 4. Suburban Trunk Routes
    { from: 'HWH', to: 'BWN', name: 'Howrah ➔ Barddhaman Main/Chord' },
    { from: 'HWH', to: 'LLH', name: 'Howrah ➔ Liluah (Station Code Fix)' },
    { from: 'SDAH', to: 'RHA', name: 'Sealdah ➔ Ranaghat' },
    { from: 'PKU', to: 'HLZ', name: 'Panskura ➔ Haldia Corridor' },
  ];

  for (const pair of testPairs) {
    const result = await planRoute(pair.from, pair.to);
    if ('trains' in result) {
      console.log(`✅ [${pair.name}] -> Found ${result.trains.length} trains.`);
      if (result.trains.length > 0) {
        const first = result.trains[0];
        console.log(`   Sample: ${first.train.number} (${first.train.name}) | Dep: ${first.departureFrom} | Arr: ${first.arrivalTo} | Verified: ${first.train.verificationStatus}`);
      }
    } else {
      console.error(`❌ [${pair.name}] -> FAILED:`, result.error);
    }
  }
}

testRoutes().catch(console.error).finally(() => prisma.$disconnect());
