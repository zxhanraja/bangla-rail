'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Train, Route, ShieldCheck, AlertCircle, Sparkles, BookOpen, Info, Mail } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim();

    // 1. Check for "From to To" pattern (e.g. "Adisaptagram to Howrah", "ADST to HWH", "Adisaptagram - Howrah")
    const routeRegex = /^(.*?)(?:\s+(?:to|-|->|–|➔)\s+|\s+to\s+)(.*)$/i;
    const routeMatch = query.match(routeRegex);

    if (routeMatch && routeMatch[1].trim() && routeMatch[2].trim()) {
      const from = routeMatch[1].trim();
      const to = routeMatch[2].trim();
      router.push(`/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    } else if (/^\d{4,5}$/.test(query)) {
      // 2. Check if query is a train number
      router.push(`/train/${query}`);
    } else {
      // 3. Search query
      router.push(`/?from=${encodeURIComponent(query)}&to=Howrah`);
    }
    setMobileSearchOpen(false);
  };


  return (
    <header className="w-full bg-[#F7F5EE] border-b border-[#E8E3D7] sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-[72px]">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* Eastern Railway Circular Emblem */}
            <div className="w-10 h-10 rounded-full bg-[#202022] text-[#F7F5EE] flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                {/* Outer Ring */}
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Inner Crest / Star & Train */}
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
                <path d="M35 52 L65 52 L61 68 L39 68 Z" fill="currentColor" opacity="0.9" />
                <circle cx="43" cy="62" r="3" fill="#202022" />
                <circle cx="57" cy="62" r="3" fill="#202022" />
                <path d="M41 40 L59 40 L56 50 L44 50 Z" fill="currentColor" />
                <path d="M47 33 L53 33 L52 38 L48 38 Z" fill="currentColor" />
                {/* Side Stars */}
                <polygon points="50,15 52,21 58,21 53,24 55,30 50,26 45,30 47,24 42,21 48,21" fill="currentColor" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold tracking-[0.04em] text-[#111111] uppercase leading-tight font-sans">
                BANGLA RAIL
              </span>
              <span className="text-[9px] font-semibold tracking-[0.08em] text-[#71717A] uppercase leading-tight mt-0.5">
                WEST BENGAL RAILWAY & METRO NETWORK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-neutral-700">
            <Link href="/" className="hover:text-black transition-colors font-semibold">
              Timetable
            </Link>
            <Link href="/plan" className="hover:text-black transition-colors">
              Route Planner
            </Link>
            <Link href="/blog" className="hover:text-black transition-colors flex items-center gap-1">
              <span>Guides & Blogs</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">NEW</span>
            </Link>
            <Link href="/about" className="hover:text-black transition-colors">
              About
            </Link>
            <Link href="/report" className="hover:text-black transition-colors text-neutral-500">
              Report Issue
            </Link>
          </nav>

          {/* Desktop Search Input */}
          <form onSubmit={handleSearch} className="relative w-64 lg:w-72">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 pointer-events-none stroke-[2]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train or station..."
                className="w-full h-10 pl-10 pr-3.5 text-[13px] bg-white text-[#111111] placeholder-[#8E8E93] rounded-lg border border-[#DED9CD] focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] transition-all shadow-xs"
              />
            </div>
          </form>
        </div>

        {/* Mobile Header (Exact match to small screens) */}
        <div className="flex md:hidden items-center justify-between h-14">
          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 -ml-1.5 text-[#111111] hover:text-black focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
          </button>

          {/* Center Brand Title */}
          <Link href="/" className="text-[15px] font-extrabold tracking-[0.03em] text-[#111111] uppercase">
            BANGLA RAIL
          </Link>

          {/* Right Search Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-1.5 -mr-1.5 text-[#111111] hover:text-black focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train name, number, or station..."
                className="w-full h-10 pl-10 pr-10 text-[13px] bg-white text-[#111111] placeholder-[#8E8E93] rounded-lg border border-[#DED9CD] focus:outline-none focus:border-[#111111]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Drawer */}
          <div className="relative w-4/5 max-w-xs bg-[#F7F5EE] h-full shadow-2xl flex flex-col p-5 border-r border-[#E8E3D7] z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D7]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#202022] text-[#F7F5EE] flex items-center justify-center p-1">
                  <Train className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Bangla Rail
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-[#71717A] hover:text-[#111111]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#111111] hover:bg-[#EDE9DE] transition-colors"
              >
                <Train className="w-4 h-4 text-neutral-600" />
                Train Timetable
              </Link>
              <Link
                href="/plan"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#444444] hover:bg-[#EDE9DE] hover:text-[#111111] transition-colors"
              >
                <Route className="w-4 h-4 text-neutral-500" />
                Route Planner
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#444444] hover:bg-[#EDE9DE] hover:text-[#111111] transition-colors"
              >
                <BookOpen className="w-4 h-4 text-neutral-500" />
                Guides & Blogs
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#444444] hover:bg-[#EDE9DE] hover:text-[#111111] transition-colors"
              >
                <Info className="w-4 h-4 text-neutral-500" />
                About Us
              </Link>
              <Link
                href="/report"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#444444] hover:bg-[#EDE9DE] hover:text-[#111111] transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-neutral-500" />
                Report Timetable Issue
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#444444] hover:bg-[#EDE9DE] hover:text-[#111111] transition-colors"
              >
                <Mail className="w-4 h-4 text-neutral-500" />
                Contact Support
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#444444] hover:bg-[#EDE9DE] hover:text-[#111111] transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-neutral-500" />
                Official Admin Portal
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#E8E3D7] text-[11px] text-[#71717A] space-y-1">
              <p className="font-semibold text-neutral-800">West Bengal Rail & Metro Network</p>
              <p>Howrah • Sealdah • Metro • Kharagpur</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

