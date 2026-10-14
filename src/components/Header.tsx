'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Train,
  Route,
  Compass,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();

    const routeRegex = /^(.*?)(?:\s+(?:to|-|->|–|➔)\s+|\s+to\s+)(.*)$/i;
    const routeMatch = query.match(routeRegex);

    if (routeMatch && routeMatch[1].trim() && routeMatch[2].trim()) {
      const from = routeMatch[1].trim();
      const to = routeMatch[2].trim();
      router.push(`/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    } else if (/^\d{4,5}$/.test(query)) {
      router.push(`/train/${query}`);
    } else {
      router.push(`/?from=${encodeURIComponent(query)}&to=Howrah`);
    }
    setMobileSearchOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Timetable', icon: Train },
    { href: '/trains-between/m-hmd-to-m-scv', label: 'Metro Lines', icon: Compass },
    { href: '/plan', label: 'Route Planner', icon: Route },
  ];

  return (
    <header className="w-full bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        {/* ── Desktop & Mobile Header Bar ──────────────────────────────── */}
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Brand Logo */}
          <Link
            href="/"
            aria-label="Bangla Rail Home"
            className="flex items-center gap-2.5 select-none"
          >
            {/* Iconic Black & Yellow Emblem */}
            <div className="w-9 h-9 rounded-xl bg-black text-yellow-400 flex items-center justify-center p-2 shadow-xs transition-transform active:scale-95">
              <Train className="w-5 h-5 text-yellow-400 stroke-[2.4]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-black uppercase leading-none">
                  Bangla Rail
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-400 text-black text-[9.5px] font-black border border-black">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
                West Bengal Transit
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Desktop navigation">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-black text-yellow-400'
                      : 'text-zinc-700 hover:text-black hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Quick Search on Desktop & Mobile Action */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden sm:block relative w-56 lg:w-64">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search train or station..."
                  className="w-full h-9 pl-8 pr-3 text-xs bg-zinc-100 hover:bg-zinc-50 text-black placeholder-zinc-400 rounded-xl border border-zinc-300 focus:outline-none focus:border-black focus:bg-white focus:ring-2 focus:ring-yellow-400/50 transition-all font-semibold"
                />
              </div>
            </form>

            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="sm:hidden p-2 text-black hover:bg-zinc-100 rounded-xl focus:outline-none"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black hover:bg-zinc-100 rounded-xl focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.2]" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Dropdown */}
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 pt-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train name or number..."
                className="w-full h-10 pl-10 pr-10 text-xs bg-zinc-100 text-black placeholder-zinc-400 rounded-xl border-2 border-black focus:outline-none focus:bg-white font-bold"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown (Clean & Uncluttered) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 py-3 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-black transition-colors ${
                  isActive
                    ? 'bg-black text-yellow-400'
                    : 'text-black hover:bg-yellow-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
