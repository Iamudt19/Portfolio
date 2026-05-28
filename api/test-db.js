import pg from 'pg';
const { Client } = pg;

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const clientParams = parseConnectionString(DB_URL);
  
  const diagnostic = {
    step1_parse: clientParams,
    step2_env: {
      has_db_url_env: !!process.env.DATABASE_URL,
      node_version: process.version
    }
  };

  const client = new Client({
    ...clientParams,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting...");
    await client.connect();
    
    console.log("Querying table existence...");
    const tableRes = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'portfolio_settings'
      );
    `);
    
    diagnostic.step3_connect = "Success";
    diagnostic.step4_table_exists = tableRes.rows[0].exists;

    if (tableRes.rows[0].exists) {
      const rowsRes = await client.query("SELECT COUNT(*) FROM portfolio_settings");
      diagnostic.step5_rows_count = parseInt(rowsRes.rows[0].count, 10);
    }
    
    return res.status(200).json({
      success: true,
      message: "Database diagnostic passed successfully!",
      diagnostic
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Database diagnostic failed!",
      error: err.message,
      stack: err.stack,
      diagnostic
    });
  } finally {
    await client.end();
  }
}
