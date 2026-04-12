
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read from .env.local manually
const env = readFileSync('c:/Users/DAVID/Desktop/ANTIGRAVITY/.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

console.log('Connecting to:', env.NEXT_PUBLIC_SUPABASE_URL);

async function getApps() {
  const { data, error, count } = await supabase
    .from('micro_apps')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Count:', count);
    console.log(JSON.stringify(data, null, 2));
  }
}

getApps();
