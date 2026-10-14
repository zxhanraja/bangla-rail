import { prisma } from '../src/lib/prisma';

function parseSlug(slug: string): { fromStr: string; toStr: string } | null {
  const parts = slug.split('-to-');
  if (parts.length !== 2) return null;
  const fromStr = parts[0].replace(/-/g, ' ').trim();
  const toStr = parts[1].replace(/-/g, ' ').trim();
  if (!fromStr || !toStr) return null;
  return { fromStr, toStr };
}

async function findStation(query: string) {
  const clean = query.trim();
  const lower = clean.toLowerCase();

  // 1. By Code
  let station = await prisma.station.findUnique({
    where: { code: clean.toUpperCase() }
  });
  if (station) return station;

  // 2. Exact match on name or code
  const all = await prisma.station.findMany();
  const exact = all.find(s => s.code.toLowerCase() === lower || s.name.toLowerCase() === lower);
  if (exact) return exact;

  // 3. Starts with
  const starts = all.find(s => s.name.toLowerCase().startsWith(lower) || s.code.toLowerCase().startsWith(lower));
  if (starts) return starts;

  // 4. Substring
  const sub = all.find(s => s.name.toLowerCase().includes(lower) || (s.nameBn && s.nameBn.includes(clean)));
  return sub || null;
}

async function testSlugs() {
  const testCases = [
    'bandel-to-howrah',
    'howrah-to-bandel',
    'bdc-to-hwh',
    'hwh-to-bdc',
    'sealdah-to-ranaghat',
    'sdah-to-rha',
    'adisaptagram-to-howrah',
    'howrah-to-barddhaman',
    'bwn-to-hwh',
    'kharagpur-to-howrah',
    'howrah-to-digha',
    'howrah-to-new-jalpaiguri',
    'bansberia-to-bandel',
    'islampara-to-bandel'
  ];

  for (const slug of testCases) {
    const parsed = parseSlug(slug);
    if (!parsed) {
      console.log(`❌ Failed to parse: ${slug}`);
      continue;
    }
    const [fromSt, toSt] = await Promise.all([
      findStation(parsed.fromStr),
      findStation(parsed.toStr)
    ]);
    console.log(`Slug: ${slug.padEnd(28)} -> From: ${(fromSt?.name + ' (' + fromSt?.code + ')').padEnd(30)} To: ${toSt?.name} (${toSt?.code})`);
  }
}

testSlugs().finally(() => prisma.$disconnect());
