import { NextResponse } from 'next/server';
import { invalidateRouteIndex } from '@/services/routeService';

// Secret key check — only allow internal/admin calls
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'banglarail-admin-2026';

export async function POST(request: Request) {
  const auth = request.headers.get('x-admin-secret');
  if (auth !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  invalidateRouteIndex();
  return NextResponse.json({ success: true, message: 'Route index invalidated. Will rebuild on next search request.' });
}

// Allow GET for easy browser testing in dev
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'banglarail-admin-2026';
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized. Pass ?secret=YOUR_SECRET' }, { status: 401 });
  }
  invalidateRouteIndex();
  return NextResponse.json({ success: true, message: 'Route index cleared. Will rebuild on next search.' });
}
