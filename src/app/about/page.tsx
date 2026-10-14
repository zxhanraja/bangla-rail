import { Metadata } from 'next';
import Link from 'next/link';
import { Train, ShieldCheck, MapPin, Database, Users, HeartHandshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Bangla Rail | West Bengal Local Train & Metro Authority Portal',
  description: 'Learn about Bangla Rail, our mission to provide accurate real-time local train schedules, Kolkata Metro timetables, and passenger transit information across West Bengal.',
  alternates: {
    canonical: 'https://banglarail.in/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#202022] text-[#F7F5EE] flex items-center justify-center mb-4">
          <Train className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
          About Bangla Rail
        </h1>
        <p className="text-base sm:text-lg text-[#555555] mt-3 leading-relaxed">
          Bangla Rail (banglarail.in) is West Bengal’s dedicated digital railway and transit timetable platform. We provide accurate, accessible, and fast suburban local train schedules, Kolkata Metro timings, and route information across all 556 railway stations in the state.
        </p>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 shadow-xs">
          <Database className="w-6 h-6 text-indigo-600 mb-3" />
          <h3 className="font-bold text-base text-[#111111]">Verified Data Sources</h3>
          <p className="text-xs sm:text-sm text-[#555555] mt-2 leading-relaxed">
            Timetable records are synchronized with the National Train Enquiry System (NTES) and official Eastern & South Eastern Railway suburban working timetables.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 shadow-xs">
          <MapPin className="w-6 h-6 text-emerald-600 mb-3" />
          <h3 className="font-bold text-base text-[#111111]">Comprehensive Coverage</h3>
          <p className="text-xs sm:text-sm text-[#555555] mt-2 leading-relaxed">
            Covering all 556 stations across Howrah, Sealdah, Asansol, Malda, and Kharagpur divisions, plus the complete Kolkata Metro network.
          </p>
        </div>

        <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 shadow-xs">
          <HeartHandshake className="w-6 h-6 text-amber-600 mb-3" />
          <h3 className="font-bold text-base text-[#111111]">Commuter Powered</h3>
          <p className="text-xs sm:text-sm text-[#555555] mt-2 leading-relaxed">
            Our crowdsourced verification module allows real commuters to report platform shifts, seasonal timetable updates, and delays in real-time.
          </p>
        </div>
      </div>

      {/* Detailed Mission statement */}
      <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 text-sm text-[#444444] leading-relaxed">
        <h2 className="text-xl font-bold text-[#111111]">Our Mission</h2>
        <p>
          Every single day, over 3.5 million commuters board EMU local trains in the Kolkata metropolitan area and suburban districts of Hooghly, North 24 Parganas, South 24 Parganas, Nadia, and Purba Bardhaman. Finding timely, clear, and mobile-friendly schedules without wading through complex official portals was historically challenging.
        </p>
        <p>
          Bangla Rail was engineered from the ground up with modern web technologies to load in under a second on mobile 4G/5G connections, consume minimal data, and deliver unambiguous timetable details at a glance.
        </p>

        <h3 className="text-base font-bold text-[#111111] pt-2">Disclaimer</h3>
        <p className="text-xs text-[#71717A]">
          Bangla Rail is an independent commuter utility platform and is not officially affiliated with or operated by the Ministry of Railways or Kolkata Metro Rail Corporation (KMRC). All trademarks and station names belong to their respective authorities.
        </p>
      </div>
    </div>
  );
}
