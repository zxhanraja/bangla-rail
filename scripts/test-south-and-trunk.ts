import { planRoute } from '../src/services/routeService';
import { prisma } from '../src/lib/prisma';

async function main() {
  const routes = [
    { from: 'HWH', to: 'BDC', name: 'Howrah ➔ Bandel' },
    { from: 'BDC', to: 'HWH', name: 'Bandel ➔ Howrah' },
    { from: 'SDAH', to: 'CG', name: 'Sealdah ➔ Canning' },
    { from: 'CG', to: 'SDAH', name: 'Canning ➔ Sealdah' },
    { from: 'SDAH', to: 'DH', name: 'Sealdah ➔ Diamond Harbour' },
    { from: 'DH', to: 'SDAH', name: 'Diamond Harbour ➔ Sealdah' },
    { from: 'SDAH', to: 'KBGB', name: 'Sealdah ➔ Budge Budge' },
    { from: 'SDAH', to: 'BNJ', name: 'Sealdah ➔ Bangaon' },
    { from: 'SDAH', to: 'KNJ', name: 'Sealdah ➔ Krishnanagar City' },
    { from: 'HWH', to: 'TAK', name: 'Howrah ➔ Tarakeswar' },
    { from: 'HWH', to: 'KGP', name: 'Howrah ➔ Kharagpur' },
    { from: 'BDC', to: 'KWAE', name: 'Bandel ➔ Katwa' },
    { from: 'BDC', to: 'NH', name: 'Bandel ➔ Naihati (Jubilee Bridge)' },
  ];

  console.log('🧪 Testing Key Commuter Trunks:');
  for (const r of routes) {
    const res = await planRoute(r.from, r.to);
    if ('trains' in res) {
      console.log(`✅ [${r.name}] -> Found ${res.trains.length} trains.`);
      if (res.trains.length > 0) {
        const t1 = res.trains[0];
        const tLast = res.trains[res.trains.length - 1];
        console.log(`   First: ${t1.train.number} (${t1.train.name}) | ${t1.departureFrom} ➔ ${t1.arrivalTo}`);
        console.log(`   Last:  ${tLast.train.number} (${tLast.train.name}) | ${tLast.departureFrom} ➔ ${tLast.arrivalTo}`);
      }
    } else {
      console.error(`❌ [${r.name}] -> FAILED:`, res.error);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

