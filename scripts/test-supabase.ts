import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qiujipyowxlcpqpvphjg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdWppcHlvd3hsY3BxcHZwaGpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTA3MjcsImV4cCI6MjEwMzI4NjcyN30.pG-YAEyyhEXLgqy7iy7HiMr3O5eNGfzdx7Dkeyq-FIs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing connection to Supabase...');
  
  // Try querying stations table
  const { data: stations, error: stError } = await supabase.from('stations').select('*').limit(5);
  console.log('Stations query result:', { data: stations, error: stError });

  // Try querying Station (capitalized)
  const { data: stationsCap, error: stCapError } = await supabase.from('Station').select('*').limit(5);
  console.log('Station (Cap) query result:', { data: stationsCap, error: stCapError });

  // Try querying trains table
  const { data: trains, error: trError } = await supabase.from('trains').select('*').limit(5);
  console.log('Trains query result:', { data: trains, error: trError });
}

testSupabase();
