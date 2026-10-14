import { redirect } from 'next/navigation';
import { resolveStation } from '@/lib/station-cache';
import Link from 'next/link';
import { Search, Train, ArrowRight } from 'lucide-react';

interface Props {
  searchParams: Promise<{ q?: string; from?: string; to?: string }>;
}

function cleanTerm(str: string): string {
  return str
    .replace(/trains?/gi, '')
    .replace(/local/gi, '')
    .replace(/timings?/gi, '')
    .replace(/time\s*table/gi, '')
    .replace(/schedule/gi, '')
    .replace(/today/gi, '')
    .trim();
}

async function findStation(query: string) {
  const clean = cleanTerm(query);
  if (!clean) return null;
  return resolveStation(clean);
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q?.trim() || '';
  let fromQuery = params.from?.trim() || '';
  let toQuery = params.to?.trim() || '';
  // Check if query is directly a train number (e.g., 37816, 12301, M-101)
  if (q && (/^\d{4,5}$/.test(q) || /^m-\d+/i.test(q))) {
    redirect(`/train/${q.trim().toUpperCase()}`);
  }

  if (q && (!fromQuery || !toQuery)) {
    // Parse "bandel to howrah", "bandel - howrah", "bandel howrah"
    const cleaned = cleanTerm(q);
    if (cleaned.includes(' to ')) {
      const parts = cleaned.split(/\s+to\s+/i);
      fromQuery = parts[0]?.trim() || '';
      toQuery = parts[1]?.trim() || '';
    } else if (cleaned.includes('-')) {
      const parts = cleaned.split('-');
      fromQuery = parts[0]?.trim() || '';
      toQuery = parts[1]?.trim() || '';
    } else {
      const parts = cleaned.split(/\s+/);
      if (parts.length >= 2) {
        fromQuery = parts[0];
        toQuery = parts.slice(1).join(' ');
      } else if (parts.length === 1) {
        fromQuery = parts[0];
      }
    }
  }

  if (fromQuery && toQuery) {
    const [fromSt, toSt] = await Promise.all([
      findStation(fromQuery),
      findStation(toQuery)
    ]);

    if (fromSt && toSt) {
      redirect(`/trains-between/${fromSt.code.toLowerCase()}-to-${toSt.code.toLowerCase()}`);
    }
  } else if (fromQuery && !toQuery) {
    const singleSt = await findStation(fromQuery);
    if (singleSt) {
      redirect(`/station/${singleSt.code.toLowerCase()}`);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
        <Search className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Search West Bengal Train Timetables
        </h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Instant timetables for EMU locals, Kolkata Metro &amp; Express trains across all 666 stations.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E7E2D8] shadow-xs text-left space-y-4">
        <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
          <Train className="w-4 h-4 text-emerald-600" />
          Popular Station Corridors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { from: 'Bandel (BDC)', to: 'Howrah (HWH)', slug: 'bandel-to-howrah' },
            { from: 'Islampara (IPRA)', to: 'Bandel (BDC)', slug: 'islampara-to-bandel' },
            { from: 'Bansberia (BSAE)', to: 'Bandel (BDC)', slug: 'bansberia-to-bandel' },
            { from: 'Hindmotor (HLMT)', to: 'Howrah (HWH)', slug: 'hindmotor-to-howrah' },
            { from: 'Belur (BELR)', to: 'Howrah (HWH)', slug: 'belur-to-howrah' },
            { from: 'Sealdah (SDAH)', to: 'Ranaghat (RHA)', slug: 'sealdah-to-ranaghat' },
            { from: 'Howrah (HWH)', to: 'Barddhaman (BWN)', slug: 'howrah-to-barddhaman' },
            { from: 'Kharagpur (KGP)', to: 'Howrah (HWH)', slug: 'kharagpur-to-howrah' },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/trains-between/${item.slug}`}
              className="p-3 rounded-xl bg-neutral-50 hover:bg-neutral-900 hover:text-white border border-neutral-200 text-neutral-800 font-semibold transition flex items-center justify-between"
            >
              <span>{item.from} ➔ {item.to}</span>
              <ArrowRight className="w-4 h-4 opacity-60" />
            </Link>
          ))}
        </div>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold hover:bg-neutral-800 transition shadow-sm"
        >
          Back to Homepage Planner
        </Link>
      </div>
    </div>
  );
}
