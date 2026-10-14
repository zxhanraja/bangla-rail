import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Database, Globe, ArrowLeft, Mail, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bangla Rail',
  description: 'Learn how Bangla Rail collects, protects, and respects your privacy while accessing West Bengal train timetables and Kolkata Metro schedules.',
  alternates: {
    canonical: 'https://banglarail.in/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Bangla Rail',
    description: 'Our commitment to data privacy, zero intrusive tracking, and secure transit data services under DPDP Act 2023.',
    url: 'https://banglarail.in/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs & Return */}
      <div className="flex items-center gap-2 text-xs text-[#52525B]">
        <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Timetables</span>
        </Link>
        <span>/</span>
        <span className="text-[#18181B] font-semibold">Privacy Policy</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white border border-[#E8E3D7] rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero Intrusive Tracking · Privacy by Design</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#52525B]">
          Effective Date: <strong>March 2026</strong> · Last Reviewed: <strong>September 2026</strong>
        </p>

        <p className="text-sm sm:text-base text-[#3F3F46] leading-relaxed pt-2">
          At <strong>Bangla Rail</strong> (<a href="https://banglarail.in" className="text-black underline underline-offset-2 font-medium">banglarail.in</a>), accessible to daily commuters across West Bengal and visitors nationwide, your personal privacy is paramount. This Privacy Policy details our transparent approach to data collection, usage, cookies, and your statutory rights under India’s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and international data protection standards.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">1. Information We Collect</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            Bangla Rail is engineered as an open commuter utility. <strong>We do not require account registration, phone numbers, or credit card details</strong> to search train timetables, view halt sequences, or check Kolkata Metro schedules.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#3F3F46] pl-2">
            <li><strong>Transit Queries:</strong> Origin and destination searches submitted to our timetable API to return matching EMU locals or express trains.</li>
            <li><strong>Technical Telemetry:</strong> Non-personally identifiable diagnostic data (browser user-agent, operating system, network latency) used strictly for performance optimization.</li>
            <li><strong>Security Hashes:</strong> Pseudonymized, cryptographic one-way hashes of IP addresses solely for rate-limiting and preventing automated Denial of Service (DoS) attacks.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3" id="cookies">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">2. Cookies and Local Storage</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            We prioritize client-side browser storage (localStorage) over tracking cookies to keep our services lightning-fast:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3D7] space-y-1">
              <h3 className="text-xs font-bold text-[#111111]">Essential Client State</h3>
              <p className="text-[11px] text-[#52525B]">Remembers your recent station searches, favourite routes, and preferred language (English/Bengali) offline on your device.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3D7] space-y-1">
              <h3 className="text-xs font-bold text-[#111111]">Zero Tracking Cookies</h3>
              <p className="text-[11px] text-[#52525B]">We do not use advertising or third-party tracking cookies, meaning no intrusive cookie consent popups or cross-site tracking.</p>
            </div>
          </div>
          <p className="text-xs text-[#52525B] pt-1">
            You can clear your local storage or cookies at any time via your browser settings without impacting your ability to browse train schedules.
          </p>
        </section>

        {/* Section 3 */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">3. Security & HTTPS Enforcement</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            All communication with Bangla Rail is strictly encrypted in transit using <strong>Transport Layer Security (TLS 1.3 / HTTPS)</strong> and enforced with <strong>HTTP Strict Transport Security (HSTS)</strong> with a 2-year preloaded cache directive. This ensures no third-party can eavesdrop, intercept, or tamper with your timetable queries.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">4. Statutory Compliance (India DPDP Act 2023)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            In compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of the Republic of India:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-[#3F3F46] pl-2">
            <li><strong>Purpose Limitation:</strong> Telemetry data is utilized solely for route display and service availability.</li>
            <li><strong>No Commercial Sale:</strong> We never sell, rent, broker, or trade commuter data or search logs to commercial third-party advertisers or data brokers.</li>
            <li><strong>Right to Inquire & Correction:</strong> Users submitting schedule error reports may request deletion of submitted feedback at any time.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F7F5EE] border border-[#E8E3D7] flex items-center justify-center text-neutral-800 shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#111111]">5. Grievance Officer & Contact Details</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
            If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact our designated privacy desk:
          </p>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E3D7] space-y-1.5 text-xs text-[#3F3F46]">
            <div><strong>Bangla Rail Legal & Privacy Team</strong></div>
            <div>Email: <a href="mailto:privacy@banglarail.in" className="text-black font-semibold underline">privacy@banglarail.in</a></div>
            <div>Support Desk: <a href="mailto:support@banglarail.in" className="text-black font-semibold underline">support@banglarail.in</a></div>
            <div>Location: Kolkata, West Bengal, India</div>
          </div>
        </section>
      </div>
    </div>
  );
}
