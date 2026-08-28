const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

let pool = null;
let initialized = false;

const DB_FILE_PATH = path.join(__dirname, "data", "skillbridge_database.json");

function isValidPostgresUrl(str) {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("postgres://") || str.startsWith("postgresql://");
}

function ensureDataDir() {
  const dataDir = path.join(__dirname, "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE_PATH)) {
    const defaultData = {
      users: [],
      students: [
        {
          id: 1,
          name: "Adarsh Pratap Singh",
          course: "CSIT",
          batch: "2025-29",
          target_role: "Full Stack Software Engineer",
          career_readiness: 81,
          experience_score: 64
        }
      ],
      companies: [
        { id: 1, company_name: "TechNova Labs", industry: "Software & AI", verified: true },
        { id: 2, company_name: "CloudSphere Systems", industry: "Cloud Infrastructure", verified: true },
        { id: 3, company_name: "FinEdge Solutions", industry: "Fintech & Analytics", verified: true }
      ],
      mentors: [
        { id: 1, name: "Rohan Mehta", role: "Senior Software Architect", company: "TechNova Labs", experience_years: 12, availability: true },
        { id: 2, name: "Priya Sharma", role: "Engineering Manager", company: "CloudSphere", experience_years: 10, availability: true },
        { id: 3, name: "Arjun Kapoor", role: "AI/ML Lead", company: "DataSphere AI", experience_years: 14, availability: true },
        { id: 4, name: "Aryan Mehrotra", role: "Senior Software Developer", company: "My Tech", experience_years: 10, availability: true }
      ],
      gigs: [
        {
          id: 1,
          company_id: 1,
          title: "Build a Responsive Product Landing Page",
          description: "Design and code a high converting landing page",
          required_skill: "Web Development",
          duration_hours: 3,
          payment: 1500.00,
          status: "open",
          company: "TechNova Labs"
        },
        {
          id: 2,
          company_id: 2,
          title: "Build an Authenticated REST API",
          description: "Develop JWT secured API with Node.js & PostgreSQL",
          required_skill: "Backend",
          duration_hours: 5,
          payment: 3500.00,
          status: "open",
          company: "CloudSphere Systems"
        },
        {
          id: 3,
          company_id: 3,
          title: "SQL Business Analytics Challenge",
          description: "Write analytical queries for financial reports",
          required_skill: "SQL",
          duration_hours: 3,
          payment: 1800.00,
          status: "open",
          company: "FinEdge Solutions"
        }
      ],
      gig_applications: [],
      mentor_bookings: [],
      experience_records: [
        {
          id: 1,
          student_id: 1,
          title: "Backend API Micro-Internship",
          company: "CloudSphere Systems",
          experience_type: "Gig Completion",
          verified: true,
          score: 85,
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(defaultData, null, 2), "utf8");
  }
}

function readLocalDb() {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DB_FILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading local db file:", err.message);
    return {
      users: [],
      students: [],
      companies: [],
      mentors: [],
      gigs: [],
      gig_applications: [],
      mentor_bookings: [],
      experience_records: []
    };
  }
}

function writeLocalDb(data) {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error saving local db file:", err.message);
    return false;
  }
}

function getPool() {
  if (!pool && isValidPostgresUrl(process.env.DATABASE_URL)) {
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
  if (p) {
    try {
      return await p.query(text, params);
    } catch (err) {
      console.warn("PostgreSQL query failed, evaluating local file database:", err.message);
    }
  }
  return null;
}

// File-backed database operations
function findUserByEmail(email) {
  const cleanEmail = email.toLowerCase().trim();
  const dbData = readLocalDb();
  return dbData.users.find(u => u.email.toLowerCase().trim() === cleanEmail) || null;
}

function findUserById(id) {
  const dbData = readLocalDb();
  return dbData.users.find(u => Number(u.id) === Number(id)) || null;
}

function insertUser(userData) {
  const dbData = readLocalDb();
  const nextId = dbData.users.length > 0 ? Math.max(...dbData.users.map(u => Number(u.id) || 0)) + 1 : 1;
  const newUser = {
    id: nextId,
    email: userData.email.toLowerCase().trim(),
    password_hash: userData.password_hash,
    name: userData.name,
    role: userData.role || "student",
    student_id: userData.student_id || (userData.role === "student" ? nextId : null),
    mentor_id: userData.mentor_id || (userData.role === "mentor" ? nextId : null),
    company_id: userData.company_id || (userData.role === "company" ? nextId : null),
    created_at: new Date().toISOString()
  };

  // If student, create student profile
  if (userData.role === "student") {
    dbData.students.push({
      id: newUser.student_id,
      name: userData.name,
      course: userData.extraInfo?.course || "CSIT",
      batch: userData.extraInfo?.batch || "2025-29",
      target_role: userData.extraInfo?.targetRole || "Software Engineer",
      career_readiness: 70,
      experience_score: 50
    });
  } else if (userData.role === "mentor") {
    dbData.mentors.push({
      id: newUser.mentor_id,
      name: userData.name,
      role: userData.extraInfo?.jobRole || "Industry Mentor",
      company: userData.extraInfo?.company || "Independent",
      experience_years: Number(userData.extraInfo?.experience) || 5,
      availability: true
    });
  } else if (userData.role === "company") {
    dbData.companies.push({
      id: newUser.company_id,
      company_name: userData.name,
      industry: userData.extraInfo?.industry || "Technology",
      verified: true
    });
  }

  dbData.users.push(newUser);
  writeLocalDb(dbData);
  return newUser;
}

function getAllUsers() {
  const dbData = readLocalDb();
  return dbData.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    student_id: u.student_id,
    mentor_id: u.mentor_id,
    company_id: u.company_id,
    created_at: u.created_at
  }));
}

async function initializeDatabase() {
  ensureDataDir();
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
  const localDb = readLocalDb();
  const usersCount = localDb.users.length;
  
  if (!p) {
    return {
      connected: true,
      mode: "Persistent Local File Database",
      filePath: "backend/data/skillbridge_database.json",
      registeredUsersCount: usersCount,
      timestamp: new Date().toISOString()
    };
  }
  try {
    const res = await p.query("SELECT NOW()");
    if (!initialized) {
      await initializeDatabase();
    }
    return {
      connected: true,
      mode: "PostgreSQL Database",
      timestamp: res.rows[0].now,
      registeredUsersCount: usersCount
    };
  } catch (err) {
    return {
      connected: true,
      mode: "Persistent Local File Database (PostgreSQL Offline Fallback)",
      error: err.message,
      filePath: "backend/data/skillbridge_database.json",
      registeredUsersCount: usersCount,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  getPool,
  query,
  checkDatabaseConnection,
  initializeDatabase,
  readLocalDb,
  writeLocalDb,
  findUserByEmail,
  findUserById,
  insertUser,
  getAllUsers
};

