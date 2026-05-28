const { Client } = require('pg');

const DB_URL = "postgresql://postgres:udit9123119694@db.wxmgfmzthzqktkxwmnyw.supabase.co:5432/postgres";

function parseConnectionString(str) {
  if (!str) return null;
  let s = str;
  if (s.startsWith("postgresql://")) s = s.substring(13);
  else if (s.startsWith("postgres://")) s = s.substring(11);
  
  const slashIdx = s.lastIndexOf('/');
  let database = "postgres";
  if (slashIdx !== -1) {
    database = s.substring(slashIdx + 1);
    s = s.substring(0, slashIdx);
  }
  
  const atIdx = s.lastIndexOf('@');
  if (atIdx === -1) return { connectionString: str };
  
  const auth = s.substring(0, atIdx);
  const hostPort = s.substring(atIdx + 1);
  
  const colonIdx = auth.indexOf(':');
  const user = colonIdx !== -1 ? auth.substring(0, colonIdx) : auth;
  let password = colonIdx !== -1 ? auth.substring(colonIdx + 1) : "";
  try {
    password = decodeURIComponent(password);
  } catch(e) {}
  
  const hpColonIdx = hostPort.indexOf(':');
  const host = hpColonIdx !== -1 ? hostPort.substring(0, hpColonIdx) : hostPort;
  const port = hpColonIdx !== -1 ? parseInt(hostPort.substring(hpColonIdx + 1), 10) : 5432;
  
  return {
    user,
    password,
    host,
    port,
    database
  };
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientParams = parseConnectionString(DB_URL);
  const client = new Client({
    ...clientParams,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // 1. Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        id VARCHAR(50) PRIMARY KEY,
        settings JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Query settings
    const result = await client.query(
      "SELECT settings FROM portfolio_settings WHERE id = 'main' LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(200).json(null);
    }

    return res.status(200).json(result.rows[0].settings);

  } catch (err) {
    console.error("Vercel get-settings error:", err);
    return res.status(500).json({ error: 'Database operation failed', details: err.message });
  } finally {
    await client.end();
  }
};
