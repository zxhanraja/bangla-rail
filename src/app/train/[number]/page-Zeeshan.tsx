import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTrainByNumber } from '@/services/trainService';
import { 
  Train as TrainIcon, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  ChevronRight, 
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { generateTrainTripSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaGenerators';


// Incremental Static Regeneration: Cache static page for 24 hours
export const revalidate = 86400;

interface Props {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const train = await getTrainByNumber(number);

  if (!train) {
    return {
      title: `Train ${number} Timetable | Bangla Rail`,
      description: `View train schedule and stoppage information for train number ${number}.`,
    };
  }

  const sortedStops = train.scheduleStops;
  const origin = sortedStops[0]?.station.name || train.originStationCode;
  const destination = sortedStops[sortedStops.length - 1]?.station.name || train.destinationStationCode;

  return {
    title: `${train.number} ${train.name} Timetable, Route & Halts 2026 | Bangla Rail`,
    description: `Full 2026 timetable and halt list for ${train.number} (${train.name}) from ${origin} to ${destination}. Departure timings, platform halts, and running days across West Bengal.`,
    keywords: [
      `${train.number} train time table`,
      `${train.name} schedule 2026`,
      `${train.number} route and halts`,
      `${origin} to ${destination} train timings`,
      `${train.number} running days`,
    ],
    alternates: {
      canonical: `https://banglarail.in/train/${train.number}`,
    },
    openGraph: {
      title: `${train.number} ${train.name} Schedule | Bangla Rail`,
      description: `Complete route and stop list for ${train.number} from ${origin} to ${destination}.`,
      url: `https://banglarail.in/train/${train.number}`,
    },
  };
}

export default async function TrainDetailPage({ params }: Props) {
  const { number } = await params;
  const train = await getTrainByNumber(number);

  if (!train) {
    notFound();
  }

  const sortedStops = train.scheduleStops;
  const firstStop = sortedStops[0];
  const lastStop = sortedStops[sortedStops.length - 1];

  const tripSchema = generateTrainTripSchema({
    number: train.number,
    name: train.name,
    type: train.type,
    runningDays: train.runningDays,
    firstStop: firstStop ? { name: firstStop.station.name, code: firstStop.station.code, departureTime: firstStop.departureTime } : undefined,
    lastStop: lastStop ? { name: lastStop.station.name, code: lastStop.station.code, arrivalTime: lastStop.arrivalTime } : undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://banglarail.in' },
    { name: 'Trains', url: 'https://banglarail.in/plan' },
    { name: `${train.number} - ${train.name}`, url: `https://banglarail.in/train/${train.number}` },
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [tripSchema, breadcrumbSchema],
  };

  return (
    <div className="space-y-6 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      {/* Top Back Link & Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#71717A]">
        <Link href="/" className="hover:text-black transition-colors font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href="/plan" className="hover:text-black transition-colors font-medium">Trains</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-[#111111] font-semibold">{train.number} - {train.name}</span>
      </nav>

      {/* Train Header Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                {train.number}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#111111] text-white font-semibold">
                {train.type}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-[#111111] mt-1">
              {train.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A] mt-3">
              <span className="px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] font-medium">
                Route: <strong>{firstStop?.station.name} ({train.originStationCode})</strong> ➔ <strong>{lastStop?.station.name} ({train.destinationStationCode})</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Runs: <strong>{train.runningDays}</strong>
              </span>
              {train.distanceKm && (
                <span className="px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] font-medium">
                  Distance: <strong>{train.distanceKm} km</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0ECE3]">
            <span className="text-xs text-[#71717A]">Total Halts</span>
            <span className="text-2xl sm:text-3xl font-black text-[#111111]">{sortedStops.length}</span>
          </div>
        </div>
      </div>

      {/* Intermediate Halts Table Card */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#EAE6DC] bg-white flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
            Intermediate Station Halts & Schedule
          </span>
          <span className="text-xs font-semibold text-[#111111]">
            {sortedStops.length} Stops
          </span>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAE6DC] text-[11px] font-bold text-[#71717A] uppercase tracking-wider bg-[#FAF8F3]">
                <th className="py-3 px-6 w-12">#</th>
                <th className="py-3 px-6">STATION</th>
                <th className="py-3 px-6">ARR</th>
                <th className="py-3 px-6">DEP</th>
                <th className="py-3 px-6">HALT</th>
                <th className="py-3 px-6">DAY</th>
                <th className="py-3 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DC]">
              {sortedStops.map((stop: any, idx: number) => (
                <tr key={stop.id} className="hover:bg-[#FBF9F4] transition-colors">

                  <td className="py-3.5 px-6 font-medium text-xs text-[#71717A]">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-sm text-[#111111]">
                      {stop.station.name}
                    </div>
                    <div className="text-[11px] text-[#71717A] font-mono">
                      {stop.station.code} • {stop.station.division} Division
                    </div>
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-sm text-[#555555]">
                    {stop.arrivalTime || 'Source'}
                  </td>
                  <td className="py-3.5 px-6 font-bold text-sm text-[#111111]">
                    {stop.departureTime || 'Destination'}
                  </td>
                  <td className="py-3.5 px-6 text-xs font-medium text-[#71717A]">
                    {stop.haltMinutes > 0 ? `${stop.haltMinutes}m` : '--'}
                  </td>
                  <td className="py-3.5 px-6 text-xs text-[#71717A]">
                    Day {stop.dayOffset}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      href={`/station/${stop.station.code.toLowerCase()}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F7F5EE] hover:bg-[#111111] hover:text-white text-xs font-semibold transition-colors"
                    >
                      Station Info
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-[#EAE6DC]">
          {sortedStops.map((stop: any, idx: number) => (
            <div key={stop.id} className="p-4 hover:bg-[#FAF8F3] transition-colors">

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#111111] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-[#111111]">
                      {stop.station.name}
                    </div>
                    <div className="text-[11px] text-[#71717A] font-mono">
                      {stop.station.code}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#111111]">
                    {stop.departureTime || stop.arrivalTime || '--'}
                  </div>
                  <div className="text-[10.5px] text-[#71717A]">
                    Halt: {stop.haltMinutes > 0 ? `${stop.haltMinutes}m` : '--'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
