'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle, CheckCircle2, ArrowLeft, Send, Info } from 'lucide-react';

function ReportContent() {
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  const initialStation = searchParams.get('station') || '';
  const initialTrain = searchParams.get('train') || '';

  const [stationCode, setStationCode] = useState(initialStation);
  const [stationName, setStationName] = useState('');
  const [trainNumber, setTrainNumber] = useState(initialTrain);
  const [trainName, setTrainName] = useState('');
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [note, setNote] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationCode,
          stationName,
          trainNumber,
          trainName,
          fromStation,
          toStation,
          arrivalTime,
          departureTime,
          note,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-12 max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E2D8] text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 bg-[#F7F5EE] border border-[#E0DBD0] text-[#111111] rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#111111]">Thank You!</h2>
        <p className="text-xs text-[#71717A] leading-relaxed">
          {t.submissionSuccess}
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Timetable
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#111111] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Timetable
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E2D8] p-5 sm:p-7 shadow-xs space-y-6">
        <div className="space-y-1 border-b border-[#EAE6DC] pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] tracking-tight">
            {t.reportTitle}
          </h1>
          <p className="text-xs text-[#71717A]">
            Help keep railway timetables updated for all commuters. Submitted reports are reviewed by officials.
          </p>
        </div>


        {error && (
          <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] text-[#842029] text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Station Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
                {t.stationCode} *
              </label>
              <input
                type="text"
                value={stationCode}
                onChange={(e) => setStationCode(e.target.value.toUpperCase())}
                placeholder="e.g. HWH, SDAH, BDC"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-semibold font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
                Station Name
              </label>
              <input
                type="text"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                placeholder="e.g. Howrah Junction"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          {/* Train Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
                {t.trainNumber} *
              </label>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="e.g. 37392"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-semibold font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
                Train Name
              </label>
              <input
                type="text"
                value={trainName}
                onChange={(e) => setTrainName(e.target.value)}
                placeholder="e.g. Bardhaman-Howrah Local"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-medium"
              />
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
                Arrival Time (HH:MM)
              </label>
              <input
                type="text"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                placeholder="e.g. 05:58"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
                Departure Time (HH:MM)
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="e.g. 05:59"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-mono"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-1">
              Correction Details / Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe timing change, platform halt, or missing stops..."
              rows={3}
              className="w-full p-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-medium"
            />
          </div>

          {/* Honeypot anti-spam */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <span>Submitting Report...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Correction</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-neutral-400">Loading form...</div>}>
      <ReportContent />
    </Suspense>
  );
}
