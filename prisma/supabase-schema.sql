-- =========================================================================
-- BANGLA RAILWAY - SUPABASE POSTGRESQL SCHEMA
-- Copy and paste this directly into your Supabase Dashboard -> SQL Editor
-- URL: https://supabase.com/dashboard/project/qiujipyowxlcpqpvphjg/sql
-- =========================================================================

-- 1. Create Stations Table
CREATE TABLE IF NOT EXISTS public.stations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_bn TEXT,
  zone TEXT DEFAULT 'ER',
  division TEXT DEFAULT 'Sealdah',
  district TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Trains Table
CREATE TABLE IF NOT EXISTS public.trains (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'EMU Local',
  origin_station_code TEXT NOT NULL,
  destination_station_code TEXT NOT NULL,
  running_days TEXT DEFAULT 'Daily',
  distance_km INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Schedule Stops Table
CREATE TABLE IF NOT EXISTS public.schedule_stops (
  id BIGSERIAL PRIMARY KEY,
  train_id TEXT REFERENCES public.trains(id) ON DELETE CASCADE,
  station_id TEXT REFERENCES public.stations(id) ON DELETE CASCADE,
  sequence_no INT NOT NULL,
  day_offset INT DEFAULT 1,
  arrival_time TEXT,
  departure_time TEXT,
  halt_minutes INT DEFAULT 1,
  source TEXT DEFAULT 'seed',
  last_verified_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(train_id, station_id)
);

-- 4. Create Corrections Table
CREATE TABLE IF NOT EXISTS public.corrections (
  id BIGSERIAL PRIMARY KEY,
  station_code TEXT,
  station_name TEXT,
  train_number TEXT NOT NULL,
  train_name TEXT,
  from_station TEXT,
  to_station TEXT,
  arrival_time TEXT,
  departure_time TEXT,
  note TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  ip_hash TEXT
);

-- 5. Enable Row Level Security (RLS) & Allow Public Read Access
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- Allow anyone with the anon key to read timetable data
CREATE POLICY "Allow public read on stations" ON public.stations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on stations" ON public.stations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on trains" ON public.trains FOR SELECT USING (true);
CREATE POLICY "Allow public insert on trains" ON public.trains FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on schedule_stops" ON public.schedule_stops FOR SELECT USING (true);
CREATE POLICY "Allow public insert on schedule_stops" ON public.schedule_stops FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on corrections" ON public.corrections FOR SELECT USING (true);
CREATE POLICY "Allow public insert on corrections" ON public.corrections FOR INSERT WITH CHECK (true);

-- Indexes for ultra-fast queries
CREATE INDEX IF NOT EXISTS idx_stations_code ON public.stations(code);
CREATE INDEX IF NOT EXISTS idx_trains_number ON public.trains(number);
CREATE INDEX IF NOT EXISTS idx_schedule_stops_station ON public.schedule_stops(station_id);
CREATE INDEX IF NOT EXISTS idx_schedule_stops_train ON public.schedule_stops(train_id);
