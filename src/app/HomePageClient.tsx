'use client';

import React, { useState, useCallback, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Clock,
  ChevronRight,
  Search,
  X,
  Train as TrainIcon,
  Check,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Timer,
  Compass,
  ArrowUpDown,
  Filter,
  Navigation,
  Zap,
  Route,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface TrainSchedule {
  id: string;
  number: string;
  name: string;
  type: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  via: string;
  runningDays: string;
  departure: string;
  arrival: string;
  durationMins: number;
  classes: string[];
  halts: {
    station: string;
    code: string;
    arr: string;
    dep: string;
    halt: string;
    day: number;
    platform: string;
  }[];
}

interface StationItem {
  id: string;
  code: string;
  name: string;
  nameBn?: string | null;
  zone: string;
  division: string;
  district?: string | null;
}

// ─── Popular Stations ────────────────────────────────────────────────────────

const POPULAR_STATIONS: { code: string; name: string; nameBn: string }[] = [
  { code: 'HWH', name: 'Howrah Junction', nameBn: 'হাওড়া' },
  { code: 'SDAH', name: 'Sealdah', nameBn: 'শিয়ালদহ' },
  { code: 'BDC', name: 'Bandel Junction', nameBn: 'ব্যান্ডেল' },
  { code: 'BWN', name: 'Barddhaman Junction', nameBn: 'বর্ধমান' },
  { code: 'KGP', name: 'Kharagpur Junction', nameBn: 'খড়্গপুর' },
  { code: 'M-SCV', name: 'Salt Lake Sector V', nameBn: 'সল্টলেক সেক্টর ৫' },
  { code: 'M-HMD', name: 'Howrah Maidan (Metro)', nameBn: 'হাওড়া ময়দান' },
  { code: 'DGHA', name: 'Digha Flag Station', nameBn: 'দিঘা' },
];

const POPULAR_METRO_STATIONS: { code: string; name: string }[] = [
  { code: 'M-HMD', name: 'Howrah Maidan' },
  { code: 'M-HWH', name: 'Howrah (Metro)' },
  { code: 'M-ESP', name: 'Esplanade' },
  { code: 'M-SDAH', name: 'Sealdah (Metro)' },
  { code: 'M-SCV', name: 'Sector V' },
  { code: 'M-DKS', name: 'Dakshineswar' },
  { code: 'M-KVS', name: 'Kavi Subhash' },
  { code: 'M-JOKA', name: 'Joka' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getTodayFormatted = () =>
  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function calcDuration(dep: string, arr: string): number {
  if (!dep || !arr || dep === '--' || arr === '--') return 0;
  const [dh, dm] = dep.split(':').map(Number);
  const [ah, am] = arr.split(':').map(Number);
  const depMins = dh * 60 + dm;
  let arrMins = ah * 60 + am;
  if (arrMins < depMins) arrMins += 24 * 60;
  return arrMins - depMins;
}

function formatDuration(mins: number): string {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
}

function getTypeBadge(type: string): { bg: string; text: string; border: string; label: string; accentColor: string } {
  const t = type.toLowerCase();
  if (t.includes('vande'))
    return { bg: 'bg-yellow-400', text: 'text-black', border: 'border-black', label: type, accentColor: '#FACC15' };
  if (t.includes('rajdhani') || t.includes('duronto') || t.includes('shatabdi'))
    return { bg: 'bg-black', text: 'text-yellow-400', border: 'border-yellow-400', label: type, accentColor: '#000000' };
  if (t.includes('superfast'))
    return { bg: 'bg-zinc-900', text: 'text-white', border: 'border-zinc-700', label: type, accentColor: '#18181B' };
  if (t.includes('express') || t.includes('mail'))
    return { bg: 'bg-zinc-800', text: 'text-zinc-100', border: 'border-zinc-700', label: type, accentColor: '#27272A' };
  if (t.includes('metro'))
    return { bg: 'bg-yellow-300', text: 'text-black', border: 'border-black', label: type, accentColor: '#EAB308' };
  return { bg: 'bg-zinc-100', text: 'text-zinc-900', border: 'border-zinc-300', label: type, accentColor: '#71717A' };
}

// ─── Running Days Badge ──────────────────────────────────────────────────────
// Parses any of: "Daily", "Daily Except Wed", "Mon,Tue,Wed,Thu,Fri,Sat", etc.
// Returns a boolean[7] for [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
function parseRunningDays(days: string): boolean[] {
  if (!days) return Array(7).fill(true);
  const d = days.trim().toLowerCase();

  if (d === 'daily') return Array(7).fill(true);

  // "Daily Except X" or "Except X"
  const exceptMatch = d.match(/(?:daily\s+)?except\s+(.+)/);
  if (exceptMatch) {
    const result = Array(7).fill(true);
    const excluded = exceptMatch[1].split(/[,/&\s]+/).map((s) => s.trim());
    const dayMap: Record<string, number> = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
    excluded.forEach((ex) => {
      const key = ex.slice(0, 3).toLowerCase();
      if (key in dayMap) result[dayMap[key]] = false;
    });
    return result;
  }

  // Comma/slash/space separated days like "Mon,Tue,Wed"
  const parts = d.split(/[,/&\s]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 0) {
    const result = Array(7).fill(false);
    const dayMap: Record<string, number> = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6 };
    parts.forEach((p) => {
      const key = p.slice(0, 3).toLowerCase();
      if (key in dayMap) result[dayMap[key]] = true;
    });
    // If nothing matched, fall back to all-true
    if (result.every((v) => !v)) return Array(7).fill(true);
    return result;
  }

  return Array(7).fill(true);
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const DAY_FULL   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function RunningDaysBadge({
  days,
  size = 'sm',
}: {
  days: string;
  size?: 'sm' | 'md';
}) {
  const active = parseRunningDays(days);
  const isAllDaily = active.every(Boolean);

  return (
    <span
      className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-zinc-100 border border-zinc-200 select-none shadow-2xs"
      title={days || 'Daily'}
      aria-label={`Runs on: ${active.map((a, i) => a ? DAY_FULL[i] : '').filter(Boolean).join(', ') || 'Daily'}`}
    >
      <span className="flex items-center gap-0.5">
        {DAY_LABELS.map((label, i) => (
          <span
            key={i}
            className={`
              inline-flex items-center justify-center rounded font-black font-mono select-none transition-all
              ${size === 'md' ? 'w-5 h-5 text-[10.5px]' : 'w-4 h-4 text-[9.5px]'}
              ${active[i]
                ? 'bg-black text-yellow-400 shadow-2xs'
                : 'text-zinc-400 bg-white/80 border border-zinc-200 opacity-20'
              }
            `}
            aria-hidden="true"
          >
            {label}
          </span>
        ))}
      </span>
      {isAllDaily && (
        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-black text-yellow-400">
          Daily
        </span>
      )}
    </span>
  );
}

function extractCode(val: string): string {
  if (!val) return '';
  const codeMatch = val.match(/\(([A-Za-z0-9\-]+)\)$/);
  return codeMatch ? codeMatch[1].toUpperCase() : val.trim().toUpperCase();
}

// ─── Destination Train Icon SVG ──────────────────────────────────────────────

function DestinationTrainIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 20V10a3 3 0 0 1 3-3h11.5c3.2 0 6 1.8 7.5 4.6l2 3.6c.7 1.3 1 2.8 1 4.3V20a1 1 0 0 1-1 1H4" />
      <path d="M19 10h2.2c1.4 0 2.6.8 3.3 2l1.5 2.5c.1.3.2.5.2.8V16h-7.2V10z" strokeWidth="1.8" />
      <rect x="7" y="10" width="4.5" height="6" rx="1" strokeWidth="1.8" />
      <rect x="13" y="10" width="4.5" height="6" rx="1" strokeWidth="1.8" />
      <circle cx="9" cy="24" r="1.8" fill="currentColor" />
      <circle cx="21" cy="24" r="1.8" fill="currentColor" />
      <line x1="2" y1="26" x2="30" y2="26" strokeWidth="2.2" />
    </svg>
  );
}

// Metro SVG icon
function MetroIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5 2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v8h14V4H5zm2 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm10 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM8 22l1-3h6l1 3H8z"/>
    </svg>
  );
}

// ─── Client In-Memory Route Cache (0ms instant re-query) ───────────────────
const clientRouteCache = new Map<string, any>();

// ─── Reusable Search Widget ───────────────────────────────────────────────────

interface SearchWidgetProps {
  allStations: StationItem[];
  initialFrom?: { code: string; name: string; nameBn?: string };
  initialTo?: { code: string; name: string; nameBn?: string };
  accentColor?: 'yellow' | 'cyan';
  label?: string;
  isMetro?: boolean;
  popularStations?: { code: string; name: string; nameBn?: string }[];
  onResult?: (trains: TrainSchedule[], fromSt: StationItem, toSt: StationItem) => void;
  onLoading?: (v: boolean) => void;
  onSearched?: (v: boolean) => void;
}

function SearchWidget({
  allStations,
  initialFrom = { code: 'HWH', name: 'Howrah Junction', nameBn: 'হাওড়া' },
  initialTo = { code: 'BWN', name: 'Barddhaman Junction', nameBn: 'বর্ধমান' },
  accentColor = 'yellow',
  isMetro = false,
  popularStations = POPULAR_STATIONS,
  onResult,
  onLoading,
  onSearched,
}: SearchWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlFrom = searchParams.get('from') || '';
  const urlTo = searchParams.get('to') || '';
  const urlQ = searchParams.get('q') || '';

  let effectiveFrom = urlFrom;
  let effectiveTo = urlTo;
  if (urlQ && (!effectiveFrom || !effectiveTo)) {
    const cleaned = urlQ.toLowerCase().replace(/trains?/gi, '').replace(/local/gi, '').replace(/schedule/gi, '').trim();
    if (cleaned.includes(' to ')) {
      const p = cleaned.split(/\s+to\s+/i);
      if (!effectiveFrom) effectiveFrom = p[0].trim();
      if (!effectiveTo) effectiveTo = p[1].trim();
    } else if (cleaned.includes('-')) {
      const p = cleaned.split('-');
      if (!effectiveFrom) effectiveFrom = p[0].trim();
      if (!effectiveTo) effectiveTo = p[1].trim();
    }
  }

  // Filter out mismatched params between Local and Metro
  const isMetroCode = (val: string) => val.trim().toUpperCase().startsWith('M-');
  if (isMetro && effectiveFrom && !isMetroCode(effectiveFrom) && !isMetroCode(effectiveTo)) {
    effectiveFrom = '';
    effectiveTo = '';
  }
  if (!isMetro && (isMetroCode(effectiveFrom) || isMetroCode(effectiveTo))) {
    effectiveFrom = '';
    effectiveTo = '';
  }

  const [fromInput, setFromInput] = useState(`${initialFrom.name} (${initialFrom.code})`);
  const [toInput, setToInput] = useState(`${initialTo.name} (${initialTo.code})`);
  const [selectedFromStation, setSelectedFromStation] = useState<StationItem | null>({
    id: initialFrom.code.toLowerCase(), code: initialFrom.code, name: initialFrom.name,
    nameBn: initialFrom.nameBn, zone: 'ER', division: 'Howrah',
  });
  const [selectedToStation, setSelectedToStation] = useState<StationItem | null>({
    id: initialTo.code.toLowerCase(), code: initialTo.code, name: initialTo.name,
    nameBn: initialTo.nameBn, zone: 'ER', division: 'Howrah',
  });

  const [trainsList, setTrainsList] = useState<TrainSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentDateStr] = useState(getTodayFormatted());
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<TrainSchedule | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'EMU' | 'EXPRESS' | 'MORNING' | 'AFTERNOON' | 'EVENING'>('ALL');
  const [sortBy, setSortBy] = useState<'DEP' | 'DUR'>('DEP');

  const fromWrapperRef = useRef<HTMLDivElement>(null);
  const toWrapperRef = useRef<HTMLDivElement>(null);
  const lastLoadedRouteRef = useRef<string>('');

  // Filter stations
  const filterStations = useCallback(
    (query: string): StationItem[] => {
      if (!allStations.length) return [];
      const clean = query.trim().toLowerCase();
      if (!clean) return allStations.slice(0, 30);
      const upper = clean.toUpperCase();
      const exactCode: StationItem[] = [];
      const prefix: StationItem[] = [];
      const contains: StationItem[] = [];
      for (const s of allStations) {
        const sCode = s.code.toUpperCase();
        const sName = s.name.toLowerCase();
        const sBn = s.nameBn || '';
        if (sCode === upper) exactCode.push(s);
        else if (sCode.startsWith(upper) || sName.startsWith(clean)) prefix.push(s);
        else if (sName.includes(clean) || sCode.includes(upper) || sBn.includes(query)) contains.push(s);
      }
      return [...exactCode, ...prefix, ...contains].slice(0, 30);
    },
    [allStations]
  );

  const filteredFromStations = useMemo(() => filterStations(fromInput), [filterStations, fromInput]);
  const filteredToStations = useMemo(() => filterStations(toInput), [filterStations, toInput]);

  const loadRouteTrains = useCallback((fromQuery: string, toQuery: string, shouldScroll = false) => {
    if (!fromQuery || !toQuery) return;
    setIsLoading(true);
    onLoading?.(true);
    setHasSearched(true);
    onSearched?.(true);

    const cacheKey = `${fromQuery.trim().toUpperCase()}:::${toQuery.trim().toUpperCase()}`;

    const applyData = (data: any) => {
      if (data.fromStation && data.toStation) {
        setFromInput(`${data.fromStation.name} (${data.fromStation.code})`);
        setToInput(`${data.toStation.name} (${data.toStation.code})`);
        setSelectedFromStation(data.fromStation);
        setSelectedToStation(data.toStation);

        if (Array.isArray(data.trains) && data.trains.length > 0) {
          const mapped: TrainSchedule[] = data.trains.map((item: any) => {
            const dep = item.departureFrom || '--';
            const arr = item.arrivalTo || '--';
            const dur = calcDuration(dep, arr);
            return {
              id: item.train.id,
              number: item.train.number,
              name: item.train.name,
              type: item.train.type,
              fromCode: data.fromStation.code,
              fromName: `${data.fromStation.name} (${data.fromStation.code})`,
              toCode: data.toStation.code,
              toName: `${data.toStation.name} (${data.toStation.code})`,
              via: item.via || '',
              runningDays: item.train.runningDays || 'Daily',
              departure: dep,
              arrival: arr,
              durationMins: dur,
              classes: ['All Classes', 'General', '2S', 'SL', '3A'],
              halts: (item.allStops || []).map((s: any) => ({
                station: s.station, code: s.code, arr: s.arr || 'Source',
                dep: s.dep || 'Destination', halt: s.halt || '--', day: s.day || 1, platform: s.platform || '--',
              })),
            };
          });
          setTrainsList(mapped);
          onResult?.(mapped, data.fromStation, data.toStation);
        } else {
          setTrainsList([]);
          onResult?.([], data.fromStation, data.toStation);
        }

        if (shouldScroll) {
          setTimeout(() => {
            const el = document.getElementById('train-results');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    if (clientRouteCache.has(cacheKey)) {
      applyData(clientRouteCache.get(cacheKey));
      setIsLoading(false);
      onLoading?.(false);
      return;
    }

    fetch(`/api/routes/plan?from=${encodeURIComponent(fromQuery)}&to=${encodeURIComponent(toQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error('No trains found');
        return res.json();
      })
      .then((data) => {
        clientRouteCache.set(cacheKey, data);
        applyData(data);
      })
      .catch((err) => { console.log('Route query:', err.message); setTrainsList([]); })
      .finally(() => { setIsLoading(false); onLoading?.(false); });
  }, [onResult, onLoading, onSearched]);

  // Handle outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (fromWrapperRef.current && !fromWrapperRef.current.contains(e.target as Node)) setIsFromOpen(false);
      if (toWrapperRef.current && !toWrapperRef.current.contains(e.target as Node)) setIsToOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Load default route on mount
  React.useEffect(() => {
    const f = effectiveFrom || initialFrom.code;
    const t = effectiveTo || initialTo.code;
    const routeKey = `${f}:::${t}`;
    if (lastLoadedRouteRef.current === routeKey) return;
    lastLoadedRouteRef.current = routeKey;
    const hasCustomParams = Boolean(urlFrom || urlTo || urlQ);
    loadRouteTrains(f, t, hasCustomParams);
  }, [effectiveFrom, effectiveTo, urlFrom, urlTo, urlQ, loadRouteTrains, initialFrom.code, initialTo.code]);

  const handleSelectFrom = (st: StationItem) => {
    setSelectedFromStation(st);
    setFromInput(`${st.name} (${st.code})`);
    setIsFromOpen(false);
  };
  const handleSelectTo = (st: StationItem) => {
    setSelectedToStation(st);
    setToInput(`${st.name} (${st.code})`);
    setIsToOpen(false);
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);
    const prevFromInput = fromInput;
    const prevToInput = toInput;
    const prevFromSt = selectedFromStation;
    const prevToSt = selectedToStation;
    setFromInput(prevToInput);
    setToInput(prevFromInput);
    setSelectedFromStation(prevToSt);
    setSelectedToStation(prevFromSt);
    const fromCode = extractCode(prevToInput);
    const toCode = extractCode(prevFromInput);
    lastLoadedRouteRef.current = `${fromCode}:::${toCode}`;
    router.push(`/?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}`);
    loadRouteTrains(fromCode, toCode);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let fromCode = extractCode(fromInput);
    if (!selectedFromStation && filteredFromStations.length > 0) {
      const top = filteredFromStations[0];
      handleSelectFrom(top);
      fromCode = top.code;
    }
    let toCode = extractCode(toInput);
    if (!selectedToStation && filteredToStations.length > 0) {
      const top = filteredToStations[0];
      handleSelectTo(top);
      toCode = top.code;
    }
    setIsFromOpen(false);
    setIsToOpen(false);
    lastLoadedRouteRef.current = `${fromCode}:::${toCode}`;
    router.push(`/?from=${encodeURIComponent(fromCode)}&to=${encodeURIComponent(toCode)}`);
    loadRouteTrains(fromCode, toCode, true);
  };

  const filteredTrains = trainsList
    .filter((train) => {
      if (activeFilter === 'EMU') {
        const t = train.type.toLowerCase();
        if (!t.includes('emu') && !t.includes('local') && !t.includes('suburban')) return false;
      }
      if (activeFilter === 'EXPRESS') {
        const t = train.type.toLowerCase();
        if (t.includes('emu') || t.includes('local') || t.includes('suburban')) return false;
      }
      if (activeFilter === 'MORNING' || activeFilter === 'AFTERNOON' || activeFilter === 'EVENING') {
        if (!train.departure || train.departure === '--') return false;
        const [h] = train.departure.split(':').map(Number);
        if (activeFilter === 'MORNING' && (h < 4 || h >= 12)) return false;
        if (activeFilter === 'AFTERNOON' && (h < 12 || h >= 17)) return false;
        if (activeFilter === 'EVENING' && h < 17 && h >= 4) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'DUR') return a.durationMins - b.durationMins;
      return a.departure.localeCompare(b.departure);
    });

  // Yellow, Black, and White UI styling
  const inputCls =
    'w-full h-12 pl-10 pr-9 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white border-2 border-zinc-300 focus:border-black rounded-xl text-sm font-bold text-black placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all shadow-2xs';
  const submitBtnCls =
    'w-full md:w-auto h-12 px-8 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black text-sm font-black rounded-xl border-2 border-black flex items-center justify-center gap-2.5 shadow-sm active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap';
  const cardCls =
    'bg-white rounded-2xl border-2 border-black p-4 sm:p-6 shadow-md relative z-30';
  const dropdownCls =
    'absolute top-full left-0 right-0 md:w-96 mt-2 bg-white rounded-xl border-2 border-black shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100';
  const stationBtnCls = 'w-full text-left px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors group';

  return (
    <>
      {/* Search Form */}
      <form
        onSubmit={handleSearchSubmit}
        role="search"
        aria-label="Find trains between stations"
        className={cardCls}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_auto_1.4fr_auto] items-center gap-4">

          {/* ORIGIN INPUT */}
          <div ref={fromWrapperRef} className="relative">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2 text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black" />
              <span>Origin Station</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fromInput}
                onChange={(e) => { setFromInput(e.target.value); setIsFromOpen(true); setSelectedFromStation(null); }}
                onFocus={() => { setIsFromOpen(true); setIsToOpen(false); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); if (filteredFromStations.length > 0) handleSelectFrom(filteredFromStations[0]); }
                }}
                placeholder="Type station name, code or বাংলা..."
                className={inputCls}
              />
              <MapPin className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {fromInput && (
                <button type="button" onClick={() => { setFromInput(''); setSelectedFromStation(null); setIsFromOpen(true); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {isFromOpen && (
              <div className={dropdownCls}>
                <div className="mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1 text-zinc-600">Popular Hubs:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularStations.slice(0, 6).map((st) => (
                      <button key={st.code} type="button"
                        onClick={() => handleSelectFrom({ id: st.code, code: st.code, name: st.name, nameBn: st.nameBn, zone: 'ER', division: 'ER' })}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-zinc-300 transition-colors bg-zinc-100 hover:bg-black hover:text-yellow-400 text-black"
                      >
                        {st.code}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5 divide-y divide-zinc-100 border-t border-zinc-200 pt-1">
                  {filteredFromStations.length === 0 ? (
                    <div className="p-3 text-xs text-center text-zinc-400">No matching station found</div>
                  ) : (
                    filteredFromStations.map((st) => (
                      <button key={st.id || st.code} type="button" onClick={() => handleSelectFrom(st)}
                        className={`${stationBtnCls} hover:bg-yellow-100 hover:text-black`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-black">{st.name}</span>
                              <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded font-bold bg-zinc-100 text-black border border-zinc-300">{st.code}</span>
                            </div>
                            {st.nameBn && <div className="text-[10px] mt-0.5 text-zinc-500">{st.nameBn}</div>}
                          </div>
                          {fromInput.includes(`(${st.code})`) && <Check className="w-4 h-4 text-black shrink-0" />}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SWAP BUTTON */}
          <div className="flex items-center justify-center md:pt-6">
            <button
              type="button" onClick={handleSwap}
              aria-label="Swap origin and destination"
              className="w-11 h-11 rounded-xl flex items-center justify-center border-2 border-black transition-all duration-200 shadow-2xs hover:shadow-md active:scale-95 bg-white hover:bg-yellow-400 text-black group"
            >
              <ArrowLeftRight className={`w-4 h-4 stroke-[2.4] transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* DESTINATION INPUT */}
          <div ref={toWrapperRef} className="relative">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-2 text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-black border border-yellow-400" />
              <span>Destination Station</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={toInput}
                onChange={(e) => { setToInput(e.target.value); setIsToOpen(true); setSelectedToStation(null); }}
                onFocus={() => { setIsToOpen(true); setIsFromOpen(false); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); if (filteredToStations.length > 0) handleSelectTo(filteredToStations[0]); }
                }}
                placeholder="Type destination station, code or বাংলা..."
                className={inputCls}
              />
              <DestinationTrainIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-black" />
              {toInput && (
                <button type="button" onClick={() => { setToInput(''); setSelectedToStation(null); setIsToOpen(true); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {isToOpen && (
              <div className={dropdownCls}>
                <div className="mb-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5 px-1 text-zinc-600">Popular Hubs:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularStations.slice(0, 6).map((st) => (
                      <button key={st.code} type="button"
                        onClick={() => handleSelectTo({ id: st.code, code: st.code, name: st.name, nameBn: st.nameBn, zone: 'ER', division: 'ER' })}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-zinc-300 transition-colors bg-zinc-100 hover:bg-black hover:text-yellow-400 text-black"
                      >
                        {st.code}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-0.5 divide-y divide-zinc-100 border-t border-zinc-200 pt-1">
                  {filteredToStations.length === 0 ? (
                    <div className="p-3 text-xs text-center text-zinc-400">No matching station found</div>
                  ) : (
                    filteredToStations.map((st) => (
                      <button key={st.id || st.code} type="button" onClick={() => handleSelectTo(st)}
                        className={`${stationBtnCls} hover:bg-yellow-100 hover:text-black`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-black">{st.name}</span>
                              <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded font-bold bg-zinc-100 text-black border border-zinc-300">{st.code}</span>
                            </div>
                            {st.nameBn && <div className="text-[10px] mt-0.5 text-zinc-500">{st.nameBn}</div>}
                          </div>
                          {toInput.includes(`(${st.code})`) && <Check className="w-4 h-4 text-black shrink-0" />}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="md:pt-6">
            <button type="submit" disabled={isLoading} className={submitBtnCls}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <Search className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>Find Trains</span>
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      <div id="train-results" className="space-y-3">
        {/* Filter Bar */}
        {hasSearched && !isLoading && (
          <div className="space-y-3 bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black" />
                <span className="font-bold text-black">{currentDateStr}</span>
                <span className="text-zinc-300">•</span>
                <span className="font-black text-black bg-yellow-400 px-2.5 py-0.5 rounded-md border border-black">
                  {filteredTrains.length} train{filteredTrains.length !== 1 ? 's' : ''} available
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="font-semibold text-[11px] hidden sm:inline text-zinc-500">Sort:</span>
                <button
                  onClick={() => setSortBy(sortBy === 'DEP' ? 'DUR' : 'DEP')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-black transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-black" />
                  <span>{sortBy === 'DEP' ? 'Departure Time' : 'Fastest Duration'}</span>
                </button>
              </div>
            </div>
            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {[
                { id: 'ALL', label: `All Trains (${trainsList.length})` },
                { id: 'EMU', label: 'EMU Locals' },
                { id: 'EXPRESS', label: 'Express & Superfast' },
                { id: 'MORNING', label: 'Morning (4am-12pm)' },
                { id: 'AFTERNOON', label: 'Afternoon (12-5pm)' },
                { id: 'EVENING', label: 'Evening (5pm+)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 ${
                    activeFilter === f.id
                      ? 'bg-black text-yellow-400 border border-black shadow-2xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-white rounded-2xl border border-zinc-200 shadow-2xs">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black text-yellow-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div className="text-sm font-black text-black">Fetching Timetables...</div>
            <div className="text-xs text-zinc-500">Querying schedules across 667+ West Bengal stations</div>
          </div>
        )}

        {/* Train Cards */}
        {!isLoading && (
          <div>
            {filteredTrains.length === 0 && hasSearched ? (
              <div className="py-16 px-6 text-center space-y-3 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto bg-yellow-100 border border-yellow-300 text-black">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-black">No Direct Trains Found</h3>
                <p className="text-xs max-w-sm mx-auto leading-relaxed text-zinc-500">
                  Try swapping origin and destination stations, or check popular junction connections like Howrah, Sealdah, or Bandel.
                </p>
                <div className="flex justify-center gap-2.5 pt-2">
                  <button onClick={() => setActiveFilter('ALL')} className="px-4 py-2 rounded-lg text-xs font-bold border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-black transition-colors">
                    Reset Filter
                  </button>
                  <button onClick={handleSwap} className="px-4 py-2 rounded-lg text-xs font-black text-black bg-yellow-400 hover:bg-yellow-300 border border-black transition-colors">
                    Swap Stations
                  </button>
                </div>
              </div>
            ) : filteredTrains.length === 0 && !hasSearched ? (
              <div className="py-16 px-6 text-center space-y-3 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto bg-zinc-100 text-black border border-zinc-300">
                  <TrainIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-black">
                  Select stations and press <strong className="bg-yellow-400 px-1.5 py-0.5 rounded border border-black">Find Trains</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTrains.map((train) => {
                  const badge = getTypeBadge(train.type);
                  return (
                    <div
                      key={train.id}
                      onClick={() => setSelectedTrain(train)}
                      className="bg-white hover:bg-zinc-50/70 rounded-2xl border border-zinc-200 hover:border-black p-4 sm:p-5 cursor-pointer group relative overflow-hidden transition-all shadow-2xs hover:shadow-md"
                    >
                      {/* Left accent stripe */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2 bg-yellow-400"
                      />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-2">
                        {/* Departure / Route Line / Arrival */}
                        <div className="flex items-center gap-2.5 sm:gap-6 w-full md:w-auto md:min-w-[280px] justify-between">
                          <div className="text-left shrink-0">
                            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight leading-none text-black">
                              {train.departure}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-black text-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                              <span>{train.fromCode}</span>
                            </div>
                          </div>

                          <div className="flex-1 flex flex-col items-center min-w-[70px] max-w-[140px] px-1 sm:px-2">
                            <div className="text-[10px] sm:text-[11px] font-black text-black mb-1 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-300 shadow-2xs">
                              {formatDuration(train.durationMins)}
                            </div>
                            <div className="w-full flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-black shrink-0" />
                              <div className="flex-1 h-[2px] rounded-full bg-black" />
                              <DestinationTrainIcon className="w-4 h-4 shrink-0 -ml-0.5 text-black" />
                            </div>
                            <div className="text-[9.5px] sm:text-[10px] font-bold text-zinc-500 mt-1">
                              {train.halts.length > 0 ? `${train.halts.length} stops` : 'Direct'}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl sm:text-2xl font-black font-mono tracking-tight leading-none text-black">
                              {train.arrival}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-black text-black uppercase tracking-wider mt-1.5 flex items-center justify-end gap-1.5 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-300 w-fit ml-auto">
                              <span>{train.toCode}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                            </div>
                          </div>
                        </div>

                        {/* Train Info */}
                        <div className="flex-1 md:border-l md:border-zinc-200 md:pl-5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-md text-yellow-400 bg-black border border-black shadow-2xs">
                              {train.number}
                            </span>
                            <span className={`text-[10.5px] font-black px-2.5 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                            <RunningDaysBadge days={train.runningDays} />
                          </div>
                          <div className="text-sm sm:text-base font-black text-black mt-1.5 truncate group-hover:underline">
                            {train.name}
                          </div>
                          {train.via && (
                            <div className="text-xs text-zinc-500 mt-0.5 truncate font-medium">
                              via <span className="font-bold text-black">{train.via}</span>
                            </div>
                          )}
                        </div>

                        {/* Subtle Click Indicator (Uncluttered) */}
                        <div className="hidden md:flex shrink-0 items-center">
                          <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Train Detail Modal */}
      {/* Train Detail Modal */}
      {selectedTrain && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedTrain(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b-2 border-black bg-black text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-yellow-400">
                    {selectedTrain.number}
                  </span>
                  <span className={`text-xs px-3 py-0.5 rounded-md font-black border border-black ${getTypeBadge(selectedTrain.type).bg} ${getTypeBadge(selectedTrain.type).text}`}>
                    {selectedTrain.type}
                  </span>
                </div>
                <h3 className="text-lg font-black mt-1 text-white tracking-tight">{selectedTrain.name}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 font-medium">
                    <RunningDaysBadge days={selectedTrain.runningDays} size="md" />
                  </span>
                  {selectedTrain.durationMins > 0 && (
                    <span className="flex items-center gap-1 font-bold text-yellow-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                      <Timer className="w-3.5 h-3.5 text-yellow-400" />
                      {formatDuration(selectedTrain.durationMins)}
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-bold text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    {selectedTrain.fromCode} → {selectedTrain.toCode}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrain(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Timeline */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black" />
                  <span>Station Halt Timeline ({selectedTrain.halts.length} Stops)</span>
                </span>
                <span className="text-[11px] font-semibold text-zinc-500">All timings in 24h format</span>
              </div>
              <div className="relative pl-7 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-black">
                {selectedTrain.halts.map((halt, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === selectedTrain.halts.length - 1;
                  const isMatch = halt.code === selectedTrain.fromCode || halt.code === selectedTrain.toCode;
                  return (
                    <div key={`${halt.code}-${idx}`} className="relative flex items-start justify-between gap-3 group">
                      <span className={`absolute -left-7 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                        isFirst ? 'bg-black border-black text-yellow-400'
                        : isLast ? 'bg-yellow-400 border-black text-black'
                        : isMatch ? 'bg-black border-black text-white'
                        : 'bg-white border-zinc-400 text-black group-hover:border-black'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0 pl-1">
                        <Link
                          href={`/station/${halt.code}`}
                          onClick={() => setSelectedTrain(null)}
                          className="font-bold hover:underline text-sm text-black transition-colors"
                        >
                          {halt.station}
                        </Link>
                        <div className="text-[11px] font-mono text-zinc-500 font-semibold">
                          Code: {halt.code} • Day {halt.day}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-black text-black">
                          {halt.arr !== 'Source' ? halt.arr : 'Origin'} →{' '}
                          {halt.dep !== 'Destination' ? halt.dep : 'Terminus'}
                        </div>
                        {halt.halt && halt.halt !== '--' && (
                          <div className="text-[10.5px] font-bold text-black bg-yellow-100 px-2 py-0.5 rounded-md border border-yellow-300 inline-block mt-0.5">
                            Halt: {halt.halt}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-black text-black">Available Classes:</span>
                {selectedTrain.classes.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-md font-bold text-[11px] border bg-zinc-100 border-zinc-300 text-black">{c}</span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-black bg-white flex items-center justify-between">
              <Link
                href={`/station/${selectedTrain.fromCode}`}
                onClick={() => setSelectedTrain(null)}
                className="text-xs font-black flex items-center gap-1.5 text-black hover:underline"
              >
                <MapPin className="w-4 h-4 text-black" />
                <span>View {selectedTrain.fromCode} Station Live Board</span>
              </Link>
              <button
                type="button"
                onClick={() => setSelectedTrain(null)}
                className="px-5 py-2 text-xs font-black rounded-xl text-black bg-yellow-400 hover:bg-yellow-300 border-2 border-black transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

interface TimetableContentProps {
  allStations: StationItem[];
}

function TimetableContent({ allStations }: TimetableContentProps) {
  const searchParams = useSearchParams();
  const urlFrom = (searchParams.get('from') || '').toUpperCase();
  const urlTo = (searchParams.get('to') || '').toUpperCase();
  const urlQ = (searchParams.get('q') || '').toLowerCase();

  const isMetroInitial =
    urlFrom.startsWith('M-') ||
    urlTo.startsWith('M-') ||
    urlQ.includes('metro') ||
    urlQ.includes('underwater');

  const [activeTab, setActiveTab] = useState<'LOCAL' | 'METRO'>(isMetroInitial ? 'METRO' : 'LOCAL');

  return (
    <div className="space-y-6 pb-12">

      {/* ── Hero Header (Clean & Uncluttered) ─────────────────────────────── */}
      <div className="space-y-2 text-center md:text-left pt-2 sm:pt-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
          West Bengal Train &amp; <span className="bg-yellow-400 px-2 rounded-lg border-2 border-black inline-block mt-1 sm:mt-0">Kolkata Metro</span> Timetables
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 max-w-xl font-medium leading-relaxed">
          Instant EMU suburban schedules, halt sequences &amp; live metro routes.
        </p>
      </div>

      {/* ── Mode Switcher Tabs (2 Clean Tabs) ─────────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl border-2 border-black max-w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('LOCAL')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'LOCAL'
              ? 'bg-black text-yellow-400 border border-black shadow-sm'
              : 'text-zinc-700 hover:text-black hover:bg-zinc-200'
          }`}
        >
          <TrainIcon className="w-4 h-4" />
          <span>Local &amp; EMU Trains</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('METRO')}
          className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'METRO'
              ? 'bg-black text-yellow-400 border border-black shadow-sm'
              : 'text-zinc-700 hover:text-black hover:bg-zinc-200'
          }`}
        >
          <MetroIcon className="w-4 h-4" />
          <span>Kolkata Metro</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ACTIVE TRANSIT SECTION
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'METRO' ? (
        <section aria-label="Kolkata Metro Section" className="space-y-4 animate-in fade-in duration-200">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-yellow-400 flex items-center justify-center border-2 border-black shrink-0">
              <MetroIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-black tracking-tight leading-tight">
                Kolkata Metro Network
              </h2>
              <p className="text-xs text-zinc-600 font-bold">Underwater Green Line, Blue Line, Orange &amp; Purple</p>
            </div>
          </div>

          {/* Metro Search Widget */}
          <SearchWidget
            allStations={allStations}
            initialFrom={{ code: 'M-HMD', name: 'Howrah Maidan', nameBn: 'হাওড়া ময়দান' }}
            initialTo={{ code: 'M-SCV', name: 'Salt Lake Sector V', nameBn: 'সল্টলেক সেক্টর ৫' }}
            accentColor="cyan"
            isMetro={true}
            popularStations={POPULAR_METRO_STATIONS}
          />
        </section>
      ) : (
        <section aria-label="Local Trains Section" className="space-y-4 animate-in fade-in duration-200">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-yellow-400 flex items-center justify-center border-2 border-black shrink-0">
              <TrainIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-black tracking-tight leading-tight">
                Suburban Local Trains &amp; EMU
              </h2>
              <p className="text-xs text-zinc-600 font-bold">Eastern Railway &amp; South Eastern Railway</p>
            </div>
          </div>

          {/* Local Trains Search Widget */}
          <SearchWidget
            allStations={allStations}
            initialFrom={{ code: 'HWH', name: 'Howrah Junction', nameBn: 'হাওড়া' }}
            initialTo={{ code: 'BWN', name: 'Barddhaman Junction', nameBn: 'বর্ধমান' }}
            accentColor="yellow"
            isMetro={false}
            popularStations={POPULAR_STATIONS}
          />
        </section>
      )}

      {/* ── SEO FAQ Section (Clean & Minimalist) ─────────────────────────── */}
      <section className="bg-white rounded-2xl border-2 border-black p-5 sm:p-7 shadow-xs space-y-4">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="text-base sm:text-lg font-black text-black tracking-tight">
            West Bengal Local Train &amp; Kolkata Metro Guide (FAQ)
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Key commuter transit information on Eastern Railway, South Eastern Railway, and Kolkata Metro services.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
            <h3 className="font-black text-sm text-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black" />
              <span>What are the Adisaptagram to Howrah daily train timings?</span>
            </h3>
            <p className="text-zinc-600 mt-1.5 leading-relaxed">
              There are <strong className="text-black">18 daily EMU local trains</strong> running from Adisaptagram (ADST) to Howrah Junction (HWH). The earliest morning commuter local departs Adisaptagram at <strong className="text-black">05:28 AM</strong>, with regular trains throughout the day until <strong className="text-black">21:37 PM</strong>.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
            <h3 className="font-black text-sm text-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black" />
              <span>How do I travel on the Kolkata Underwater Metro (Green Line)?</span>
            </h3>
            <p className="text-zinc-600 mt-1.5 leading-relaxed">
              India&apos;s first underwater metro connects <strong className="text-black">Howrah Maidan</strong> directly to <strong className="text-black">Salt Lake Sector V</strong> via Howrah Railway Station, Mahakaran, Esplanade, and Sealdah under the Hooghly River. Trains operate every 8 to 12 minutes daily.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
            <h3 className="font-black text-sm text-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black" />
              <span>Which Vande Bharat Express trains operate in West Bengal?</span>
            </h3>
            <p className="text-zinc-600 mt-1.5 leading-relaxed">
              Key routes include <strong className="text-black">Howrah - New Jalpaiguri</strong>, <strong className="text-black">Sealdah - New Jalpaiguri</strong>, <strong className="text-black">Howrah - Puri</strong>, and <strong className="text-black">Howrah - Patna</strong>.
            </p>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What are the Adisaptagram to Howrah daily train timings?', acceptedAnswer: { '@type': 'Answer', text: 'There are 18 daily EMU local trains running from Adisaptagram (ADST) to Howrah Junction (HWH), starting at 05:28 AM and running throughout the day until 21:37 PM.' } },
                { '@type': 'Question', name: 'How do I travel on the Kolkata Underwater Metro (Green Line)?', acceptedAnswer: { '@type': 'Answer', text: 'Kolkata Green Line connects Howrah Maidan to Salt Lake Sector V via the underwater Hooghly river tunnel, with trains running every 8-12 minutes.' } },
                { '@type': 'Question', name: 'Which Vande Bharat Express trains operate in West Bengal?', acceptedAnswer: { '@type': 'Answer', text: 'Major Vande Bharat routes include Howrah-NJP, Sealdah-NJP, Howrah-Puri, Howrah-Patna, Howrah-Ranchi, and NJP-Guwahati.' } },
              ],
            }),
          }}
        />
      </section>
    </div>
  );
}

// ─── Page Shell (client wrapper for Suspense) ─────────────────────────────────

interface HomePageClientProps {
  stations: StationItem[];
}

function HomePageClient({ stations }: HomePageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center flex items-center justify-center gap-2 text-xs text-zinc-500 font-bold">
          <Loader2 className="w-5 h-5 animate-spin text-black" />
          <span>Loading timetables...</span>
        </div>
      }
    >
      <TimetableContent allStations={stations} />
    </Suspense>
  );
}

export default HomePageClient;
