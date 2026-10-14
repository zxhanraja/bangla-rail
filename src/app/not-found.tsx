import Link from 'next/link';
import { Train, Search, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';

// Note: not-found.tsx does not support metadata export directly.
// SEO is handled by Next.js automatically with noindex for 404.

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Icon & Train graphic */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-[#18181B] flex items-center justify-center shadow-xl mx-auto">
            <Train className="w-12 h-12 text-white" />
          </div>
          {/* Badge */}
          <div className="absolute -top-2 -right-2 sm:right-[calc(50%-64px)] w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
            <AlertTriangle className="w-4 h-4 text-amber-900" />
          </div>
        </div>

        {/* Error text */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#71717A]">
            Platform Not Found · Error 404
          </p>
          <h1 className="text-[32px] sm:text-[42px] font-extrabold text-[#111111] tracking-tight leading-tight">
            Train Missed!
          </h1>
          {/* Bengali */}
          <p className="text-lg font-semibold text-[#52525B]">
            স্টেশন বা রুট খুঁজে পাওয়া যায়নি
          </p>
          <p className="text-sm text-[#71717A] leading-relaxed max-w-sm mx-auto">
            The page you are looking for doesn't exist, was moved, or the URL may have a typo. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            id="not-found-home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-white text-sm font-bold rounded-xl hover:bg-neutral-800 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Train Search
          </Link>
          <Link
            href="/plan"
            id="not-found-planner"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E8E3D7] text-[#18181B] text-sm font-bold rounded-xl hover:bg-[#F7F5EE] hover:border-neutral-400 active:scale-95 transition-all w-full sm:w-auto justify-center"
          >
            <MapPin className="w-4 h-4" />
            Route Planner
          </Link>
        </div>

        {/* Popular Routes */}
        <div className="pt-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
            Popular Routes
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Howrah → Barddhaman', href: '/trains-between/hwh-to-bwn' },
              { label: 'Sealdah → Ranaghat', href: '/trains-between/sealdah-to-ranaghat' },
              { label: '🌊 Underwater Metro', href: '/trains-between/m-hmd-to-m-scv' },
              { label: 'Howrah → Digha', href: '/trains-between/hwh-to-dgha' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8E3D7] text-[11.5px] font-semibold text-[#444] hover:text-black hover:border-neutral-400 hover:shadow-sm transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
