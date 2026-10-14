'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Train as TrainIcon, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  MapPin, 
  Share2, 
  Check, 
  Sparkles, 
  Timer,
  Layers,
  ArrowRight
} from 'lucide-react';

// ─── Running Days Badge ────────────────────────────────────────────────────
function parseRunningDays(days: string): boolean[] {
  if (!days) return Array(7).fill(true);
  const d = days.trim().toLowerCase();
  if (d === 'daily') return Array(7).fill(true);
  const exceptMatch = d.match(/(?:daily\s+)?except\s+(.+)/);
  if (exceptMatch) {
    const result = Array(7).fill(true);
    const excluded = exceptMatch[1].split(/[,/&\s]+/).map((s) => s.trim());
    const dayMap: Record<string, number> = { mon:0, tue:1, wed:2, thu:3, fri:4, sat:5, sun:6 };
    excluded.forEach((ex) => { const k = ex.slice(0,3).toLowerCase(); if (k in dayMap) result[dayMap[k]] = false; });
    return result;
  }
  const parts = d.split(/[,/&\s]+/).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 0) {
    const result = Array(7).fill(false);
    const dayMap: Record<string, number> = { mon:0, tue:1, wed:2, thu:3, fri:4, sat:5, sun:6 };
    parts.forEach((p) => { const k = p.slice(0,3).toLowerCase(); if (k in dayMap) result[dayMap[k]] = true; });
    if (result.every((v) => !v)) return Array(7).fill(true);
    return result;
  }
  return Array(7).fill(true);
}

const DAY_LABELS_TB = ['M','T','W','T','F','S','S'] as const;
const DAY_FULL_TB   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

function RunningDaysBadge({ days }: { days: string }) {
  const active = parseRunningDays(days);
  const isAllDaily = active.every(Boolean);
  return (
    <span
      className="inline-flex items-center gap-1.5 p-1 rounded-lg bg-zinc-100 border border-zinc-200 select-none shadow-2xs"
      title={days || 'Daily'}
      aria-label={`Runs on: ${active.map((a, i) => a ? DAY_FULL_TB[i] : '').filter(Boolean).join(', ') || 'Daily'}`}
    >
      <span className="flex items-center gap-0.5">
        {DAY_LABELS_TB.map((label, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`inline-flex items-center justify-center w-4 h-4 rounded text-[9.5px] font-black font-mono select-none transition-all ${
              active[i] 
                ? 'bg-black text-yellow-400 shadow-2xs' 
                : 'text-zinc-400 bg-white/80 border border-zinc-200 opacity-20'
            }`}
          >
            {label}
          </span>
        ))}
      </span>
      {isAllDaily && <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-black text-yellow-400">Daily</span>}
    </span>
  );
}

interface Halt {
  station: string;
  stationBn?: string | null;
  code: string;
  arr: string;
  dep: string;
  halt: string;
  seq: number;
  isCurrentFrom: boolean;
  isCurrentTo: boolean;
}

interface TrainItem {
  id: string;
  number: string;
  name: string;
  type: string;
  originStationCode: string;
  destinationStationCode: string;
  runningDays: string;
  distanceKm: number;
  departure: string;
  arrival: string;
  durationMins: number;
  intermediateCount: number;
  halts: Halt[];
}

interface Props {
  fromStation: {
    id: string;
    code: string;
    name: string;
    nameBn?: string | null;
    zone: string;
    division: string;
    district?: string | null;
  };
  toStation: {
    id: string;
    code: string;
    name: string;
    nameBn?: string | null;
    zone: string;
    division: string;
    district?: string | null;
  };
  trains: TrainItem[];
}

function getTypeBadge(type: string): { bg: string; text: string } {
  const t = type.toLowerCase();
  if (t.includes('vande')) {
    return { bg: 'bg-yellow-400 border-black', text: 'text-black' };
  }
  if (t.includes('shatabdi') || t.includes('rajdhani') || t.includes('duronto')) {
    return { bg: 'bg-black border-yellow-400', text: 'text-yellow-400' };
  }
  if (t.includes('superfast') || t.includes('express') || t.includes('mail')) {
    return { bg: 'bg-zinc-800 border-zinc-700', text: 'text-zinc-100' };
  }
  return { bg: 'bg-zinc-100 border-zinc-300', text: 'text-zinc-900' };
}

function formatDuration(mins: number): string {
  if (!mins) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
}

export default function TrainsBetweenClient({ fromStation, toStation, trains }: Props) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'local' | 'express'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [nowMins, setNowMins] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNowMins(now.getHours() * 60 + now.getMinutes());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter trains
  const filteredTrains = trains.filter(t => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = t.name.toLowerCase().includes(q) || t.number.includes(q) || t.type.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Type filter
    if (typeFilter === 'local' && !t.type.toLowerCase().includes('local') && !t.type.toLowerCase().includes('emu')) {
      return false;
    }
    if (typeFilter === 'express' && (t.type.toLowerCase().includes('local') || t.type.toLowerCase().includes('emu'))) {
      return false;
    }

    // Time filter
    if (timeFilter !== 'all') {
      const [h] = t.departure.split(':').map(Number);
      if (timeFilter === 'morning' && (h < 4 || h >= 12)) return false;
      if (timeFilter === 'afternoon' && (h < 12 || h >= 17)) return false;
      if (timeFilter === 'evening' && (h < 17 || h >= 21)) return false;
      if (timeFilter === 'night' && (h >= 4 && h < 21)) return false;
    }

    return true;
  });

  // Next train calculation
  const nextTrain = trains.find(t => {
    const [h, m] = t.departure.split(':').map(Number);
    const depMins = h * 60 + m;
    return depMins >= nowMins;
  }) || trains[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Next Train Banner */}
      {nextTrain && (
        <div className="bg-gradient-to-r from-emerald-900 to-neutral-900 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Next Train from {fromStation.name}
            </div>
            <div className="text-lg sm:text-xl font-bold">
              {nextTrain.name} <span className="text-emerald-300 font-mono">({nextTrain.number})</span>
            </div>
            <div className="text-xs text-neutral-300 flex items-center gap-3">
              <span>Departs at: <strong className="text-white font-mono text-sm">{nextTrain.departure}</strong></span>
              <span>•</span>
              <span>Arrives {toStation.name}: <strong className="text-white font-mono text-sm">{nextTrain.arrival}</strong></span>
              <span>•</span>
              <span>Duration: <strong className="text-emerald-300">{formatDuration(nextTrain.durationMins)}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Timetable'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E2D8] shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={`Search by train name, number (e.g. 37812, Fast Local, Shatabdi)...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F3] border border-[#E0DBD0] rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-neutral-100 text-xs">
          {/* Time Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-neutral-500 font-medium mr-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time:
            </span>
            {[
              { id: 'all', label: 'All Day' },
              { id: 'morning', label: 'Morning (4am - 12pm)' },
              { id: 'afternoon', label: 'Afternoon (12pm - 5pm)' },
              { id: 'evening', label: 'Evening (5pm - 9pm)' },
              { id: 'night', label: 'Night (9pm - 4am)' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  timeFilter === t.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-[#FAF8F3] text-neutral-600 hover:bg-[#F0EBE1] border border-[#E5E0D5]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Train Type Tabs */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Types' },
              { id: 'local', label: 'EMU Locals' },
              { id: 'express', label: 'Express / Mails' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTypeFilter(t.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  typeFilter === t.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-[#FAF8F3] text-neutral-600 hover:bg-[#F0EBE1] border border-[#E5E0D5]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Train Count Banner */}
      <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
        <div>
          Showing <strong>{filteredTrains.length}</strong> of <strong>{trains.length}</strong> trains from {fromStation.name} to {toStation.name}
        </div>
        <div className="text-[11px] text-neutral-500">
          Times formatted in 24-hour IST (Indian Standard Time)
        </div>
      </div>

      {/* Timetable List Cards */}
      <div className="space-y-3">
        {filteredTrains.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#E7E2D8] space-y-3">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-neutral-900">No Trains Found for this Filter</div>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              No trains match your current filter criteria. Try resetting the time or type filters.
            </p>
            <button
              onClick={() => { setTimeFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTrains.map((t) => {
            const badge = getTypeBadge(t.type);
            const isExpanded = expandedTrain === t.id;

            return (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-[#E7E2D8] hover:border-neutral-400 transition shadow-xs overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Train Info */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-900">
                          {t.number}
                        </span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text}`}>
                          {t.type}
                        </span>
                        <RunningDaysBadge days={t.runningDays} />
                      </div>

                      <h3 className="text-base sm:text-lg font-extrabold text-neutral-900">
                        {t.name}
                      </h3>

                      <div className="text-xs text-neutral-500 flex items-center gap-2">
                        <span>Origin: <strong>{t.originStationCode}</strong></span>
                        <span>➔</span>
                        <span>Destination: <strong>{t.destinationStationCode}</strong></span>
                      </div>
                    </div>

                    {/* Schedule Timings */}
                    <div className="flex items-center gap-6 sm:gap-8 bg-[#FAF8F3] p-3.5 sm:px-6 rounded-xl border border-[#EBE6DC] shrink-0">
                      {/* Departure */}
                      <div className="text-left">
                        <div className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Departure</div>
                        <div className="text-xl sm:text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                          {t.departure}
                        </div>
                        <div className="text-[11px] text-neutral-600 font-medium truncate max-w-[90px]">
                          {fromStation.code}
                        </div>
                      </div>

                      {/* Duration & Arrow */}
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="text-[10px] text-neutral-500 font-bold mb-0.5">
                          {formatDuration(t.durationMins)}
                        </div>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <div className="w-5 sm:w-8 h-[1.5px] bg-neutral-300"></div>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-700" />
                        </div>
                        <div className="text-[9px] text-neutral-500 mt-0.5 font-medium">
                          {t.intermediateCount} Stops
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="text-right">
                        <div className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Arrival</div>
                        <div className="text-xl sm:text-2xl font-extrabold font-mono text-neutral-900 mt-0.5">
                          {t.arrival}
                        </div>
                        <div className="text-[11px] text-neutral-600 font-medium truncate max-w-[90px]">
                          {toStation.code}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Stops Toggle */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100 text-xs">
                    <button
                      onClick={() => setExpandedTrain(isExpanded ? null : t.id)}
                      className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 font-bold transition"
                    >
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{isExpanded ? 'Hide Full Schedule & Stops' : `View All ${t.halts.length} Route Halts`}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/station/${fromStation.code.toLowerCase()}`}
                        className="text-[11px] text-neutral-500 hover:text-neutral-900 underline"
                      >
                        {fromStation.code} Boarding Info
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Expanded Route Halts Accordion */}
                {isExpanded && (
                  <div className="bg-[#FAF8F3] border-t border-[#E7E2D8] p-4 sm:p-6">
                    <div className="text-xs font-bold text-neutral-900 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      Complete Halts for {t.name} ({t.number})
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-300 text-neutral-500 font-medium text-[11px]">
                            <th className="pb-2">#</th>
                            <th className="pb-2">Station Name</th>
                            <th className="pb-2">Code</th>
                            <th className="pb-2">Arrival</th>
                            <th className="pb-2">Departure</th>
                            <th className="pb-2">Halt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                          {t.halts.map((h, i) => {
                            const isCurrent = h.isCurrentFrom || h.isCurrentTo;
                            return (
                              <tr
                                key={i}
                                className={`transition ${
                                  isCurrent ? 'bg-emerald-100/60 font-bold text-emerald-950' : 'text-neutral-700 hover:bg-neutral-100/60'
                                }`}
                              >
                                <td className="py-2 font-mono text-[11px] text-neutral-500">{h.seq}</td>
                                <td className="py-2 flex items-center gap-1.5">
                                  <span>{h.station}</span>
                                  {h.stationBn && <span className="text-[11px] text-neutral-500 font-serif">({h.stationBn})</span>}
                                  {h.isCurrentFrom && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-bold">
                                      Boarding
                                    </span>
                                  )}
                                  {h.isCurrentTo && (
                                    <span className="px-1.5 py-0.2 rounded bg-neutral-900 text-white text-[9px] font-bold">
                                      Destination
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 font-mono font-bold">{h.code}</td>
                                <td className="py-2 font-mono">{h.arr}</td>
                                <td className="py-2 font-mono">{h.dep}</td>
                                <td className="py-2">{h.halt}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
