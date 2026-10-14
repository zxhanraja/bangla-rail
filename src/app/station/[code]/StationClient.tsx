'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';

interface StopItem {
  id: number;
  sequenceNo: number;
  arrivalTime: string | null;
  departureTime: string | null;
  haltMinutes: number;
  train: {
    number: string;
    name: string;
    type: string;
    originStationCode: string;
    destinationStationCode: string;
    runningDays: string;
  };
}

interface StationProps {
  station: {
    id: string;
    code: string;
    name: string;
    nameBn?: string | null;
    zone: string;
    division: string;
    district?: string | null;
    scheduleStops: StopItem[];
  };
}

export default function StationClient({ station }: StationProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStops = station.scheduleStops.filter((stop) => {
    const time = stop.departureTime || stop.arrivalTime || '00:00';
    const hour = parseInt(time.split(':')[0], 10);

    if (timeFilter === 'morning' && (hour < 4 || hour >= 12)) return false;
    if (timeFilter === 'afternoon' && (hour < 12 || hour >= 17)) return false;
    if (timeFilter === 'evening' && (hour < 17 || hour >= 21)) return false;
    if (timeFilter === 'night' && (hour >= 4 && hour < 21)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = stop.train.number.toLowerCase().includes(q);
      const matchName = stop.train.name.toLowerCase().includes(q);
      const matchDest = stop.train.destinationStationCode.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchDest) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search train name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-medium"
            />
          </div>

          {/* Time Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
            {(['all', 'morning', 'afternoon', 'evening', 'night'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                  timeFilter === t
                    ? 'bg-[#111111] text-white'
                    : 'bg-[#F7F5EE] text-[#71717A] hover:text-[#111111]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stops Table / List */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-xs overflow-hidden">
        {filteredStops.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A]">
            No trains matching the selected filters.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EAE6DC] text-[11px] font-bold text-[#71717A] uppercase tracking-wider bg-white">
                    <th className="py-3.5 px-6">TRAIN</th>
                    <th className="py-3.5 px-6">DESTINATION</th>
                    <th className="py-3.5 px-6">ARR / DEP</th>
                    <th className="py-3.5 px-6">HALT</th>
                    <th className="py-3.5 px-6 text-right">DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DC]">
                  {filteredStops.map((stop) => (
                    <tr key={stop.id} className="hover:bg-[#FBF9F4] transition-colors">
                      <td className="py-4 px-6">
                        <div className="text-[15px] font-bold text-[#111111]">{stop.train.number}</div>
                        <div className="text-xs text-[#71717A] font-medium mt-0.5">{stop.train.name}</div>
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F5EE] border border-[#E7E2D8] mt-1 text-[#555555]">
                          {stop.train.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-sm text-[#111111]">
                        To: {stop.train.destinationStationCode}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-[#111111]">
                          {stop.departureTime || stop.arrivalTime || '--'}
                        </div>
                        <div className="text-[11px] text-[#71717A] mt-0.5">Arr: {stop.arrivalTime || 'Origin'}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#71717A] font-medium">
                        {stop.haltMinutes > 0 ? `${stop.haltMinutes} min` : 'Origin/Dest'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/train/${stop.train.number}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F7F5EE] hover:bg-[#111111] hover:text-white text-xs font-semibold transition-colors"
                        >
                          Route
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Compact List View */}
            <div className="md:hidden divide-y divide-[#EAE6DC]">
              {filteredStops.map((stop) => (
                <div key={stop.id} className="p-4 hover:bg-[#FAF8F3] transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[15px] font-bold text-[#111111]">{stop.train.number}</div>
                      <div className="text-xs text-[#71717A] font-medium">{stop.train.name}</div>
                      <div className="text-xs font-semibold text-[#111111] mt-1">
                        ➔ {stop.train.destinationStationCode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#111111]">
                        {stop.departureTime || stop.arrivalTime || '--'}
                      </div>
                      <div className="text-[10.5px] text-[#71717A] mt-0.5">
                        Halt: {stop.haltMinutes > 0 ? `${stop.haltMinutes}m` : '--'}
                      </div>
                      <Link
                        href={`/train/${stop.train.number}`}
                        className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#111111] mt-2 underline"
                      >
                        View Full Route
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
