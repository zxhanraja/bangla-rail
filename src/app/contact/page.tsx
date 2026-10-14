import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Bangla Rail | Passenger Support & Feedback',
  description: 'Get in touch with the Bangla Rail team. Submit timetable corrections, feedback, feature suggestions, or business inquiries.',
  alternates: {
    canonical: 'https://banglarail.in/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
          Contact & Passenger Feedback
        </h1>
        <p className="text-sm sm:text-base text-[#555555] mt-2 leading-relaxed">
          Have a question about a local train schedule, spotted a timing variation, or want to suggest an improvement? We would love to hear from you.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-[#E8E3D7] bg-[#FBF9F5]">
            <Mail className="w-5 h-5 text-neutral-800 mb-2" />
            <h3 className="font-bold text-sm text-[#111111]">Email Inquiries</h3>
            <p className="text-xs text-[#555555] mt-1">
              General feedback & tech support:
            </p>
            <a href="mailto:support@banglarail.in" className="text-xs font-bold text-neutral-900 underline mt-2 inline-block">
              support@banglarail.in
            </a>
          </div>

          <div className="p-5 rounded-xl border border-[#E8E3D7] bg-[#FBF9F5]">
            <AlertCircle className="w-5 h-5 text-amber-700 mb-2" />
            <h3 className="font-bold text-sm text-[#111111]">Report Schedule Change</h3>
            <p className="text-xs text-[#555555] mt-1">
              If a train timing or halt was modified by the railways:
            </p>
            <Link href="/report" className="text-xs font-bold text-neutral-900 underline mt-2 inline-block">
              Open Correction Form &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E3D7] rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-[#111111] mb-4">Official Railway Helpline Numbers</h2>
        <ul className="space-y-3 text-xs sm:text-sm text-[#444444]">
          <li className="flex items-center justify-between border-b border-[#F0EBE0] pb-2">
            <span>RailMadad (Single Railway Helpline for security, medical & grievances):</span>
            <span className="font-bold text-neutral-900">139</span>
          </li>
          <li className="flex items-center justify-between border-b border-[#F0EBE0] pb-2">
            <span>Railway Protection Force (RPF Security Helpline):</span>
            <span className="font-bold text-neutral-900">182</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Kolkata Metro Customer Care:</span>
            <span className="font-bold text-neutral-900">033-22264920</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
