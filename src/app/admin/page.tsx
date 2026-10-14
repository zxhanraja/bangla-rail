'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  MapPin, 
  Train, 
  FileText, 
  Lock,
  ArrowLeft
} from 'lucide-react';

interface CorrectionItem {
  id: number;
  stationCode: string;
  stationName: string | null;
  trainNumber: string;
  trainName: string | null;
  fromStation: string | null;
  toStation: string | null;
  arrivalTime: string | null;
  departureTime: string | null;
  note: string | null;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy: string | null;
  reviewedAt: string | null;
}

interface StatsData {
  totalStations: number;
  totalTrains: number;
  totalStops: number;
  pendingCorrections: number;
  approvedCorrections: number;
}

export default function AdminPage() {
  const { lang, t } = useLanguage();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  const [stats, setStats] = useState<StatsData | null>(null);
  const [corrections, setCorrections] = useState<CorrectionItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [loadingData, setLoadingData] = useState(false);
  const [actionProcessingId, setActionProcessingId] = useState<number | null>(null);

  // Check login state and fetch admin data
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (!statsRes.ok) {
        setIsAdminLoggedIn(false);
        setLoadingData(false);
        return;
      }
      const statsJson = await statsRes.json();
      setStats(statsJson);
      setIsAdminLoggedIn(true);

      const corrRes = await fetch(`/api/admin/corrections?status=${statusFilter}`);
      if (corrRes.ok) {
        const corrJson = await corrRes.json();
        setCorrections(corrJson);
      }
    } catch {
      setIsAdminLoggedIn(false);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [statusFilter]);

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLogin(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      setIsAdminLoggedIn(true);
      loadAdminData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAdminLoggedIn(false);
  };

  // Handle Approve or Reject
  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActionProcessingId(id);
    try {
      const res = await fetch('/api/admin/corrections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      await loadAdminData();
    } catch (err) {
      alert('Error updating correction status');
    } finally {
      setActionProcessingId(null);
    }
  };

  // Loading screen
  if (isAdminLoggedIn === null) {
    return (
      <div className="py-20 text-center text-xs text-[#71717A]">
        Authenticating admin portal session...
      </div>
    );
  }

  // 1. LOGIN SCREEN
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-10 space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#111111] font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Timetable
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E7E2D8] space-y-6 shadow-xs">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F5EE] border border-[#E0DBD0] text-[#111111] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-[#111111]">{t.adminLoginTitle}</h1>
            <p className="text-xs text-[#71717A]">
              Official Eastern Railways Administrator Portal
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#F8D7DA] text-[#842029] text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-[#52525B] uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@banglarail.in"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#52525B] uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 text-xs bg-[#F7F5EE] border border-[#E0DBD0] rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              className="w-full h-10 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmittingLogin ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="text-[11px] text-[#52525B] text-center">
            Default credentials: <code className="text-[#111111]">admin@banglarail.in</code> / <code className="text-[#111111]">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD VIEW
  return (
    <div className="space-y-6 pb-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E7E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-[#111111]">Admin Moderation Center</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#111111] text-white">OFFICIAL</span>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">Manage live railway timetables, review community contributions</p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F7F5EE] hover:bg-[#EAE6DC] text-xs font-semibold text-[#111111] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Stats Overview Grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#E7E2D8] space-y-1">
            <div className="flex items-center justify-between text-[#71717A]">
              <span className="text-xs font-semibold">Total Stations</span>
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-[#111111]">{stats.totalStations}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7E2D8] space-y-1">
            <div className="flex items-center justify-between text-[#71717A]">
              <span className="text-xs font-semibold">Total Trains</span>
              <Train className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-[#111111]">{stats.totalTrains}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7E2D8] space-y-1">
            <div className="flex items-center justify-between text-[#71717A]">
              <span className="text-xs font-semibold">Schedule Stops</span>
              <Database className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-[#111111]">{stats.totalStops}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E7E2D8] space-y-1">
            <div className="flex items-center justify-between text-[#71717A]">
              <span className="text-xs font-semibold">Pending Queue</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-[#111111]">{stats.pendingCorrections}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#E7E2D8] flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === s
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#F7F5EE] text-[#71717A] hover:text-[#111111]'
              }`}
            >
              {s} {s === 'pending' && stats?.pendingCorrections ? `(${stats.pendingCorrections})` : ''}
            </button>
          ))}
        </div>

        <button
          onClick={loadAdminData}
          disabled={loadingData}
          className="p-1.5 rounded-lg text-[#71717A] hover:text-[#111111] hover:bg-[#F7F5EE] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-2xl border border-[#E7E2D8] shadow-xs overflow-hidden">
        {corrections.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A]">
            No records in the {statusFilter} queue.
          </div>
        ) : (
          <div className="divide-y divide-[#EAE6DC]">
            {corrections.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 hover:bg-[#FAF8F3] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111111]">
                      Train {item.trainNumber} {item.trainName ? `(${item.trainName})` : ''}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#F7F5EE] border border-[#E7E2D8] font-mono">
                      Station: {item.stationCode}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit ${
                    item.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : item.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <div className="text-xs text-[#555555] grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <strong>Timings:</strong> Arr: {item.arrivalTime || '--'} | Dep: {item.departureTime || '--'}
                  </div>
                  <div>
                    <strong>Route:</strong> {item.fromStation || '--'} ➔ {item.toStation || '--'}
                  </div>
                  {item.note && (
                    <div className="sm:col-span-2 bg-[#F7F5EE] p-2 rounded-lg text-[11px] text-[#444444]">
                      <strong>Note:</strong> {item.note}
                    </div>
                  )}
                </div>

                {item.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0ECE3]">
                    <button
                      onClick={() => handleAction(item.id, 'reject')}
                      disabled={actionProcessingId === item.id}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction(item.id, 'approve')}
                      disabled={actionProcessingId === item.id}
                      className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
                    >
                      Approve & Publish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
