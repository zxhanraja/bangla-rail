import { prisma } from '../src/lib/prisma';

async function main() {
  const all = await prisma.station.findMany({
    include: {
      _count: {
        select: { scheduleStops: true }
      }
    }
  });

  const withStops = all.filter(s => s._count.scheduleStops > 0);
  const withoutStops = all.filter(s => s._count.scheduleStops === 0);

  console.log(`With stops: ${withStops.length}, Without stops: ${withoutStops.length}`);

  // Find duplicates by normalized name
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/junction|metro|jn|terminal|cantt/g, '');

  const stopsMap = new Map<string, typeof withStops[0]>();
  for (const s of withStops) {
    stopsMap.set(norm(s.name), s);
  }

  const duplicates: { inactiveCode: string; inactiveName: string; activeCode: string; activeName: string; stopCount: number }[] = [];

  for (const s of withoutStops) {
    const n = norm(s.name);
    if (stopsMap.has(n)) {
      const active = stopsMap.get(n)!;
      duplicates.push({
        inactiveCode: s.code,
        inactiveName: s.name,
        activeCode: active.code,
        activeName: active.name,
        stopCount: active._count.scheduleStops,
      });
    }
  }

  console.log(`Found ${duplicates.length} phantom duplicates:`);
  console.table(duplicates);
}

main().finally(() => prisma.$disconnect());
