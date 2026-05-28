const { Client } = require('pg');

const DB_URL = process.env.DATABASE_URL || "postgresql://postgres:Udit%401905200@db.ssqtwwicmnnyrqvghwuc.supabase.co:5432/postgres";

exports.handler = async (event, context) => {
  // Allow GET requests
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" })
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
