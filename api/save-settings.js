/**
 * api/save-settings.js
 *
 * IMPORTANT: Uses Supabase REST API over HTTPS (port 443).
 * Vercel serverless functions block outbound TCP on port 5432 (PostgreSQL),
 * so direct `pg` connections will always fail with ENOTFOUND / ECONNREFUSED.
 * The Supabase REST API (PostgREST) runs on standard HTTPS port 443, which
 * Vercel fully supports.
 *
 * UPSERT strategy: POST with `Prefer: resolution=merge-duplicates` header
 * performs an INSERT ... ON CONFLICT DO UPDATE (upsert) on the `id` primary key.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wxmgfmzthzqktkxwmnyw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bWdmbXp0aHpxa3RreHdtbnl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk3NDYzMCwiZXhwIjoyMDk1NTUwNjMwfQ.O_lK5o-3WvlmKrsdYUVVyKhtQw6G344_c8zkonaa_1k';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Parse body robustly (Vercel sometimes sends string, sometimes object)
  let payload = req.body;
  if (typeof payload === 'string') {
    try { payload = JSON.parse(payload); } catch (e) {}
  }

  if (!payload || typeof payload !== 'object') {
    return res.status(400).json({ error: 'Invalid payload: expected a JSON object' });
  }

  try {
    // Upsert via Supabase REST API (HTTPS) — fully supported on Vercel
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_settings`,
      {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'  // enables UPSERT
        },
        body: JSON.stringify({
          id: 'main',
          settings: payload,
          updated_at: new Date().toISOString()
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase API error ${response.status}: ${errorText}`);
    }

    return res.status(200).json({ success: true, message: 'Settings synced successfully to Supabase globally!' });

  } catch (err) {
    console.error('save-settings error:', err);
    return res.status(500).json({ error: 'Failed to save settings', details: err.message });
  }
}
