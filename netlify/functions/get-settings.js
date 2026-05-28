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

exports.handler = async (event, context) => {
  // Allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  const clientParams = parseConnectionString(DB_URL);
  const client = new Client({
    ...clientParams,
    ssl: { rejectUnauthorized: false } // Required for Supabase external connections
  });

  try {
    await client.connect();

    // 1. Ensure the table exists with the exact active schema
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_settings (
        id VARCHAR(50) PRIMARY KEY,
        settings JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Query the current settings for 'main' key
    const res = await client.query(
      "SELECT settings FROM portfolio_settings WHERE id = 'main' LIMIT 1"
    );

    if (res.rows.length === 0) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(null) // Return null if no settings saved yet
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(res.rows[0].settings)
    };

  } catch (err) {
    console.error("Database error inside get-settings:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Database operation failed", details: err.message })
    };
  } finally {
    await client.end();
  }
};
