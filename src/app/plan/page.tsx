'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function PlanRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  useEffect(() => {
    if (from && to) {
      router.replace(`/?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    } else if (from) {
      router.replace(`/?from=${encodeURIComponent(from)}&to=Howrah`);
    } else {
      router.replace('/');
    }
  }, [from, to, router]);

  return (
    <div className="py-20 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
      <span>Loading Train Timetable for {from} ➔ {to || 'All Stations'}...</span>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="py-20 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
        <span>Loading Train Timetable...</span>
      </div>
    }>
      <PlanRedirect />
    </Suspense>
  );
}
