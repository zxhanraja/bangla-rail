import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStationWithSchedule } from '@/services/stationService';
import StationClient from './StationClient';
import { ArrowLeft, ChevronRight, MapPin, Train as TrainIcon } from 'lucide-react';
import { generateStationSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaGenerators';

// Incremental Static Regeneration: Cache static page for 1 hour
export const revalidate = 3600;

interface Props {
  params: Promise<{ code: string }>;
}

function cleanStationCode(rawCode: string): string {
  return decodeURIComponent(rawCode).trim().toUpperCase();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const cleaned = cleanStationCode(code);
  const station = await getStationWithSchedule(cleaned);

  if (!station) {
    return {
      title: `Station ${cleaned} Timetable & Schedule | Bangla Rail`,
      description: `View train departures and arrivals for station code ${cleaned} across West Bengal.`,
    };
  }

  return {
    title: `${station.name} (${station.code}) Train Timetable Today | Bangla Rail`,
    description: `Complete daily departure and arrival schedules for ${station.name} (${station.code}), ${station.division} Division, ${station.zone} Zone. Platform halts, EMU local trains, express timetables across West Bengal.`,
    keywords: [
      `${station.name} train time table`,
      `${station.code} station train schedule`,
      `${station.name} local train timings`,
      `${station.name} railway station departs`,
      `${station.division} division local trains`,
    ],
    alternates: {
      canonical: `https://banglarail.in/station/${station.code.toLowerCase()}`,
    },
    openGraph: {
      title: `${station.name} (${station.code}) Train Timetable | Bangla Rail`,
      description: `Check live train departures, platform halts and timings at ${station.name}.`,
      url: `https://banglarail.in/station/${station.code.toLowerCase()}`,
      type: 'website'
    },
  };
}

export default async function StationDetailPage({ params }: Props) {
  const { code } = await params;
  const cleaned = cleanStationCode(code);
  const station = await getStationWithSchedule(cleaned);

  if (!station) {
    notFound();
  }

  const stationSchema = generateStationSchema(station);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://banglarail.in' },
    { name: 'Stations', url: 'https://banglarail.in/plan' },
    { name: `${station.name} (${station.code})`, url: `https://banglarail.in/station/${station.code.toLowerCase()}` },
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [stationSchema, breadcrumbSchema],
  };

  return (
    <div className="space-y-6 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Back Link & Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#71717A] overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-black transition-colors font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <Link href="/plan" className="hover:text-black transition-colors font-medium">Stations</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-[#111111] font-semibold">{station.name} ({station.code})</span>
      </nav>

      {/* Station Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                {station.name}
              </h1>
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#111111] text-white font-mono font-bold">
                {station.code}
              </span>
            </div>
            {station.nameBn && (
              <p className="text-sm text-[#71717A] font-medium mt-1">{station.nameBn}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#71717A] mt-3">
              <span className="px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] font-medium">
                Zone: <strong>{station.zone}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] font-medium">
                Division: <strong>{station.division}</strong>
              </span>
              {station.district && (
                <span className="px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] font-medium">
                  District: <strong>{station.district}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#F0ECE3]">
            <span className="text-xs text-[#71717A]">Total Daily Trains</span>
            <span className="text-2xl sm:text-3xl font-black text-[#111111] font-mono">{station.scheduleStops.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive Filter & List Component */}
      <StationClient station={station} />
    </div>
  );
}
