import Link from 'next/link';
import {
  Clock,
  ShieldCheck,
  MapPin,
  Train,
  PhoneCall,
  ShieldAlert,
  Ticket,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Zap,
  Globe,
  AlertCircle,
} from 'lucide-react';

const QUICK_ROUTES = [
  { label: 'Howrah → Barddhaman', slug: 'hwh-to-bwn' },
  { label: 'Sealdah → Ranaghat', slug: 'sdah-to-rha' },
  { label: 'Howrah → Bandel', slug: 'howrah-to-bandel' },
  { label: '🌊 Underwater Metro', slug: 'm-hmd-to-m-scv' },
  { label: 'Sealdah → Diamond Harbour', slug: 'sealdah-to-diamond-harbour' },
  { label: 'Howrah → Digha', slug: 'hwh-to-dgha' },
];

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-[#E8E3D7] bg-[#F7F5EE] text-[#71717A] text-xs">

      {/* ── Tier 1: Emergency Helpline Bar ───────────────────────────────── */}
      <div className="bg-[#1A1A1E] text-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-3 h-3" />
                </span>
                <span className="text-white/60">Railway Helpline:</span>
                <span className="font-bold text-white tracking-wide">139</span>
                <span className="text-white/40 text-[10px]">24×7 Toll-Free</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-3 h-3" />
                </span>
                <span className="text-white/60">RPF / GRP Police:</span>
                <span className="font-bold text-white tracking-wide">182 / 1512</span>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Ticket className="w-3 h-3" />
                </span>
                <span className="text-white/60">Paperless Tickets:</span>
                <span className="font-semibold text-white">UTS Mobile App</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All 556 Stations Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 2: Stats Trust Bar ───────────────────────────────────────── */}
      <div className="border-b border-[#E8E3D7] bg-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '556+', label: 'WB Stations Indexed', icon: MapPin },
              { value: '141', label: 'Train Services', icon: Train },
              { value: '1,546', label: 'Halt Schedules', icon: Clock },
              { value: 'Edge CDN', label: 'Zero-Lag Delivery', icon: Zap },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#555]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#111111] leading-tight">{value}</div>
                  <div className="text-[10px] text-neutral-500 leading-tight">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tier 3: Main Directory Columns ───────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 sm:gap-x-8 gap-y-8 mb-10">

          {/* Col 1: Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#18181B] text-[#F7F5EE] flex items-center justify-center shadow-sm">
                <Train className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-sm font-black text-[#111111] uppercase tracking-wider leading-tight">
                  Bangla Rail
                </span>
                <span className="block text-[9px] text-neutral-400 uppercase tracking-widest leading-tight">
                  banglarail.in
                </span>
              </div>
            </div>

            <p className="text-[11.5px] text-[#666] leading-relaxed">
              West Bengal&apos;s dedicated commuter railway portal — covering all Eastern & South Eastern Railway suburban services and all Kolkata Metro lines.
            </p>

            <div className="space-y-1.5 text-[11px] text-[#555]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>SSL Encrypted · Zero User Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Served via Global Edge CDN</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>24-Hour Railway Time Format</span>
              </div>
            </div>
          </div>

          {/* Col 2: Eastern Railway */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#111111] uppercase tracking-widest border-b border-[#E8E3D7] pb-2">
              Eastern Rly (Howrah)
            </h4>
            <ul className="space-y-2 text-[11.5px]">
              {[
                { label: 'Howrah → Barddhaman Main', href: '/trains-between/hwh-to-bwn' },
                { label: 'Howrah → Bandel Local', href: '/trains-between/howrah-to-bandel' },
                { label: 'Bandel → Katwa Branch', href: '/trains-between/bandel-to-katwa' },
                { label: 'Howrah Jn (HWH) Board', href: '/station/hwh' },
                { label: 'Barddhaman (BWN) Board', href: '/station/bwn' },
                { label: 'Bandel Jn (BDC) Board', href: '/station/bdc' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Sealdah & South Eastern */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#111111] uppercase tracking-widest border-b border-[#E8E3D7] pb-2">
              Sealdah & South Eastern
            </h4>
            <ul className="space-y-2 text-[11.5px]">
              {[
                { label: 'Sealdah → Ranaghat Local', href: '/trains-between/sealdah-to-ranaghat' },
                { label: 'Sealdah → Krishnanagar City', href: '/trains-between/sealdah-to-krishnanagar-city' },
                { label: 'Sealdah → Canning (Sundarbans)', href: '/trains-between/sealdah-to-canning' },
                { label: 'Sealdah → Diamond Harbour', href: '/trains-between/sealdah-to-diamond-harbour' },
                { label: 'Howrah → Kharagpur (SER)', href: '/trains-between/howrah-to-kharagpur' },
                { label: 'Sealdah (SDAH) Timetable', href: '/station/sdah' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Metro & Express */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#111111] uppercase tracking-widest border-b border-[#E8E3D7] pb-2">
              Kolkata Metro & Express
            </h4>
            <ul className="space-y-2 text-[11.5px]">
              {[
                { label: '🌊 Underwater Metro (Green Line)', href: '/trains-between/m-hmd-to-m-scv', highlight: true },
                { label: 'North-South Blue Line Metro', href: '/trains-between/dakshineswar-to-kavi-subhash' },
                { label: 'Purple Line (Joka Metro)', href: '/trains-between/joka-to-majerhat' },
                { label: 'Howrah → Digha Coastal', href: '/trains-between/hwh-to-dgha' },
                { label: 'Howrah → NJP Vande Bharat', href: '/trains-between/hwh-to-njp' },
                { label: 'Sealdah → NJP Vande Bharat', href: '/trains-between/sealdah-to-new-jalpaiguri' },
              ].map(({ label, href, highlight }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2 ${highlight ? 'text-emerald-700 font-semibold' : 'text-[#666]'}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Resources */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#111111] uppercase tracking-widest border-b border-[#E8E3D7] pb-2">
              Resources
            </h4>
            <ul className="space-y-2 text-[11.5px]">
              <li>
                <Link href="/blog" className="text-neutral-900 font-semibold hover:text-black transition-colors flex items-center gap-1">
                  <span>Commuter Guides & Blogs</span>
                  <Sparkles className="w-3 h-3 text-amber-600" />
                </Link>
              </li>
              <li><Link href="/plan" className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">Interactive Route Planner</Link></li>
              <li><Link href="/report" className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">Report a Schedule Error</Link></li>
              <li><Link href="/about" className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">About Bangla Rail</Link></li>
              <li><Link href="/contact" className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">Passenger Support</Link></li>
              <li><Link href="/privacy" className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#666] hover:text-[#111] transition-colors hover:underline decoration-dotted underline-offset-2">Terms of Service</Link></li>
              <li>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  <span>AI Disclosure (llms.txt)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Quick Route Shortcuts ─────────────────────────────────────── */}
        <div className="py-5 border-t border-b border-[#E8E3D7]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 shrink-0 mr-1">
              Quick Routes:
            </span>
            {QUICK_ROUTES.map(({ label, slug }) => (
              <Link
                key={slug}
                href={`/trains-between/${slug}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#E0DBD0] text-[11px] font-medium text-[#444] hover:text-black hover:border-neutral-400 hover:shadow-sm transition-all"
              >
                {label}
                <ChevronRight className="w-3 h-3 text-neutral-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Legal Bar ─────────────────────────────────────────────────── */}
        <div className="pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#71717A]">
          <div className="space-y-1">
            <p className="font-semibold text-neutral-800">
              © {new Date().getFullYear()} Bangla Rail (banglarail.in). Built for West Bengal rail commuters.
            </p>
            <p className="text-[10px] text-neutral-400 max-w-2xl leading-relaxed">
              Bangla Rail is an independent transit information portal and is not affiliated with the Ministry of Railways, Eastern Railway, South Eastern Railway, or Metro Railway Kolkata. Timetables are sourced from publicly published railway working timetables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400 shrink-0">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Fast Edge Cache
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Zero Tracking
            </span>
            <span className="text-neutral-300">•</span>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors underline underline-offset-2">
              XML Sitemap
            </a>
            <span className="text-neutral-300">•</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors underline underline-offset-2">
              Robots.txt
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
