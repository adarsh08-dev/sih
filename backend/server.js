const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
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
    const pgUsers = await db.query(
      "SELECT id, name, email, role, student_id, mentor_id, company_id, created_at FROM users ORDER BY id ASC"
    );
    return res.json({
      success: true,
      database: "PostgreSQL",
      count: pgUsers.rows.length,
      users: pgUsers.rows
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to read database users", details: err.message });
  }
});

/* =========== AUTHENTICATION ROUTES ========== */
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role = "student", extraInfo } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanEmail = email.toLowerCase().trim();
  const userName = name || cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  try {
    const result = await db.registerUser({ name: userName, email: cleanEmail, password, role, extraInfo });
    return res.status(201).json(result);
  } catch (error) {
    // If user already exists, check if password matches for seamless sign-in
    if (error.message.includes("already exists")) {
      try {
        const loginRes = await db.loginUser({ email: cleanEmail, password });
        return res.json({
          ...loginRes,
          message: "Welcome back! Signed in to your existing account."
        });
      } catch (loginErr) {
        return res.status(400).json({
          error: "An account with this email already exists. Please enter the correct password to sign in.",
          code: "USER_EXISTS"
        });
      }
    }
    return res.status(400).json({ error: error.message, code: "REGISTER_ERROR" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password, autoRegister } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const result = await db.loginUser({ email: cleanEmail, password });
    return res.json(result);
  } catch (error) {
    // If account not found and autoRegister is enabled (or user requested instant access), register them smoothly
    if (error.message.includes("No account found") && autoRegister) {
      try {
        const defaultName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        const result = await db.registerUser({
          name: defaultName || "Student Member",
          email: cleanEmail,
          password,
          role: "student"
        });
        return res.status(201).json({
          ...result,
          message: "Account created and logged in successfully."
        });
      } catch (regErr) {
        return res.status(400).json({ error: regErr.message, code: "REGISTER_ERROR" });
      }
    }

    const statusCode = error.message.includes("No account found") || error.message.includes("Invalid email") ? 401 : 400;
    return res.status(statusCode).json({
      error: error.message,
      code: error.message.includes("No account found") ? "USER_NOT_FOUND" : "INVALID_CREDENTIALS"
    });
  }
});

app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Token invalid or expired" });
    }
    
    try {
      const user = db.getUserById(decoded.userId);
      if (user) {
        return res.json({ user });
      }
      return res.status(404).json({ error: "User not found" });
    } catch (err) {
      return res.status(500).json({ error: "Database error", details: err.message });
    }
  });
});

/* ================= STUDENT ================= */
app.get("/api/student", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, course, batch, target_role, career_readiness, experience_score FROM students ORDER BY id ASC LIMIT 1"
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

  res.json([
    { id: 1, name: "Rohan Mehta", role: "Senior Software Architect", company: "TechNova Labs", experience: 12, match: 94, availability: true },
    { id: 2, name: "Priya Sharma", role: "Engineering Manager", company: "CloudSphere", experience: 10, match: 91, availability: true },
    { id: 3, name: "Arjun Kapoor", role: "AI/ML Lead", company: "DataSphere AI", experience: 14, match: 88, availability: true }
  ]);
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

  res.json({
    id: 1,
    name: "Rohan Mehta",
    role: "Senior Software Architect",
    company: "TechNova Labs",
    experience: 12,
    match: 94
  });
});

/* ================= MENTORS ================= */
app.get("/api/mentors", (req, res) => {
  try {
    const mentors = db.getMentors();
    return res.json(mentors);
  } catch (err) {
    console.error("Error in /api/mentors:", err.message);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
});

app.post("/api/mentors", (req, res) => {
  const { name, role, company, experience_years, experience, availability } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Mentor name is required" });
  }

  try {
    const mentor = db.createMentor({
      name,
      role,
      company,
      experience: experience || experience_years,
      availability
    });
    return res.status(201).json({ success: true, mentor });
  } catch (err) {
    console.error("DB insert error in /api/mentors:", err.message);
    res.status(500).json({ error: "Failed to create mentor", details: err.message });
  }
});

/* ================= GIGS ================= */
app.get("/api/gigs", (req, res) => {
  try {
    const gigs = db.getGigs();
    return res.json(gigs);
  } catch (err) {
    console.error("Error in /api/gigs:", err.message);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

/* ================= POST NEW GIG ================= */
app.post("/api/gigs", (req, res) => {
  const { title, requiredSkill, skill, hours, payment, description, companyId, company } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Gig title is required" });
  }

  try {
    const newGig = db.createGig({
      title,
      requiredSkill: requiredSkill || skill,
      hours,
      payment,
      description,
      company,
      companyId
    });
    return res.status(201).json({
      success: true,
      gig: newGig
    });
  } catch (err) {
    console.error("DB insert error in /api/gigs:", err.message);
    res.status(500).json({ error: "Failed to add gig", details: err.message });
  }
});

/* ================= APPLY GIG ================= */
app.post("/api/gigs/apply", (req, res) => {
  const { studentId, gigId, message, githubRepo } = req.body;

  if (!gigId) {
    return res.status(400).json({
      error: "gigId is required"
    });
  }

  try {
    const application = db.applyForGig({
      studentId: studentId || 1,
      gigId,
      message,
      githubRepo
    });
    return res.status(201).json({
      success: true,
      application,
      message: "Application submitted and recorded in database"
    });
  } catch (err) {
    console.error("DB insert error in /api/gigs/apply:", err.message);
    res.status(500).json({ error: "Failed to apply for gig", details: err.message });
  }
});

/* ================= MENTOR BOOKING ================= */
app.post("/api/mentors/book", (req, res) => {
  const { studentId, mentorId, date, time, topic } = req.body;

  if (!mentorId || !time) {
    return res.status(400).json({
      error: "Complete booking information is required"
    });
  }

  try {
    const booking = db.bookMentorSession({
      studentId: studentId || 1,
      mentorId,
      date,
      time,
      topic
    });
    return res.status(201).json({
      success: true,
      booking,
      message: "15-Minute Capsule booked successfully"
    });
  } catch (err) {
    console.error("DB insert error in /api/mentors/book:", err.message);
    res.status(500).json({ error: "Failed to book mentor session", details: err.message });
  }
});

/* ================= EXPERIENCE PASSPORT ================= */
app.get("/api/passport", (req, res) => {
  try {
    const studentId = req.query.studentId;
    const records = db.getPassportRecords(studentId);
    return res.json(records);
  } catch (err) {
    console.error("Error in /api/passport:", err.message);
    res.status(500).json({ error: "Failed to fetch passport records" });
  }
});

app.post("/api/passport/mint", (req, res) => {
  try {
    const { studentId, title, company, score, skillsVerified } = req.body;
    const record = db.mintPassportRecord({ studentId, title, company, score, skillsVerified });
    return res.status(201).json({ success: true, record });
  } catch (err) {
    console.error("Error in /api/passport/mint:", err.message);
    res.status(500).json({ error: "Failed to mint passport record" });
  }
});
  } catch (err) {
    console.warn("DB query notice in /api/passport:", err.message);
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

/* ================= GHOST INTERNSHIP TASKS ================= */
app.get("/api/ghost-tasks", (req, res) => {
  try {
    const tasks = db.getGhostTasks();
    return res.json(tasks);
  } catch (err) {
    console.error("Error in /api/ghost-tasks:", err.message);
    res.status(500).json({ error: "Failed to fetch ghost tasks" });
  }
});

/* ================= FACULTY MOUS & SWAPS ================= */
app.get("/api/faculty/mous", (req, res) => {
  try {
    const mous = db.getMouRequests();
    return res.json(mous);
  } catch (err) {
    console.error("Error in /api/faculty/mous:", err.message);
    res.status(500).json({ error: "Failed to fetch MOUs" });
  }
});

app.post("/api/faculty/mous", (req, res) => {
  try {
    const mou = db.createMouRequest(req.body);
    return res.status(201).json({ success: true, mou });
  } catch (err) {
    console.error("Error in /api/faculty/mous POST:", err.message);
    res.status(500).json({ error: "Failed to create MOU" });
  }
});

app.get("/api/faculty/swaps", (req, res) => {
  try {
    const swaps = db.getFacultySwaps();
    return res.json(swaps);
  } catch (err) {
    console.error("Error in /api/faculty/swaps:", err.message);
    res.status(500).json({ error: "Failed to fetch faculty swaps" });
  }
});

app.post("/api/faculty/swaps", (req, res) => {
  try {
    const swap = db.createFacultySwap(req.body);
    return res.status(201).json({ success: true, swap });
  } catch (err) {
    console.error("Error in /api/faculty/swaps POST:", err.message);
    res.status(500).json({ error: "Failed to create faculty swap" });
  }
});

app.get("/api/faqs", (req, res) => {
  try {
    const faqs = db.getFaqs();
    return res.json(faqs);
  } catch (err) {
    console.error("Error in /api/faqs:", err.message);
    res.status(500).json({ error: "Failed to fetch faqs" });
  }
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

      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
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

/* ================= AI HELPDESK REAL-TIME CHAT ================= */
app.post("/api/ai/helpdesk/chat", async (req, res) => {
  const { message, category = "support" } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  let reply = "";
  try {
    const ai = getGenAiClient();
    if (ai) {
      const prompt = `You are a helpful, professional human support specialist at SkillBridge (a real-time career and micro-internship platform for university students, faculty, and industry mentors).
User category: ${category}
User inquiry: "${message}"
Respond in a friendly, conversational tone (1-3 sentences max). Offer helpful guidance on micro-internships, skills development, GitHub project verification, mentorship capsules, or dashboard navigation. Avoid robotic buzzwords.`;
      
      const aiPromise = ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 3500));
      const response = await Promise.race([aiPromise, timeoutPromise]);
      if (response && response.text) {
        reply = response.text.trim();
      }
    }
  } catch (err) {
    console.warn("Support chat AI notice:", err.message);
  }

  if (!reply) {
    const lower = message.toLowerCase();
    if (lower.includes("internship") || lower.includes("gig")) {
      reply = "We have active micro-internships available from Infosys, TCS, and Wipro on your Gigs tab. You can apply directly and start a zero-NDA simulation anytime!";
    } else if (lower.includes("project") || lower.includes("github") || lower.includes("code")) {
      reply = "You can link your GitHub account or launch a Ghost Sandbox project to get verified proofs for your experience passport.";
    } else if (lower.includes("mentor") || lower.includes("guidance") || lower.includes("session")) {
      reply = "Our industry mentors from TCS and Google Cloud host weekly architecture review sessions. Check the Mentorship capsules tab to book a 1:1 slot.";
    } else if (lower.includes("resume") || lower.includes("score") || lower.includes("dna")) {
      reply = "Your Skill DNA score is benchmarked against real industry job profiles. Keep completing micro-tasks to raise your readiness percentile!";
    } else {
      reply = "Hello! Our support team is here to help with your internships, verified projects, and career roadmap. Let us know what you need!";
    }
  }

  res.json({ success: true, reply, timestamp: new Date().toISOString() });
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
      const aiPromise = ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt
      });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI timeout")), 3000));
      const response = await Promise.race([aiPromise, timeoutPromise]);
      if (response && response.text) {
        aiSummary = response.text.trim();
      }
    }
  } catch (e) {
    console.warn("AI ticket diagnosis notice:", e.message);
  }

  try {
    const result = await db.query(
      `INSERT INTO helpdesk_tickets (student_id, category, title, description, priority, status, ai_summary)
       VALUES ($1, $2, $3, $4, $5, 'open', $6)
       RETURNING id, student_id, category, title, description, priority, status, ai_summary, created_at`,
      [studentId, category || "general", title, description, priority.toLowerCase(), aiSummary]
    );

    if (result && result.rows && result.rows.length > 0) {
      return res.status(201).json({
        success: true,
        ticket: result.rows[0],
        message: "Ticket created and AI diagnostic generated"
      });
    }
  } catch (err) {
    console.error("DB error creating ticket:", err.message);
  }

  res.status(201).json({
    success: true,
    ticket: {
      id: Date.now(),
      student_id: studentId,
      title,
      category: category || "general",
      description,
      priority: priority.toLowerCase(),
      status: "open",
      ai_summary: aiSummary,
      created_at: new Date().toISOString()
    },
    message: "Ticket created and AI diagnostic generated"
  });
});

/* ================= GET HELPDESK TICKETS ================= */
app.get("/api/ai/helpdesk/tickets", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, student_id, category, title, description, priority, status, ai_summary, created_at FROM helpdesk_tickets ORDER BY id DESC"
    );
    if (result && result.rows) {
      return res.json(result.rows);
    }
  } catch (err) {
    console.warn("DB query notice in /api/ai/helpdesk/tickets:", err.message);
  }
  res.json([]);
});

/* ================= API 404 HANDLER (MUST BE BEFORE STATIC FALLBACK) ================= */
app.use("/api", (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.originalUrl} not found` });
});

/* ================= STATIC FILES & ROUTING ================= */
const fs = require("fs");
const frontendDist = path.join(__dirname, "../frontend/dist");
const frontendPath = path.join(__dirname, "../frontend");
const staticPath = fs.existsSync(frontendDist) ? frontendDist : frontendPath;

app.use(express.static(staticPath));

app.get("*", (req, res) => {
  if (fs.existsSync(path.join(staticPath, "index.html"))) {
    res.sendFile(path.join(staticPath, "index.html"));
  } else {
    res.sendFile(path.join(frontendPath, "index.html"));
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`SkillBridge AI running on http://0.0.0.0:${PORT}`);
  if (process.env.DATABASE_URL) {
    await db.initializeDatabase();
  }
});
