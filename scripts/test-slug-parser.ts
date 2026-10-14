import { resolveStation } from '../src/lib/station-cache';
import { planRoute } from '../src/services/routeService';

function parseSlug(slug: string): { fromStr: string; toStr: string } | null {
  // Clean suffixes like -trains, -local-train, -schedule, -timetable
  let cleanSlug = slug
    .replace(/-trains?$/i, '')
    .replace(/-local(-trains?)?$/i, '')
    .replace(/-timings?$/i, '')
    .replace(/-time-table$/i, '')
    .replace(/-timetable$/i, '')
    .replace(/-schedule$/i, '');

  const parts = cleanSlug.split('-to-');
  if (parts.length !== 2) return null;
  const fromStr = parts[0].trim();
  const toStr = parts[1].trim();
  if (!fromStr || !toStr) return null;
  return { fromStr, toStr };
}

const testSlugs = [
  'mankundu-to-howrah',
  'mankundu-to-howrha',
  'mankundu-to-howrah-trains',
  'mankundu-to-howrah-local-train',
  'muu-to-hwh',
  'howrha-to-mankundu',
  'bandel-to-howrah',
  'sealdah-to-ranaghat',
];

async function main() {
  for (const s of testSlugs) {
    const p = parseSlug(s);
    if (!p) {
      console.log(`❌ Slug "${s}" failed to parse`);
      continue;
    }
    const [stFrom, stTo] = await Promise.all([
      resolveStation(p.fromStr),
      resolveStation(p.toStr),
    ]);
    console.log(`Slug: "${s}" -> From: ${stFrom?.name || 'NULL (' + p.fromStr + ')'} | To: ${stTo?.name || 'NULL (' + p.toStr + ')'}`);
  }
}

main().catch(console.error).finally(() => process.exit(0));
