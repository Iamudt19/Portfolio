const { Client } = require('pg');

const DB_URL = process.env.DATABASE_URL || "postgresql://postgres:Udit%401905200@db.ssqtwwicmnnyrqvghwuc.supabase.co:5432/postgres";

exports.handler = async (event, context) => {
  // Allow OPTIONS (preflight) and POST requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  const client = new Client({
    connectionString: DB_URL,
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

    // 2. Perform UPSERT (Insert or Update if id exists)
    await client.query(`
      INSERT INTO portfolio_settings (id, settings, updated_at)
      VALUES ('main', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (id)
      DO UPDATE SET settings = EXCLUDED.settings, updated_at = CURRENT_TIMESTAMP;
    `, [payload]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ success: true, message: "Settings synced successfully to Supabase globally!" })
    };

  } catch (err) {
    console.error("Database error inside save-settings:", err);
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
