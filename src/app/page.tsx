// ─── Server Component Entry Point ────────────────────────────────────────────
// This runs on the server — fetches all 667 stations from DB and passes them
// as props to the client component. This eliminates the slow client-side
// /api/stations/search?all=true fetch, making station search instant (0ms lag).

import { getAllStations } from '@/lib/station-cache';
import HomePageClient from './HomePageClient';

export default async function HomePage() {
  const all = await getAllStations();
  const stations = all.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    nameBn: s.nameBn || null,
    zone: s.zone,
    division: s.division,
  }));
  return <HomePageClient stations={stations} />;
}
