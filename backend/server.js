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
const JWT_SECRET = process.env.JWT_SECRET || "skillbridge-secret-key-2026"

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
      engine: "PostgreSQL",
      ...dbStatus
    }
  });
});
/* ===========AUTHENTICATION ROUTES ========== */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, extraInfo } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" })
  }

  try {
    const existing = await db.query("SELECT id FROM users WHERE email = $1",
    [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists"});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let studentID = null;
    let mentorID = null;
    let companyID = null;

    if (role == "student") {
      const sRes = await db.query(
        `INSERT INTO students (name, course, batch, target_role, career_readiness, experience_score)
          VALUES ($1, $2, $3, $4, 65, 45) RETURNING id`,
          [name, extraInfo?.course || "CSIT", extraInfo?.batch || "2025-29", extraInfo?.targetRole || "Software Engineer" ]
      );

      studentID = sRes.rows[0].id;
    } else if (role === "mentor" ) {
      const mRes = await db.query(
        `INSERT INTO mentors (name, role, company, experience_years, availability)
        VALUES ($1, $2, $3, $4, true) RETURNING id`,
        [name, extraInfo?.jobRole || "Industry Mentor", extraInfo?.company || "Independent", Number(extraInfo?.experience) || 5]
      );
      mentorID = mRes.rows[0].id;
    } else if (role == "company") {
      const cRes = await db.query(
        `INSERT INTO companies (name, industry, location, verified)
        VALUES ($1, $2, $3, true) RETURNING id`,
        [name, extraInfo?.industry || "Technology", extraInfo?.location || "Remote"]
      );
      companyID = cRes.rows[0].id;
    }

    const uRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, student_id, mentor_id, company_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, role, student_id, mentor_id, company_id`,
      [name, email.toLowerCase().trim(), passwordHash, role, studentID, mentorID, companyID]
    )

    const user = uRes.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({success: true, token, user});
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({error: "Failed to register user"});
  }
})

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await db.query(
      `SELECT id, name, email, password_hash, role, student_id, mentor_id, company_id
      FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
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
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ error: "Server login error" });
  }
})

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error)
      return res.status(403).json({ error: "Token invalid or expired" });
    
    try {
      const result = await db.query(
        `SELECT id, name, email, role, student_id, mentor_id, company_id
        FROM users WHERE id = $1`,
        [decoded.userId]
      );

      if (result.rows.length === 0)
        return res.status(404).json({ error: "User not found"});
      res.json({ user: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  })
})

/* ================= STUDENT ================= */
app.get("/api/student", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, course, batch, target_role, career_readiness, experience_score FROM students LIMIT 1"
    );
    if (result && result.rows.length > 0) {
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
    console.error("DB query error in /api/student:", err.message);
  }

  res.json({
    id: 1,
    name: "Adarsh Pratap Singh",
    course: "CSIT",
    batch: "2025-29",
    targetRole: "Full Stack Software Engineer",
    careerReadiness: 81,
    experienceScore: 64
  });
});

/* ================= MENTORS ================= */
app.get("/api/mentors", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, role, company, experience_years, availability FROM mentors ORDER BY id ASC"
    );
    if (result && result.rows) {
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
    return res.json([]);
  } catch (err) {
    console.error("DB query error in /api/mentors:", err.message);
    return res.status(500).json({ error: "Failed to fetch mentors from database" });
  }
});

/* ================= BEST MENTOR ================= */
app.get("/api/mentors/best-match", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, role, company, experience_years, availability FROM mentors ORDER BY experience_years DESC LIMIT 1"
    );
    if (result && result.rows.length > 0) {
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
    return res.status(404).json({ error: "No mentors found in database" });
  } catch (err) {
    console.error("DB query error in /api/mentors/best-match:", err.message);
    return res.status(500).json({ error: "Database error fetching best mentor match" });
  }
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

    if (result && result.rows.length > 0) {
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
    console.error("DB insert error in /api/mentors:", err.message);
  }

  res.status(201).json({
    success: true,
    mentor: {
      id: Date.now(),
      name,
      role: role || "Mentor",
      company: company || "Industry Partner",
      experience: Number(experience_years) || 5,
      match: 92,
      availability: availability !== undefined ? Boolean(availability) : true
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
    if (result && result.rows) {
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
    return res.json([]);
  } catch (err) {
    console.error("DB query error in /api/gigs:", err.message);
    return res.status(500).json({ error: "Failed to fetch gigs from database" });
  }
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

    if (result && result.rows.length > 0) {
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
    console.error("DB insert error in /api/gigs:", err.message);
  }

  res.status(201).json({
    success: true,
    gig: {
      id: Date.now(),
      title,
      company: "SkillBridge Partner",
      skill: requiredSkill || "General",
      hours: Number(hours) || 3,
      payment: Number(payment) || 1500,
      status: "open"
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
    if (result && result.rows.length > 0) {
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
    console.error("DB insert error in /api/gigs/apply:", err.message);
  }

  res.status(201).json({
    success: true,
    applicationId: "APP-" + Date.now(),
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
    if (result && result.rows.length > 0) {
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
    console.error("DB insert error in /api/mentors/book:", err.message);
  }

  res.status(201).json({
    success: true,
    bookingId: "MENTOR-" + Date.now(),
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
    if (result && result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch (err) {
    console.error("DB query error in /api/passport:", err.message);
  }

  res.json([
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
