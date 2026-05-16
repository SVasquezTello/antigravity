import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve('.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const url = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const key = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase URL:', url);
console.log('Testing Key (first 20 chars):', key.substring(0, 20));

async function testKey() {
  try {
    const res = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log('Status:', res.status, res.statusText);
    const data = await res.json().catch(() => null);
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testKey();
