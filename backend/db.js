const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

let pool = null;
let initialized = false;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    const isLocalhost = process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocalhost ? false : (process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false })
    });

    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL error on idle client:", err.message);
    });
  }
  return pool;
}

async function query(text, params) {
  const p = getPool();
  if (!p) {
    return null;
  }
  return p.query(text, params);
}

async function initializeDatabase() {
  const p = getPool();
  if (!p || initialized) return;

  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, "utf8");
      await p.query(sql);
      initialized = true;
      console.log("✅ PostgreSQL schema & seed data verified/initialized successfully.");
    }
  } catch (err) {
    console.error("⚠️ PostgreSQL schema initialization notice:", err.message);
  }
}

async function checkDatabaseConnection() {
  const p = getPool();
  if (!p) return { connected: false, message: "DATABASE_URL not configured" };
  try {
    const res = await p.query("SELECT NOW()");
    if (!initialized) {
      await initializeDatabase();
    }
    return { connected: true, timestamp: res.rows[0].now };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

module.exports = {
  getPool,
  query,
  checkDatabaseConnection,
  initializeDatabase
};
