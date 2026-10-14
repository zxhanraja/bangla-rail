import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, Scale, BookOpen, Ban, ArrowLeft, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Bangla Rail',
  description: 'Terms and Conditions, non-affiliation notice, and user guidelines for Bangla Rail West Bengal train timetables and transit portal.',
  alternates: {
    canonical: 'https://banglarail.in/terms',
  },
  openGraph: {
    title: 'Terms of Service | Bangla Rail',
    description: 'Terms of Service, railway non-affiliation disclaimer, and commuter guidelines for Bangla Rail.',
    url: 'https://banglarail.in/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs & Return */}
      <div className="flex items-center gap-2 text-xs text-[#52525B]">
        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Timetables</span>
        </Link>
        <span>/</span>
        <span className="text-[#18181B] font-semibold">Terms of Service</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-[#E8E3D7] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Important Legal & Passenger Notice</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B]">
          Effective Date: <strong>March 2026</strong> · Last Updated: <strong>September 2026</strong>
        </p>

        <p className="text-sm sm:text-base text-[#3F3F46] leading-relaxed pt-2">
          By accessing, browsing, or utilizing <strong>Bangla Rail</strong> (<a href="https://banglarail.in" className="text-black underline underline-offset-2 font-medium">banglarail.in</a>), you acknowledge that you have read, understood, and agreed to be bound by the following terms, conditions, and disclaimers.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Section 1: Non-Affiliation */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">1. Indian Railways Non-Affiliation Disclaimer</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            <strong>Bangla Rail is an independent commuter utility application.</strong> It is <strong>NOT</strong> an official agency, subsidiary, or partner of the <strong>Ministry of Railways, Indian Railways (IR), Eastern Railway (ER), South Eastern Railway (SER), IRCTC, CRIS</strong>, or <strong>Metro Railway Kolkata (Kolkata Metro Rail Corporation)</strong>.
          </p>
          <p className="text-xs sm:text-sm text-[#52525B]">
            All railway marks, train names, logos, and emblems remain the intellectual property of their respective statutory owners. Use of these names on Bangla Rail is solely for nominative and navigational identification purposes.
          </p>
        </section>

        {/* Section 2: Timetable Accuracy */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">2. Information Accuracy & Operational Changes</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            Train schedules, halt sequences, platforms, and frequencies displayed on Bangla Rail are aggregated from publicly available railway working timetables, passenger notifications, and commuter inputs. While we endeavor to maintain utmost accuracy:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#3F3F46] pl-2">
            <li>Railway authorities may reschedule, short-terminate, reroute, or cancel services due to emergency maintenance (megablocks), weather conditions, or operational imperatives without prior warning.</li>
            <li>Platform assignments are dynamic and subject to stationmaster announcements at individual stations.</li>
            <li>Passengers are strongly encouraged to verify real-time platform displays and use official helplines (<strong>RailMadad 139</strong>) during emergencies.</li>
          </ul>
        </section>

        {/* Section 3: Limitation of Liability */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">3. Limitation of Liability</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            Under no circumstances shall Bangla Rail, its developers, or contributors be held liable for any direct, indirect, incidental, consequential, or punitive damages—including but not limited to missed departures, missed flights, loss of time, loss of business revenue, or ticket cancellation penalties—arising from the use or inability to use this timetable portal.
          </p>
        </section>

        {/* Section 4: Acceptable Use */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Ban className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">4. Acceptable Use & Anti-Scraping Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            Bangla Rail is provided free of charge for individual personal transit planning. You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#3F3F46] pl-2">
            <li>Execute automated scrapers, high-frequency bot requests, or denial-of-service attempts against our API endpoints.</li>
            <li>Submit fraudulent or misleading schedule alteration reports via our reporting portal.</li>
            <li>Attempt to bypass rate limits, firewall protections, or HSTS security headers.</li>
          </ul>
        </section>

        {/* Section 5: Governing Law */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">5. Governing Law & Jurisdiction</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            These Terms of Service are governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or proceeding arising out of or related to Bangla Rail shall be subject to the exclusive jurisdiction of the competent courts in <strong>Kolkata, West Bengal, India</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
