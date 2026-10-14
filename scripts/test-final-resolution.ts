import { planRoute } from '../src/services/routeService';
import { resolveStation } from '../src/lib/station-cache';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🧪 Testing final route resolution and train search...\n');

  const testCases = [
    // Previously missing intermediate stations:
    ['DGNR', 'SDAH', 'Durganagar -> Sealdah (previously 0 trains)'],
    ['BLAE', 'HWH', 'Balarambati -> Howrah (previously 0 trains)'],
    ['KLMJ', 'SDAH', 'Kalyani Simanta -> Sealdah (previously 0 trains)'],
    ['BRMH', 'HWH', 'Belur Math -> Howrah (previously 0 trains)'],
    ['DHU', 'SDAH', 'Dhubulia -> Sealdah (previously 0 trains)'],

    // Phantom duplicate codes that users might type or select:
    ['CNJG', 'SDAH', 'Phantom Canning code (CNJG) -> Sealdah'],
    ['BJNJ', 'SDAH', 'Phantom Bangaon code (BJNJ) -> Sealdah'],
    ['TRSE', 'HWH', 'Phantom Tarakeswar code (TRSE) -> Howrah'],
    ['DMHB', 'SDAH', 'Phantom Diamond Harbour code (DMHB) -> Sealdah'],

    // Metro routes:
    ['M-HMD', 'M-SCV', 'Howrah Maidan -> Sector V (Underwater Metro)'],
  ];

  for (const [from, to, label] of testCases) {
    const fromSt = await resolveStation(from);
    const toSt = await resolveStation(to);
    if (!fromSt || !toSt) {
      console.log(`❌ ${label}: Station resolution failed (from=${!!fromSt}, to=${!!toSt})`);
      continue;
    }

    const res = await planRoute(from, to);
    if ('trains' in res && res.trains.length > 0) {
      console.log(`✅ ${label}: Found ${res.trains.length} trains! (First train: ${res.trains[0].train.number} ${res.trains[0].train.name} at ${res.trains[0].departureFrom})`);
    } else {
      console.log(`❌ ${label}: No trains found`);
    }
  }
}

main().finally(() => prisma.$disconnect());
