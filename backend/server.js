const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "skillbridge-secret-key-2026";

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= HEALTH & DB STATUS ================= */
app.get("/api/health", async (req, res) => {
  const dbStatus = await db.checkDatabaseConnection();
  res.json({
    status: "online",
    service: "SkillBridge AI Backend",
    version: "1.0.0",
    database: {
      ...dbStatus
    }
  });
});

app.get("/api/database/users", async (req, res) => {
  try {
    const pool = db.getPool();
    if (pool) {
      const pgUsers = await db.query(
        "SELECT id, name, email, role, student_id, mentor_id, company_id, created_at FROM users ORDER BY id ASC"
      );
      if (pgUsers && pgUsers.rows) {
        return res.json({
          success: true,
          database: "PostgreSQL",
          count: pgUsers.rows.length,
          users: pgUsers.rows
        });
      }
    }
    const users = db.getAllUsers();
    res.json({
      success: true,
      database: "Local File Database",
      count: users.length,
      users
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to read database users", details: err.message });
  }
});

/* ===========AUTHENTICATION ROUTES ========== */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, extraInfo } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const pool = db.getPool();
    if (pool) {
      const existing = await db.query("SELECT id FROM users WHERE email = $1", [cleanEmail]);
      if (existing && existing.rows && existing.rows.length > 0) {
        return res.status(400).json({ error: "An account with this email already exists in PostgreSQL database" });
      }
    } else {
      const existingFileUser = db.findUserByEmail(cleanEmail);
      if (existingFileUser) {
        return res.status(400).json({ error: "An account with this email already exists in the database" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let studentID = null;
    let mentorID = null;
    let companyID = null;

    if (pool) {
      try {
        if (role == "student") {
          const sRes = await db.query(
            `INSERT INTO students (name, course, batch, target_role, career_readiness, experience_score)
              VALUES ($1, $2, $3, $4, 65, 45) RETURNING id`,
            [name, extraInfo?.course || "CSIT", extraInfo?.batch || "2025-29", extraInfo?.targetRole || "Software Engineer"]
          );
          studentID = sRes?.rows?.[0]?.id || 1;
        } else if (role === "mentor") {
          const mRes = await db.query(
            `INSERT INTO mentors (name, role, company, experience_years, availability)
            VALUES ($1, $2, $3, $4, true) RETURNING id`,
            [name, extraInfo?.jobRole || "Industry Mentor", extraInfo?.company || "Independent", Number(extraInfo?.experience) || 5]
          );
          mentorID = mRes?.rows?.[0]?.id || 1;
        } else if (role == "company") {
          const cRes = await db.query(
            `INSERT INTO companies (name, industry, location, verified)
            VALUES ($1, $2, $3, true) RETURNING id`,
            [name, extraInfo?.industry || "Technology", extraInfo?.location || "Remote"]
          );
          companyID = cRes?.rows?.[0]?.id || 1;
        }

        const uRes = await db.query(
          `INSERT INTO users (name, email, password_hash, role, student_id, mentor_id, company_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id, name, email, role, student_id, mentor_id, company_id`,
          [name, cleanEmail, passwordHash, role, studentID, mentorID, companyID]
        );

        if (uRes && uRes.rows && uRes.rows.length > 0) {
          const user = uRes.rows[0];
          // Also sync to local database file
          db.insertUser({
            id: user.id,
            name: user.name,
            email: user.email,
            password_hash: passwordHash,
            role: user.role,
            student_id: user.student_id,
            mentor_id: user.mentor_id,
            company_id: user.company_id,
            extraInfo
          });

          const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
          return res.status(201).json({ success: true, token, user, databasePersisted: true });
        }
      } catch (pgErr) {
        console.warn("PostgreSQL insertion error, writing to persistent database file:", pgErr.message);
      }
    }

    // Persist directly into local database file
    const persistedUser = db.insertUser({
      name,
      email: cleanEmail,
      password_hash: passwordHash,
      role,
      extraInfo
    });

    const token = jwt.sign({ userId: persistedUser.id, role: persistedUser.role, email: persistedUser.email }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: persistedUser.id,
        name: persistedUser.name,
        email: persistedUser.email,
        role: persistedUser.role,
        studentId: persistedUser.student_id,
        mentorId: persistedUser.mentor_id,
        companyId: persistedUser.company_id
      },
      databasePersisted: true
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register user in database", details: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const pool = db.getPool();
    if (pool) {
      const result = await db.query(
        `SELECT id, name, email, password_hash, role, student_id, mentor_id, company_id
        FROM users WHERE email = $1`,
        [cleanEmail]
      );

      if (result && result.rows && result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
          const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
          return res.json({
            success: true,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              studentId: user.student_id,
              mentorId: user.mentor_id,
              companyId: user.company_id
            }
          });
        } else {
          return res.status(401).json({ error: "Invalid email or password" });
        }
      }
    }
  } catch (error) {
    console.warn("PostgreSQL login notice:", error.message);
  }

  // Lookup in persistent database file
  const user = db.findUserByEmail(cleanEmail);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.student_id,
      mentorId: user.mentor_id,
      companyId: user.company_id
    }
  });
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error)
      return res.status(403).json({ error: "Token invalid or expired" });
    
    try {
      const pool = db.getPool();
      if (pool) {
        const result = await db.query(
          `SELECT id, name, email, role, student_id, mentor_id, company_id
          FROM users WHERE id = $1`,
          [decoded.userId]
        );

        if (result && result.rows && result.rows.length > 0) {
          return res.json({ user: result.rows[0] });
        }
      }
    } catch (error) {
      console.warn("PostgreSQL auth/me error:", error.message);
    }

    const fileUser = db.findUserById(decoded.userId);
    if (fileUser) {
      return res.json({
        user: {
          id: fileUser.id,
          name: fileUser.name,
          email: fileUser.email,
          role: fileUser.role,
          studentId: fileUser.student_id,
          mentorId: fileUser.mentor_id,
          companyId: fileUser.company_id
        }
      });
    }

    return res.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role || "student",
        name: decoded.name || "Student User"
      }
    });
  });
});

/* ================= STUDENT ================= */
app.get("/api/student", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, course, batch, target_role, career_readiness, experience_score FROM students LIMIT 1"
    );
    if (result && result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return res.json({
        id: row.id,
        name: row.name,
        course: row.course,
        batch: row.batch,
        targetRole: row.target_role,
        careerReadiness: row.career_readiness,
        experienceScore: row.experience_score
      });
    }
  } catch (err) {
    console.warn("DB query notice in /api/student:", err.message);
  }

  const localDb = db.readLocalDb();
  const s = localDb.students && localDb.students.length > 0 ? localDb.students[0] : {
    id: 1,
    name: "Adarsh Pratap Singh",
    course: "CSIT",
    batch: "2025-29",
    target_role: "Full Stack Software Engineer",
    career_readiness: 81,
    experience_score: 64
  };

  res.json({
    id: s.id,
    name: s.name,
    course: s.course,
    batch: s.batch,
    targetRole: s.target_role || s.targetRole,
    careerReadiness: s.career_readiness || s.careerReadiness || 81,
    experienceScore: s.experience_score || s.experienceScore || 64
  });
});

/* ================= MENTORS ================= */
app.get("/api/mentors", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, role, company, experience_years, availability FROM mentors ORDER BY id ASC"
    );
    if (result && result.rows && result.rows.length > 0) {
      const mapped = result.rows.map((m, idx) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        company: m.company,
        experience: m.experience_years,
        match: 94 - idx * 3,
        availability: m.availability
      }));
      return res.json(mapped);
    }
  } catch (err) {
    console.warn("DB query notice in /api/mentors:", err.message);
  }

  const localDb = db.readLocalDb();
  const mentors = localDb.mentors || [];
  const mapped = mentors.map((m, idx) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    company: m.company,
    experience: m.experience_years || m.experience,
    match: 94 - idx * 3,
    availability: m.availability !== false
  }));
  res.json(mapped);
});

/* ================= BEST MENTOR ================= */
app.get("/api/mentors/best-match", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, role, company, experience_years, availability FROM mentors ORDER BY experience_years DESC LIMIT 1"
    );
    if (result && result.rows && result.rows.length > 0) {
      const m = result.rows[0];
      return res.json({
        id: m.id,
        name: m.name,
        role: m.role,
        company: m.company,
        experience: m.experience_years,
        match: 94
      });
    }
  } catch (err) {
    console.warn("DB query notice in /api/mentors/best-match:", err.message);
  }

  const localDb = db.readLocalDb();
  const mentors = localDb.mentors || [];
  if (mentors.length > 0) {
    const sorted = [...mentors].sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0));
    const m = sorted[0];
    return res.json({
      id: m.id,
      name: m.name,
      role: m.role,
      company: m.company,
      experience: m.experience_years || m.experience,
      match: 94
    });
  }

  res.json({
    id: 1,
    name: "Rohan Mehta",
    role: "Senior Software Architect",
    company: "TechNova Labs",
    experience: 12,
    match: 94
  });
});

/* ================= POST MENTOR ================= */
app.post("/api/mentors", async (req, res) => {
  const { name, role, company, experience_years, availability } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Mentor name is required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO mentors (name, role, company, experience_years, availability)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, role, company, experience_years, availability`,
      [
        name,
        role || "Mentor",
        company || "Industry Partner",
        Number(experience_years) || 5,
        availability !== undefined ? Boolean(availability) : true
      ]
    );

    if (result && result.rows && result.rows.length > 0) {
      const m = result.rows[0];
      return res.status(201).json({
        success: true,
        mentor: {
          id: m.id,
          name: m.name,
          role: m.role,
          company: m.company,
          experience: m.experience_years,
          match: 92,
          availability: m.availability
        }
      });
    }
  } catch (err) {
    console.warn("DB insert notice in /api/mentors:", err.message);
  }

  const localDb = db.readLocalDb();
  const newMentor = {
    id: localDb.mentors.length > 0 ? Math.max(...localDb.mentors.map(m => m.id)) + 1 : 1,
    name,
    role: role || "Mentor",
    company: company || "Industry Partner",
    experience_years: Number(experience_years) || 5,
    availability: availability !== undefined ? Boolean(availability) : true
  };
  localDb.mentors.push(newMentor);
  db.writeLocalDb(localDb);

  res.status(201).json({
    success: true,
    mentor: {
      id: newMentor.id,
      name: newMentor.name,
      role: newMentor.role,
      company: newMentor.company,
      experience: newMentor.experience_years,
      match: 92,
      availability: newMentor.availability
    }
  });
});

/* ================= GIGS ================= */
app.get("/api/gigs", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT g.id, g.title, g.description, g.required_skill, g.duration_hours, g.payment, g.status,
              COALESCE(c.company_name, 'SkillBridge Partner') AS company
       FROM gigs g
       LEFT JOIN companies c ON g.company_id = c.id
       ORDER BY g.id ASC`
    );
    if (result && result.rows && result.rows.length > 0) {
      const mapped = result.rows.map((g) => ({
        id: g.id,
        title: g.title,
        company: g.company,
        skill: g.required_skill,
        hours: g.duration_hours,
        payment: Number(g.payment),
        status: g.status
      }));
      return res.json(mapped);
    }
  } catch (err) {
    console.warn("DB query notice in /api/gigs:", err.message);
  }

  const localDb = db.readLocalDb();
  const gigs = localDb.gigs || [];
  const mapped = gigs.map(g => ({
    id: g.id,
    title: g.title,
    company: g.company || "SkillBridge Partner",
    skill: g.required_skill || g.skill || "General",
    hours: g.duration_hours || g.hours || 3,
    payment: Number(g.payment || 1500),
    status: g.status || "open"
  }));
  res.json(mapped);
});

/* ================= POST NEW GIG ================= */
app.post("/api/gigs", async (req, res) => {
  const { title, requiredSkill, hours, payment, description, companyId } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Gig title is required" });
  }

  try {
    const result = await db.query(
      `INSERT INTO gigs (company_id, title, description, required_skill, duration_hours, payment, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'open')
       RETURNING id, company_id, title, description, required_skill, duration_hours, payment, status, created_at`,
      [companyId || 1, title, description || "Industry micro-internship task", requiredSkill || "General", Number(hours) || 3, Number(payment) || 1500]
    );

    if (result && result.rows && result.rows.length > 0) {
      const g = result.rows[0];
      return res.status(201).json({
        success: true,
        gig: {
          id: g.id,
          title: g.title,
          company: "TechNova Labs",
          skill: g.required_skill,
          hours: g.duration_hours,
          payment: Number(g.payment),
          status: g.status
        }
      });
    }
  } catch (err) {
    console.warn("DB insert notice in /api/gigs:", err.message);
  }

  const localDb = db.readLocalDb();
  const newGig = {
    id: localDb.gigs.length > 0 ? Math.max(...localDb.gigs.map(g => g.id)) + 1 : 1,
    company_id: companyId || 1,
    title,
    description: description || "Industry micro-internship task",
    required_skill: requiredSkill || "General",
    duration_hours: Number(hours) || 3,
    payment: Number(payment) || 1500,
    status: "open",
    company: "TechNova Labs"
  };
  localDb.gigs.push(newGig);
  db.writeLocalDb(localDb);

  res.status(201).json({
    success: true,
    gig: {
      id: newGig.id,
      title: newGig.title,
      company: newGig.company,
      skill: newGig.required_skill,
      hours: newGig.duration_hours,
      payment: newGig.payment,
      status: newGig.status
    }
  });
});

/* ================= APPLY GIG ================= */
app.post("/api/gigs/apply", async (req, res) => {
  const { studentId, gigId, message } = req.body;

  if (!studentId || !gigId) {
    return res.status(400).json({
      error: "studentId and gigId are required"
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO gig_applications (gig_id, student_id, message, status)
       VALUES ($1, $2, $3, 'submitted')
       RETURNING id, gig_id, student_id, message, status, created_at`,
      [gigId, studentId, message || ""]
    );
    if (result && result.rows && result.rows.length > 0) {
      const appRecord = result.rows[0];
      return res.status(201).json({
        success: true,
        applicationId: "APP-" + appRecord.id,
        dbId: appRecord.id,
        message: "Application submitted and stored in PostgreSQL",
        studentId: appRecord.student_id,
        gigId: appRecord.gig_id,
        applicantMessage: appRecord.message
      });
    }
  } catch (err) {
    console.warn("DB insert notice in /api/gigs/apply:", err.message);
  }

  const localDb = db.readLocalDb();
  const nextAppId = (localDb.gig_applications?.length || 0) + 1;
  const newApp = {
    id: nextAppId,
    gig_id: gigId,
    student_id: studentId,
    message: message || "",
    status: "submitted",
    created_at: new Date().toISOString()
  };
  if (!localDb.gig_applications) localDb.gig_applications = [];
  localDb.gig_applications.push(newApp);
  db.writeLocalDb(localDb);

  res.status(201).json({
    success: true,
    applicationId: "APP-" + nextAppId,
    message: "Application submitted successfully",
    studentId,
    gigId,
    applicantMessage: message || ""
  });
});

/* ================= MENTOR BOOKING ================= */
app.post("/api/mentors/book", async (req, res) => {
  const { studentId, mentorId, date, time } = req.body;

  if (!studentId || !mentorId || !date || !time) {
    return res.status(400).json({
      error: "Complete booking information is required"
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO mentor_bookings (student_id, mentor_id, session_date, session_time, duration_minutes, status)
       VALUES ($1, $2, $3, $4, 15, 'pending')
       RETURNING id, student_id, mentor_id, session_date, session_time, status`,
      [studentId, mentorId, date, time]
    );
    if (result && result.rows && result.rows.length > 0) {
      const b = result.rows[0];
      return res.status(201).json({
        success: true,
        bookingId: "MENTOR-" + b.id,
        dbId: b.id,
        status: b.status,
        durationMinutes: 15,
        studentId: b.student_id,
        mentorId: b.mentor_id,
        date: b.session_date,
        time: b.session_time
      });
    }
  } catch (err) {
    console.warn("DB insert notice in /api/mentors/book:", err.message);
  }

  const localDb = db.readLocalDb();
  const nextBookingId = (localDb.mentor_bookings?.length || 0) + 1;
  const newBooking = {
    id: nextBookingId,
    student_id: studentId,
    mentor_id: mentorId,
    session_date: date,
    session_time: time,
    duration_minutes: 15,
    status: "pending",
    created_at: new Date().toISOString()
  };
  if (!localDb.mentor_bookings) localDb.mentor_bookings = [];
  localDb.mentor_bookings.push(newBooking);
  db.writeLocalDb(localDb);

  res.status(201).json({
    success: true,
    bookingId: "MENTOR-" + nextBookingId,
    status: "pending",
    durationMinutes: 15,
    studentId,
    mentorId,
    date,
    time
  });
});

/* ================= EXPERIENCE PASSPORT ================= */
app.get("/api/passport", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT er.id, er.title, er.experience_type, er.verified, er.score, er.created_at,
              COALESCE(c.company_name, 'SkillBridge Partner') AS company
       FROM experience_records er
       LEFT JOIN companies c ON er.company_id = c.id
       ORDER BY er.id DESC`
    );
    if (result && result.rows && result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch (err) {
    console.warn("DB query notice in /api/passport:", err.message);
  }

  const localDb = db.readLocalDb();
  res.json(localDb.experience_records || [
    {
      id: 1,
      title: "Backend API Micro-Internship",
      company: "CloudSphere Systems",
      experience_type: "Gig Completion",
      verified: true,
      score: 85
    }
  ]);
});

/* ================= CAREER ANALYSIS ================= */
app.get("/api/ai/career-analysis", (req, res) => {
  res.json({
    student: "Adarsh Pratap Singh",
    recommendedRole: "Full Stack Software Engineer",
    compatibility: 87,
    placementReadiness: 91,
    strongestSkill: "Git & Collaboration",
    priorityGap: "Backend Architecture",
    recommendation: [
      "Complete backend micro-gig",
      "Attend system design mentor capsule",
      "Deploy authenticated REST API"
    ]
  });
});

/* ================= SKILL GAP ================= */
app.get("/api/ai/skill-gaps", (req, res) => {
  res.json({
    gaps: [
      {
        skill: "Backend Architecture",
        severity: "Critical",
        current: 42,
        required: 92
      },
      {
        skill: "REST API Design",
        severity: "High",
        current: 55,
        required: 86
      },
      {
        skill: "Database Optimization",
        severity: "Medium",
        current: 61,
        required: 88
      },
      {
        skill: "Cloud Deployment",
        severity: "Medium",
        current: 57,
        required: 78
      }
    ]
  });
});

/* ================= AI HELP DESK & ADVISOR (GEMINI POWERED) ================= */
const { GoogleGenAI } = require("@google/genai");

let genAiClient = null;
function getGenAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!genAiClient && apiKey && typeof apiKey === "string" && apiKey.trim().length > 5) {
    try {
      genAiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e.message);
    }
  }
  return genAiClient;
}

// Fallback intelligent problem-solver engine
function generateLocalHelpdeskResponse(message, category = "general", studentProfile = {}) {
  const lower = (message || "").toLowerCase();
  const studentName = studentProfile.name || "Adarsh";
  const targetRole = studentProfile.targetRole || "Full Stack Software Engineer";

  if (lower.includes("jwt") || lower.includes("token") || lower.includes("auth") || lower.includes("unauthorized") || lower.includes("login")) {
    return {
      reply: `### 🔐 Authentication & JWT Diagnostic

Here are the exact steps to resolve JWT & authentication issues in your project:

1. **Verify Authorization Header Format**: Ensure your client sends \`headers: { "Authorization": "Bearer <token>" }\` with the single space after \`Bearer\`.
2. **Handle Secret Consistency**: Confirm the \`JWT_SECRET\` environment variable on the server matches the signature key used during token creation (\`jwt.sign(payload, secret, { expiresIn: '7d' })\`).
3. **Check Token Expiration**: If you receive a \`TokenExpiredError\`, clear your client's stored token (\`localStorage.removeItem('skillbridge_token')\`) and re-authenticate.
4. **CORS & Credentials**: If calling APIs across origins, ensure \`cors()\` middleware is applied before your route handlers.

💡 **SkillBridge Pro-Tip**: Check our **Micro-Internship Gig #2: Build an Authenticated REST API** to practice hands-on token verification and earn a verified passport credential.`,
      suggestions: [
        "How do I securely store tokens in the browser?",
        "Show me an Express JWT authentication middleware snippet",
        "Book a 15-min mentor capsule to review my auth architecture"
      ]
    };
  }

  if (lower.includes("db") || lower.includes("postgres") || lower.includes("sql") || lower.includes("database") || lower.includes("connection") || lower.includes("econnrefused")) {
    return {
      reply: `### 🗄️ Database & PostgreSQL Troubleshooting Guide

Here is a quick diagnostic checklist for database connection and query errors:

1. **Connection String Syntax**: Standard PostgreSQL connection string format is \`postgresql://user:password@host:port/database\`. Ensure special characters in passwords are URL-encoded.
2. **Connection Pooling**: Use \`pg.Pool\` instead of single \`Client\` instances. Set reasonable pool limits (\`max: 10, idleTimeoutMillis: 30000\`) to avoid connection exhaustion in serverless or containerized environments.
3. **Cloud SSL Configuration**: If connecting to a cloud-hosted Postgres instance, add \`ssl: { rejectUnauthorized: false }\` inside your \`new Pool({ ... })\` config.
4. **Parameterized Queries**: Always use parameter placeholders (\`$1, $2\`) instead of string interpolation to prevent SQL injection vulnerabilities.

💡 **SkillBridge Next Step**: You can run practice queries in the **Skill Intelligence** module or ask an industry architect in a 15-minute 1-on-1 session!`,
      suggestions: [
        "How do I prevent database connection timeouts?",
        "Show an example pg.Pool setup with SSL",
        "Which micro-gigs give verified database experience?"
      ]
    };
  }

  if (lower.includes("gig") || lower.includes("micro-internship") || lower.includes("task") || lower.includes("stuck") || lower.includes("submission") || lower.includes("payment")) {
    return {
      reply: `### 💼 Micro-Internship Task Resolution Playbook

If you are facing obstacles with your micro-internship gig, follow this roadmap:

1. **Break Down the Requirement**: Re-read the task deliverable specifications on the Gig Board. Focus on getting a minimal viable prototype running first.
2. **Review Code Architecture**: Ensure your component or API conforms to industry conventions (modular directory structure, clear naming, error-handling middleware).
3. **Self-Verification**: Write quick test cases or test your endpoints using curl/Postman to ensure all edge cases are handled before submission.
4. **Submit with Clear Documentation**: When applying or submitting deliverables, include a brief summary of how you solved the problem and a link to your repository/live demo.

🚀 **Need a second pair of eyes?** You can book a 15-minute capsule with a Senior Mentor from TechNova Labs or CloudSphere to review your pull request!`,
      suggestions: [
        "What should I include in my gig application message?",
        "How does Experience Passport verification score work?",
        "Explore open high-paying micro-gigs"
      ]
    };
  }

  if (lower.includes("mentor") || lower.includes("capsule") || lower.includes("interview") || lower.includes("meeting") || lower.includes("prepare")) {
    return {
      reply: `### 🎯 15-Minute Mentor Capsule Preparation Checklist

Maximize your 15-minute rapid mentoring session with industry leaders:

1. **The 3-Minute Context**: Introduce yourself concisely: name, current focus (${targetRole}), and the exact blocker you are tackling today.
2. **Have Code / Architecture Ready**: Have your GitHub repository, diagram, or error log open in a tab for instant screen sharing.
3. **Ask High-Leverage Questions**:
   - *"How would you architect this microservice for 100k daily users?"*
   - *"What are the top 2 red flags you see in junior developer portfolios?"*
   - *"Which specific design pattern would simplify this state logic?"*
4. **Action Items & Follow-up**: Take notes during the call and document your key takeaways to post on your Experience Passport.

💡 **Ready to schedule?** Check out **AI Mentorship Matchmaker** to find verified mentors with open slots!`,
      suggestions: [
        "Give me 5 great questions to ask a Senior Software Architect",
        "How to follow up with a mentor after the call?",
        "Show available mentors this week"
      ]
    };
  }

  if (lower.includes("readiness") || lower.includes("score") || lower.includes("career") || lower.includes("resume") || lower.includes("gap") || lower.includes("roadmap")) {
    return {
      reply: `### 📈 Career Readiness & Profile Optimization Strategy

To boost your Career Readiness index toward 90%+:

1. **Target the Priority Gap**: Your primary growth vector is currently **Backend Architecture & System Design**. Completing 1-2 verified micro-gigs in this area will yield +12 to +18 points.
2. **Verified Artifacts on Passport**: Recruiters prioritize verified proof over self-claimed skills. Each completed gig or mentor assessment adds a cryptographically verifiable badge to your Experience Passport.
3. **Continuous AI Assessments**: Take our interactive skill gap assessment bi-weekly to recalibrate your AI Career Twin with recent project milestones.
4. **Target Role Alignment**: For **${targetRole}**, master REST/GraphQL design, relational schema modeling, Docker fundamentals, and CI/CD pipelines.

🌟 **Action Recommendation**: Head to the **Skill Intelligence** tab to view your full benchmark analysis!`,
      suggestions: [
        "What are the top backend skills in demand right now?",
        "How do I prepare for technical coding interviews?",
        "Run another AI Career Twin benchmark"
      ]
    };
  }

  // Default response
  return {
    reply: `Hello **${studentName}**! I am your **SkillBridge AI Help Desk & Career Assistant**. 

I am here 24/7 to help you resolve any obstacles, bugs, or questions coming in your way, including:

- 🐛 **Technical & Coding Bugs**: Debugging Node.js, Express, React, PostgreSQL, REST APIs, and JWT auth errors.
- 💼 **Micro-Internships & Gigs**: Clarifying task deliverables, submission checklists, and company expectations.
- 🎓 **Mentorship Guidance**: Structuring your 15-minute capsule questions and connecting with industry leaders.
- 📊 **Career Twin & Skill Gaps**: Roadmap recommendations to reach 90%+ placement readiness.

Feel free to describe the exact issue or error message you're experiencing!`,
    suggestions: [
      "I'm getting an error with my database connection",
      "How can I prepare for a 15-minute mentor session?",
      "How do I boost my career readiness score?",
      "I'm stuck on a micro-internship task"
    ]
  };
}

/* ================= POST AI HELPDESK CHAT ================= */
app.post("/api/ai/helpdesk/chat", async (req, res) => {
  const { message, history = [], category = "general", studentProfile = {} } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const userQuery = message.trim();
  const studentName = studentProfile.name || "Student";
  const targetRole = studentProfile.targetRole || "Full Stack Software Engineer";
  const readiness = studentProfile.careerReadiness || 81;

  // Attempt Gemini API via @google/genai SDK
  const ai = getGenAiClient();
  if (ai) {
    try {
      const systemInstruction = `You are the SkillBridge AI Help Desk & Technical Career Counselor. SkillBridge AI is an Industry Career OS connecting university students with verified industry mentors, micro-internship gigs, and employer placement pipelines.
User details: Name: ${studentName}, Target Role: ${targetRole}, Career Readiness: ${readiness}%.
Category context: ${category}.

Your goals:
1. Act as an empathetic, razor-sharp technical and career counselor.
2. Directly answer problems, coding errors, architecture questions, career roadblocks, resume concerns, and platform questions.
3. Provide step-by-step troubleshooting, concise and clean code snippets where relevant, and practical next steps.
4. Reference SkillBridge ecosystem features naturally when helpful (e.g. 15-Minute Mentorship Capsules, Micro-Internship Gig Board, Skill Intelligence assessments, Experience Passport).
5. Format your output cleanly in Markdown with bold titles, bullet points, and code blocks.`;

      // Build conversation contents for Gemini
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        // Take up to last 6 messages
        const recent = history.slice(-6);
        for (const msg of recent) {
          if (msg.sender === "user") {
            contents.push({ role: "user", parts: [{ text: msg.text }] });
          } else if (msg.sender === "ai" || msg.sender === "assistant") {
            contents.push({ role: "model", parts: [{ text: msg.text }] });
          }
        }
      }
      contents.push({ role: "user", parts: [{ text: userQuery }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 1000
        }
      });

      const replyText = response && response.text ? response.text : null;
      if (replyText) {
        return res.json({
          reply: replyText,
          suggestions: [
            "What is the next step to practice this?",
            "Can you provide a code example for this?",
            "How do I review this with my mentor?"
          ],
          source: "gemini",
          timestamp: new Date().toISOString()
        });
      }
    } catch (geminiErr) {
      console.warn("Gemini Help Desk request failed, using intelligent fallback:", geminiErr.message);
    }
  }

  // Fallback Rule & Domain Engine
  const localRes = generateLocalHelpdeskResponse(userQuery, category, studentProfile);
  res.json({
    reply: localRes.reply,
    suggestions: localRes.suggestions,
    source: "counselor-engine",
    timestamp: new Date().toISOString()
  });
});

/* ================= GET AI HELPDESK FAQS ================= */
app.get("/api/ai/helpdesk/faq", (req, res) => {
  res.json({
    categories: [
      { id: "all", label: "All Topics", icon: "🌐" },
      { id: "gigs", label: "Micro-Internships", icon: "💼" },
      { id: "technical", label: "Technical & Coding", icon: "💻" },
      { id: "mentorship", label: "Mentor Capsules", icon: "🎓" },
      { id: "career", label: "Career & Readiness", icon: "🚀" }
    ],
    faqs: [
      {
        id: 1,
        category: "gigs",
        question: "How do I get paid and earn verified credit for micro-internships?",
        answer: "When you complete an industry gig, your pull request and deliverable are reviewed by the partner company. Upon approval, payment is credited to your linked payout account and a verified badge is minted directly to your Experience Passport."
      },
      {
        id: 2,
        category: "technical",
        question: "What should I do if my PostgreSQL connection times out or fails?",
        answer: "Verify your connection string syntax, ensure cloud SSL is configured with `{ rejectUnauthorized: false }`, and verify that your IP is whitelisted if using a hosted instance like Cloud SQL or Neon."
      },
      {
        id: 3,
        category: "mentorship",
        question: "How do 15-minute capsule mentorship sessions work?",
        answer: "Capsules are laser-focused 1-on-1 sprint sessions designed for targeted code review, architecture feedback, or placement strategy. Come prepared with 2-3 specific questions and your repository ready for screen sharing."
      },
      {
        id: 4,
        category: "career",
        question: "How is my Career Readiness score calculated?",
        answer: "The AI Career Twin analyzes your verified gig completions (40%), mentorship capsule reviews (25%), technical assessment score (20%), and profile activity (15%) to benchmark your percentile against actual industry hiring bars."
      },
      {
        id: 5,
        category: "technical",
        question: "How do I resolve JWT TokenExpiredError in full-stack apps?",
        answer: "Implement a refresh token flow or re-authenticate the user on 401 responses. Make sure client requests check `localStorage` validity before making API calls."
      }
    ]
  });
});

/* ================= POST CREATE HELPDESK TICKET ================= */
app.post("/api/ai/helpdesk/ticket", async (req, res) => {
  const { title, category, description, priority = "medium", studentId = 1 } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  // Generate initial AI diagnosis
  let aiSummary = "Our AI system has logged your issue and generated a step-by-step resolution plan. Review the recommendations below.";
  try {
    const ai = getGenAiClient();
    if (ai) {
      const prompt = `A student opened a support ticket: Title: "${title}", Category: "${category}", Description: "${description}". Provide a brief 2-sentence immediate diagnosis and recommended first step.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt
      });
      if (response && response.text) {
        aiSummary = response.text.trim();
      }
    }
  } catch (e) {
    console.warn("AI ticket diagnosis notice:", e.message);
  }

  const localDb = db.readLocalDb();
  if (!localDb.helpdesk_tickets) localDb.helpdesk_tickets = [];

  const newTicket = {
    id: localDb.helpdesk_tickets.length > 0 ? Math.max(...localDb.helpdesk_tickets.map(t => t.id)) + 1 : 1,
    student_id: studentId,
    title,
    category: category || "general",
    description,
    priority: priority.toLowerCase(),
    status: "open",
    ai_summary: aiSummary,
    created_at: new Date().toISOString()
  };

  localDb.helpdesk_tickets.unshift(newTicket);
  db.writeLocalDb(localDb);

  res.status(201).json({
    success: true,
    ticket: newTicket,
    message: "Ticket created and AI diagnostic generated"
  });
});

/* ================= GET HELPDESK TICKETS ================= */
app.get("/api/ai/helpdesk/tickets", (req, res) => {
  const localDb = db.readLocalDb();
  const tickets = localDb.helpdesk_tickets || [];
  res.json(tickets);
});

/* ================= API 404 HANDLER (MUST BE BEFORE STATIC FALLBACK) ================= */
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
});

/* ================= STATIC FILES ================= */
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ================= START SERVER ================= */
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`SkillBridge AI running on http://0.0.0.0:${PORT}`);
  if (process.env.DATABASE_URL) {
    await db.initializeDatabase();
  }
});
