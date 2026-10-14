import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resolveStation } from '@/lib/station-cache';
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

// Robust slug parser that strips SEO suffixes and normalizes hyphenation
function parseSlug(slug: string): { fromStr: string; toStr: string } | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();

  // Strip trailing query suffixes like -trains, -local-train, -schedule, -timetable, -timings, -today
  const cleanSlug = decoded
    .replace(/-trains?$/i, '')
    .replace(/-local(-trains?)?$/i, '')
    .replace(/-timings?$/i, '')
    .replace(/-time-table$/i, '')
    .replace(/-timetable$/i, '')
    .replace(/-schedule$/i, '')
    .replace(/-today$/i, '');

  const parts = cleanSlug.split('-to-');
  if (parts.length !== 2) return null;

  const fromStr = parts[0].replace(/-/g, ' ').trim();
  const toStr = parts[1].replace(/-/g, ' ').trim();
  if (!fromStr || !toStr) return null;

  return { fromStr, toStr };
}

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

  const title = `${fromName} to ${toName} Train Time Table Today - Schedule & Timings`;
  const description = `Check today's complete 24-hour train timetable between ${fromName} and ${toName}. View all EMU locals, express trains, departure timings, halt stations, platform numbers and fares.`;

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

  // Blazing fast memory-indexed route resolution (<1ms)
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
  const distanceKm = firstTrain?.distanceKm || 38;

  // SEO FAQ Data
  const faqList = [
    {
      q: `What is the first train from ${fromStation.name} to ${toStation.name} today?`,
      a: firstTrain
        ? `The first train from ${fromStation.name} (${fromStation.code}) to ${toStation.name} (${toStation.code}) is ${firstTrain.name} (${firstTrain.number}), departing at ${firstTrain.departure}.`
        : `Check connecting routes via nearby junctions like Howrah, Bandel, or Sealdah.`
    },
    {
      q: `What is the last train from ${fromStation.name} to ${toStation.name}?`,
      a: lastTrain
        ? `The last train from ${fromStation.name} to ${toStation.name} is ${lastTrain.name} (${lastTrain.number}), which departs at ${lastTrain.departure}.`
        : `Check connecting trains or night commuters on Bangla Rail.`
    },
    {
      q: `How many trains run daily between ${fromStation.name} and ${toStation.name}?`,
      a: `There are ${totalTrains} direct trains (including EMU Locals, MEMU and Express services) running between ${fromStation.name} and ${toStation.name} across 24 hours.`
    },
    {
      q: `What is the ticket fare from ${fromStation.name} to ${toStation.name}?`,
      a: `The standard unreserved suburban EMU local train fare between ${fromStation.name} and ${toStation.name} is approximately ₹5 to ₹15. Express 2S tickets start at ₹30 - ₹50.`
    }
  ];

  // Schema.org Trip, FAQ & Breadcrumbs JSON-LD (all bundled in @graph)
  const schemaTrip = generateRouteTripSchema({
    fromStation: { name: fromStation.name, code: fromStation.code },
    toStation: { name: toStation.name, code: toStation.code },
    slug,
    totalTrains,
    faqList,
  });

  return (
    <div className="space-y-6 pb-12">
      {/* JSON-LD Schemas — BreadcrumbList + FAQPage + TransitLine bundled */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaTrip) }}
      />

      {/* Top Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#71717A] overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-black transition-colors font-medium">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <Link href={`/station/${fromStation.code.toLowerCase()}`} className="hover:text-black transition-colors font-medium">
          {fromStation.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-[#111111] font-semibold">To {toStation.name}</span>
      </nav>

      {/* Hero Route Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#111111] text-white font-semibold flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-emerald-400" />
                {totalTrains} Daily Trains Available
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#F7F5EE] border border-[#E7E2D8] text-[#71717A] font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                24-Hour Timetable
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                  {fromStation.name}
                </h1>
                <p className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-max mt-0.5">
                  {fromStation.code}
                </p>
              </div>

              <div className="flex items-center justify-center p-2 rounded-full bg-[#FAF8F3] border border-[#EAE6DC]">
                <ArrowRight className="w-5 h-5 text-neutral-600 stroke-[2.5]" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                  {toStation.name}
                </h2>
                <p className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded w-max mt-0.5">
                  {toStation.code}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#71717A] leading-relaxed max-w-2xl">
              Showing all suburban EMU locals, fast commuter trains, and mail express services running between 
              <strong> {fromStation.name} ({fromStation.code})</strong> and <strong>{toStation.name} ({toStation.code})</strong> today.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 bg-[#FAF8F3] p-4 rounded-xl border border-[#EAE6DC] text-center min-w-[280px]">
            <div className="p-2 bg-white rounded-lg border border-[#EAE6DC]/60">
              <span className="text-[10px] uppercase font-bold text-[#71717A] block">First Train</span>
              <span className="text-sm font-black text-[#111111] font-mono mt-0.5 block">
                {firstTrain ? firstTrain.departure : '--:--'}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-[#EAE6DC]/60">
              <span className="text-[10px] uppercase font-bold text-[#71717A] block">Last Train</span>
              <span className="text-sm font-black text-[#111111] font-mono mt-0.5 block">
                {lastTrain ? lastTrain.departure : '--:--'}
              </span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-[#EAE6DC]/60">
              <span className="text-[10px] uppercase font-bold text-[#71717A] block">Fare (Approx)</span>
              <span className="text-sm font-black text-emerald-700 font-mono mt-0.5 block">
                ₹5 - ₹10
              </span>
            </div>
          </div>
        </div>

        {/* Swap / Reverse Route Link */}
        <div className="mt-5 pt-4 border-t border-[#F0ECE3] flex items-center justify-between flex-wrap gap-2 text-xs">
          <Link
            href={`/trains-between/${toStation.code.toLowerCase()}-to-${fromStation.code.toLowerCase()}`}
            className="inline-flex items-center gap-1.5 font-bold text-neutral-800 hover:text-emerald-700 transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
            <span>Return Trains: {toStation.name} ➔ {fromStation.name}</span>
          </Link>
          <span className="text-[#A1A1AA] text-[11px]">
            Live updated from Eastern &amp; South Eastern Railway schedules
          </span>
        </div>
      </div>

      {/* Main Interactive Client Filter & List */}
      <TrainsBetweenClient
        fromStation={fromStation}
        toStation={toStation}
        trains={matchingTrains}
      />

      {/* SEO Corridor Information & FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {/* Corridor Highlights */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7E2D8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            Route &amp; Travel Highlights
          </h3>
          <ul className="space-y-2 text-xs text-[#71717A] leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Frequency:</strong> High-frequency suburban connectivity with local trains running every 15-25 minutes during peak morning and evening hours.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Commuter Friendly:</strong> Unreserved 12-coach EMU rakes with designated women compartments and vendor coaches.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ticketing:</strong> Unreserved tickets available at UTS counters and via IRCTC UTS mobile app.
              </span>
            </li>
          </ul>
        </div>

        {/* FAQs */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E7E2D8] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {faqList.map((faq, i) => (
              <div key={i} className="text-xs space-y-1">
                <span className="font-bold text-neutral-900 block">{faq.q}</span>
                <p className="text-[#71717A] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
