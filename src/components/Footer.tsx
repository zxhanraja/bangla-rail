import Link from 'next/link';
import {
  Train,
  PhoneCall,
  ShieldAlert,
  Ticket,
  ShieldCheck,
  Globe,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t-2 border-black bg-white text-zinc-600 text-xs">
      {/* ── Iconic Yellow Accent Stripe ─────────────────────────────────── */}
      <div className="h-1.5 w-full bg-yellow-400" />

      {/* ── Emergency Helpline Bar (Black & Yellow) ─────────────────────── */}
      <div className="bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-yellow-400 text-black flex items-center justify-center shrink-0">
                  <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                </span>
                <span className="text-zinc-300 font-medium">Railway Helpline:</span>
                <a href="tel:139" className="font-black text-yellow-400 tracking-wide hover:underline">139</a>
                <span className="text-zinc-400 text-[10px] font-bold bg-zinc-800 px-1.5 py-0.5 rounded">24×7 Toll-Free</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                </span>
                <span className="text-zinc-300 font-medium">RPF Police:</span>
                <span className="font-black text-white tracking-wide">182 / 1512</span>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-zinc-800 text-yellow-400 flex items-center justify-center shrink-0">
                  <Ticket className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                </span>
                <span className="text-zinc-300 font-medium">Tickets:</span>
                <span className="font-bold text-yellow-400">UTS Mobile App</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-black text-black bg-yellow-400 px-2.5 py-0.5 rounded border border-black">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" aria-hidden="true" />
              <span>667 Stations Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Directory Columns ─────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 mb-8">

          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black text-yellow-400 flex items-center justify-center p-1.5 border border-black">
                <Train className="w-4 h-4 text-yellow-400 stroke-[2.4]" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-sm font-black text-black uppercase tracking-tight leading-none">
                  Bangla Rail
                </span>
                <span className="block text-[9.5px] font-bold text-zinc-500 uppercase tracking-wider leading-tight mt-0.5">
                  banglarail.in
                </span>
              </div>
            </div>

            <p className="text-[12px] text-zinc-600 leading-relaxed">
              West Bengal commuter rail portal — covering Eastern &amp; South Eastern Railway EMU schedules, Kolkata Metro, and express trains.
            </p>

            <div className="space-y-1 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" aria-hidden="true" />
                <span>Zero Tracking &bull; Free Forever</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-black shrink-0" aria-hidden="true" />
                <span>Fast In-Memory Engine</span>
              </div>
            </div>
          </div>

          {/* Col 2: Eastern Railway */}
          <div className="space-y-2.5">
            <h2 className="text-[11px] font-black text-black uppercase tracking-wider border-b-2 border-black pb-1.5">
              Eastern Railway (Howrah)
            </h2>
            <ul className="space-y-1.5 text-[12px]">
              {[
                { label: 'Howrah → Barddhaman Main', href: '/trains-between/hwh-to-bwn' },
                { label: 'Howrah → Bandel Local', href: '/trains-between/howrah-to-bandel' },
                { label: 'Bandel → Katwa Branch', href: '/trains-between/bandel-to-katwa' },
                { label: 'Howrah Junction Board', href: '/station/hwh' },
                { label: 'Barddhaman Junction Board', href: '/station/bwn' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sealdah & Metro */}
          <div className="space-y-2.5">
            <h2 className="text-[11px] font-black text-black uppercase tracking-wider border-b-2 border-black pb-1.5">
              Sealdah &amp; Kolkata Metro
            </h2>
            <ul className="space-y-1.5 text-[12px]">
              {[
                { label: 'Underwater Green Line Metro', href: '/trains-between/m-hmd-to-m-scv' },
                { label: 'Blue Line (Dakshineswar - Kavi Subhash)', href: '/trains-between/dakshineswar-to-kavi-subhash' },
                { label: 'Sealdah → Ranaghat Local', href: '/trains-between/sealdah-to-ranaghat' },
                { label: 'Sealdah → Krishnanagar City', href: '/trains-between/sealdah-to-krishnanagar-city' },
                { label: 'Sealdah Station Timetable', href: '/station/sdah' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-2.5">
            <h2 className="text-[11px] font-black text-black uppercase tracking-wider border-b-2 border-black pb-1.5">
              Transit Tools &amp; Legal
            </h2>
            <ul className="space-y-1.5 text-[12px]">
              <li><Link href="/plan" className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">Interactive Route Planner</Link></li>
              <li><Link href="/blog" className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">Commuter Guides &amp; Blog</Link></li>
              <li><Link href="/report" className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">Report Schedule Error</Link></li>
              <li><Link href="/privacy" className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-zinc-600 hover:text-black font-medium transition-colors hover:underline">Terms of Service</Link></li>
              <li>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-black transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  <span>AI Disclosure (llms.txt)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Legal & Copyright Bar ─────────────────────────────────────── */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-zinc-500">
          <p className="font-semibold text-zinc-700">
            &copy; {new Date().getFullYear()} Bangla Rail (banglarail.in). Independent commuter transit information portal.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-zinc-400">
            <span className="text-black font-bold">Fast In-Memory</span>
            <span>&bull;</span>
            <span>Zero Tracking</span>
            <span>&bull;</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-black underline">
              Sitemap
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
