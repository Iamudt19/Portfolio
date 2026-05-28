/**
 * api/get-settings.js
 *
 * IMPORTANT: Uses Supabase REST API over HTTPS (port 443).
 * Vercel serverless functions block outbound TCP on port 5432 (PostgreSQL),
 * so direct `pg` connections will always fail with ENOTFOUND / ECONNREFUSED.
 * The Supabase REST API (PostgREST) runs on standard HTTPS port 443, which
 * Vercel fully supports.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wxmgfmzthzqktkxwmnyw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bWdmbXp0aHpxa3RreHdtbnl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk3NDYzMCwiZXhwIjoyMDk1NTUwNjMwfQ.O_lK5o-3WvlmKrsdYUVVyKhtQw6G344_c8zkonaa_1k';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Query via Supabase REST API (HTTPS) — fully supported on Vercel
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_settings?id=eq.main&select=settings&limit=1`,
      {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase API error ${response.status}: ${errorText}`);
    }

    const rows = await response.json();

    if (!rows || rows.length === 0) {
      return res.status(200).json(null);
    }

    return res.status(200).json(rows[0].settings);

  } catch (err) {
    console.error('get-settings error:', err);
    return res.status(500).json({ error: 'Failed to fetch settings', details: err.message });
  }
}
