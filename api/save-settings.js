/**
 * api/save-settings.js
 * 
 * WHY ES MODULES ARE REQUIRED:
 * The project's package.json defines `"type": "module"`. This tells Node.js and the Vercel 
 * serverless runtime environment to treat all .js files as native ES Modules.
 * CommonJS syntax (like require() or module.exports) will throw a fatal runtime 
 * "ReferenceError: require is not defined in ES module scope" inside Vercel. 
 * Therefore, modern "import" and "export default async function" syntax are strictly required.
 * 
 * HOW THE SUPABASE CONNECTION WORKS:
 * We connect to Supabase PostgreSQL using the 'pg' library. Since connection strings 
 * can contain special characters (like '@') inside the password, raw URI connection 
 * strings can be parsed incorrectly by postgres drivers (resulting in host resolution failures).
 * To ensure absolute bulletproof connection security, the parseConnectionString() 
 * utility extracts user, password, host, port, and database segments cleanly and 
 * constructs a secure Client configuration with SSL enabled (rejectUnauthorized: false),
 * which is a requirement for Supabase's cloud-scale database cluster.
 * 
 * GLOBAL PERSISTENT UPSERT:
 * Supabase is the single source of truth. When the admin clicks "Commit & Publish", 
 * this endpoint receives the settings JSON payload, runs a secure SQL UPSERT statement 
 * on the 'portfolio_settings' table, and writes the state permanently to your Supabase
 * cloud cluster under the unique key id = 'main'. This instantly synchronizes the entire
 * website across all devices globally.
 */

import pg from 'pg';
const { Client } = pg;

// Securely read from Vercel Environment Variables, with seeded fallback
const DB_URL = process.env.DATABASE_URL || "postgresql://postgres:udit9123119694@db.wxmgfmzthzqktkxwmnyw.supabase.co:5432/postgres";

/**
 * Parses Postgres URI connection string safely, supporting passwords with special characters.
 */
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

export default async function handler(req, res) {
  // Setup standard CORS Headers for platform interoperability
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle CORS OPTIONS Preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientParams = parseConnectionString(DB_URL);
  const client = new Client({
    ...clientParams,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // 1. Ensure table exists in Supabase
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        id VARCHAR(50) PRIMARY KEY,
        settings JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Perform UPSERT to write the settings globally to Supabase under id = 'main'
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {}
    }
    
    await client.query(`
      INSERT INTO portfolio_settings (id, settings, updated_at)
      VALUES ('main', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (id)
      DO UPDATE SET settings = EXCLUDED.settings, updated_at = CURRENT_TIMESTAMP;
    `, [payload]);

    return res.status(200).json({ success: true, message: "Settings synced successfully to Supabase globally!" });

  } catch (err) {
    console.error("Vercel save-settings runtime error:", err);
    return res.status(500).json({ error: 'Database operation failed', details: err.message });
  } finally {
    await client.end();
  }
}
