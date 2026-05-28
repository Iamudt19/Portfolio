/**
 * api/test-db.js
 *
 * Diagnostic endpoint — tests the Supabase REST API connection over HTTPS.
 * Visit /api/test-db in your browser after deployment to verify connectivity.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://wxmgfmzthzqktkxwmnyw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bWdmbXp0aHpxa3RreHdtbnl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk3NDYzMCwiZXhwIjoyMDk1NTUwNjMwfQ.O_lK5o-3WvlmKrsdYUVVyKhtQw6G344_c8zkonaa_1k';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const diagnostic = {
    supabase_url: SUPABASE_URL,
    has_service_key: !!SUPABASE_KEY,
    has_url_env: !!process.env.SUPABASE_URL,
    has_key_env: !!process.env.SUPABASE_SERVICE_KEY,
    node_version: process.version
  };

  try {
    // Test 1: fetch row count from portfolio_settings
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/portfolio_settings?select=id,updated_at`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase REST error ${response.status}: ${errorText}`);
    }

    const rows = await response.json();

    return res.status(200).json({
      success: true,
      message: 'Supabase REST API connected successfully!',
      rows_found: rows.length,
      rows,
      diagnostic
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Supabase REST API connection failed!',
      error: err.message,
      diagnostic
    });
  }
}
