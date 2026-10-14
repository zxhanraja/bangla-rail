import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { resolveStation } from '@/services/stationService';
import { planRoute } from '@/services/routeService';
import { 
  Train, 
  Clock, 
  ArrowRight, 
  ArrowLeftRight, 
  MapPin, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Info,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import TrainsBetweenClient from './TrainsBetweenClient';
import { generateRouteTripSchema } from '@/lib/seo/schemaGenerators';

// Incremental Static Regeneration: Cache static page for 1 hour
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

// Helper to parse slug like "adisaptagram-to-howrah" or "adst-to-hwh"
function parseSlug(slug: string): { fromStr: string; toStr: string } | null {
  const parts = slug.split('-to-');
  if (parts.length !== 2) return null;
  const fromStr = parts[0].replace(/-/g, ' ').trim();
  const toStr = parts[1].replace(/-/g, ' ').trim();
  if (!fromStr || !toStr) return null;
  return { fromStr, toStr };
}

// findStation uses the in-memory cache via resolveStation from '@/services/stationService'
async function findStation(query: string) {
  return resolveStation(query);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return {
      title: 'Train Time Table | Bangla Rail',
      description: 'Find West Bengal train timetables, schedules and live train status.'
    };
  }

  const [fromStation, toStation] = await Promise.all([
    findStation(parsed.fromStr),
    findStation(parsed.toStr)
  ]);

  const fromName = fromStation ? `${fromStation.name} (${fromStation.code})` : parsed.fromStr;
  const toName = toStation ? `${toStation.name} (${toStation.code})` : parsed.toStr;

  const title = `${fromName} to ${toName} Train Time Table Today - Schedule & EMU Local Timings`;
  const description = `Check today's complete train time table between ${fromName} and ${toName}. View all EMU locals, express trains, first and last train timings, halt stations, platform numbers and fares.`;

  return {
    title,
    description,
    keywords: [
      `${parsed.fromStr} to ${parsed.toStr} train time table`,
      `${parsed.fromStr} to ${parsed.toStr} local train`,
      `${fromStation?.code || parsed.fromStr} to ${toStation?.code || parsed.toStr} train schedule`,
      `West Bengal train time table today`,
      `${fromName} train time table`,
      `${toName} train timetable`
    ],
    alternates: {
      canonical: `https://banglarail.in/trains-between/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `https://banglarail.in/trains-between/${slug}`,
      siteName: 'Bangla Rail',
      locale: 'en_IN',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default async function TrainsBetweenPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    notFound();
  }

  const [fromStation, toStation] = await Promise.all([
    findStation(parsed.fromStr),
    findStation(parsed.toStr)
  ]);

  if (!fromStation || !toStation) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-900">Station Pair Not Found</h1>
          <p className="text-sm text-neutral-600 max-w-md mx-auto">
            We could not identify &quot;{parsed.fromStr}&quot; or &quot;{parsed.toStr}&quot; in our West Bengal railway database.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition shadow-sm"
        >
          Explore All West Bengal Stations
        </Link>
      </div>
    );
  }

  const planResult = await planRoute(fromStation.code, toStation.code);
  const rawTrains = 'trains' in planResult ? planResult.trains : [];

  const matchingTrains = rawTrains.map((pt) => {
    const dep = pt.departureFrom || '--';
    const arr = pt.arrivalTo || '--';
    let durationMins = 0;
    if (dep !== '--' && arr !== '--') {
      const [dh, dm] = dep.split(':').map(Number);
      const [ah, am] = arr.split(':').map(Number);
      const depTotal = dh * 60 + dm;
      let arrTotal = ah * 60 + am;
      if (arrTotal < depTotal) arrTotal += 24 * 60;
      durationMins = arrTotal - depTotal;
    }

    return {
      id: pt.train.id,
      number: pt.train.number,
      name: pt.train.name,
      type: pt.train.type,
      originStationCode: pt.train.originStationCode,
      destinationStationCode: pt.train.destinationStationCode,
      runningDays: pt.train.runningDays,
      distanceKm: pt.train.distanceKm || 0,
      departure: dep,
      arrival: arr,
      durationMins,
      intermediateCount: pt.intermediateStopsCount,
      halts: pt.allStops.map((s, idx) => ({
        station: s.station,
        stationBn: null,
        code: s.code,
        arr: s.arr,
        dep: s.dep,
        halt: s.halt,
        seq: idx + 1,
        isCurrentFrom: s.code === fromStation.code,
        isCurrentTo: s.code === toStation.code,
      })),
    };
  });

  // Calculate stats
  const totalTrains = matchingTrains.length;
  const firstTrain = matchingTrains[0] || null;
  const lastTrain = matchingTrains[matchingTrains.length - 1] || null;

  // Approximate distance calculation
  const distanceKm = firstTrain?.distanceKm || 45;

  // SEO FAQ Data
  const faqList = [
    {
      q: `What is the first train from ${fromStation.name} to ${toStation.name} today?`,
      a: firstTrain
        ? `The first train from ${fromStation.name} (${fromStation.code}) to ${toStation.name} (${toStation.code}) is ${firstTrain.name} (${firstTrain.number}), departing at ${firstTrain.departure} AM.`
        : `Currently, no direct trains are scheduled for this specific query.`
    },
    {
      q: `What is the last train from ${fromStation.name} to ${toStation.name}?`,
      a: lastTrain
        ? `The last train from ${fromStation.name} to ${toStation.name} is ${lastTrain.name} (${lastTrain.number}), which departs at ${lastTrain.departure}.`
        : `Check connecting routes via nearby junctions like Howrah, Bandel, or Sealdah.`
    },
    {
      q: `How many trains run daily between ${fromStation.name} and ${toStation.name}?`,
      a: `There are ${totalTrains} direct trains (including EMU Locals, MEMU and Express trains) running between ${fromStation.name} and ${toStation.name} throughout the day.`
    },
    {
      q: `What is the ticket fare from ${fromStation.name} to ${toStation.name}?`,
      a: `The standard unreserved EMU suburban local train fare between ${fromStation.name} and ${toStation.name} is approximately ₹5 to ₹15. Express train 2S/General tickets start at ₹30 - ₹50.`
    }
  ];

  // Schema.org JSON-LD Structured Data for Google Rich Snippets & AI Crawlers
  const jsonLdData = generateRouteTripSchema({
    fromStation,
    toStation,
    slug,
    totalTrains,
    faqList,
  });

  const reverseSlug = `${toStation.code.toLowerCase()}-to-${fromStation.code.toLowerCase()}`;


  return (
    <>
      {/* Schema.org Injection for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <div className="min-h-screen bg-[#FDFCF7] text-neutral-900 pb-24">
        {/* Top Breadcrumb & SEO Hero */}
        <div className="bg-white border-b border-[#E7E2D8] shadow-xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-4 overflow-x-auto">
              <Link href="/" className="hover:text-neutral-900 transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <Link href={`/station/${fromStation.code.toLowerCase()}`} className="hover:text-neutral-900 transition">
                {fromStation.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-neutral-900 font-semibold truncate">
                {fromStation.code} to {toStation.code}
              </span>
            </div>

            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Daily Updated Timetable ({new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
                  {fromStation.name} <span className="text-neutral-400 font-normal">to</span> {toStation.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600">
                  {fromStation.nameBn && toStation.nameBn && (
                    <span className="text-neutral-500 font-medium font-serif">
                      {fromStation.nameBn} ➔ {toStation.nameBn}
                    </span>
                  )}
                  <span>•</span>
                  <span><strong>{totalTrains}</strong> Trains Daily</span>
                  <span>•</span>
                  <span>Division: <strong>{fromStation.division}</strong> ({fromStation.zone})</span>
                  <span>•</span>
                  <span>District: <strong>{fromStation.district || 'West Bengal'}</strong></span>
                </div>
              </div>

              {/* Action Buttons: Reverse Route & Station Board */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/trains-between/${reverseSlug}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 text-xs font-bold transition shadow-xs"
                >
                  <ArrowLeftRight className="w-4 h-4 text-neutral-600" />
                  <span>Reverse Direction</span>
                </Link>
                <Link
                  href={`/station/${fromStation.code.toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{fromStation.code} Board</span>
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-100">
              <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#EBE6DC]">
                <div className="text-[11px] text-neutral-500 font-medium">First Train</div>
                <div className="text-base font-bold text-neutral-900 mt-0.5">
                  {firstTrain ? firstTrain.departure : '--'}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">{firstTrain?.name || 'N/A'}</div>
              </div>

              <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#EBE6DC]">
                <div className="text-[11px] text-neutral-500 font-medium">Last Train</div>
                <div className="text-base font-bold text-neutral-900 mt-0.5">
                  {lastTrain ? lastTrain.departure : '--'}
                </div>
                <div className="text-[10px] text-neutral-500 truncate">{lastTrain?.name || 'N/A'}</div>
              </div>

              <div className="bg-[#FAF8F3] p-3 rounded-xl border border-[#EBE6DC]">
                <div className="text-[11px] text-neutral-500 font-medium">Daily Frequency</div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {totalTrains} Trains
                </div>
                <div className="text-[10px] text-neutral-500">All train types</div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <div className="text-[11px] text-emerald-700 font-medium">Today&apos;s Date</div>
                <div className="text-base font-bold text-emerald-900 mt-0.5">
                  {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
                <div className="text-[10px] text-emerald-700">{new Date().toLocaleDateString('en-IN', { weekday: 'long' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Interactive Train Table & Filters */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          <TrainsBetweenClient
            fromStation={fromStation}
            toStation={toStation}
            trains={matchingTrains}
          />

          {/* SEO Detailed Information Section */}
          <div className="mt-16 space-y-12">
            {/* Guide & Route Overview */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D8] shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                {fromStation.name} to {toStation.name} Train Travel Guide
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed">
                Traveling by local train between <strong>{fromStation.name} ({fromStation.code})</strong> and <strong>{toStation.name} ({toStation.code})</strong> is the fastest, most economical, and most convenient mode of daily commute across West Bengal. Trains operate frequently throughout the morning, peak office hours, afternoon, and late evening.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1">🎟️ Suburban Fare</div>
                  <p className="text-neutral-600">EMU Local unreserved tickets cost ₹5 to ₹15. Monthly and quarterly season tickets (MST) are also valid.</p>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1">⚡ Peak Hours</div>
                  <p className="text-neutral-600">Morning rush: 07:30 AM – 10:30 AM. Evening rush: 05:00 PM – 08:30 PM with high frequency.</p>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="font-bold text-neutral-900 mb-1">📍 UTS Mobile App</div>
                  <p className="text-neutral-600">Paperless unreserved local train tickets can be booked seamlessly via the official UTS on Mobile app.</p>
                </div>
              </div>
            </div>

            {/* Google Search SEO FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D8] shadow-xs space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  Frequently Asked Questions (FAQ)
                </h2>
                <p className="text-xs text-neutral-500">
                  Common queries about train timings, frequency, ticket prices, and schedule.
                </p>
              </div>

              <div className="space-y-4">
                {faqList.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EBE6DC] space-y-2">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-start gap-2">
                      <span className="text-neutral-400 font-bold">Q{idx + 1}.</span>
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-700 pl-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related West Bengal Train Routes */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Popular West Bengal Routes from {fromStation.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Howrah Junction', code: 'hwh' },
                  { name: 'Bandel Junction', code: 'bdc' },
                  { name: 'Barddhaman Junction', code: 'bwn' },
                  { name: 'Sealdah', code: 'sdah' },
                  { name: 'Naihati Junction', code: 'nh' },
                  { name: 'Ranaghat Junction', code: 'rha' },
                  { name: 'Kharagpur Junction', code: 'kgp' },
                  { name: 'Digha', code: 'dgha' },
                  { name: 'New Jalpaiguri', code: 'njp' }
                ].filter(dest => dest.code.toLowerCase() !== fromStation.code.toLowerCase()).slice(0, 7).map((dest, i) => (
                  <Link
                    key={i}
                    href={`/trains-between/${fromStation.code.toLowerCase()}-to-${dest.code}`}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-900 hover:text-white border border-[#E7E2D8] text-xs font-semibold text-neutral-800 transition shadow-2xs flex items-center gap-1.5"
                  >
                    <span>{fromStation.name} ➔ {dest.name}</span>
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
