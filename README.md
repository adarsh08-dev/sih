# SkillBridge AI | Industry Career OS (SIH26044)

SkillBridge AI is an AI-powered Industry Career OS designed to bridge the gap between academic institutions, students, industry mentors, and hiring companies through verifiable micro-internships, intelligent mentor matching, skill gap analytics, and digital experience passports.

---

## 🛠️ Technology Stack

### **Frontend**
- **HTML5 & Semantic UI**: Structured multi-module single-page application layout.
- **CSS3 Modern Styles**: Responsive layout, CSS variables, glass-morphism panels, badges, modals, and toast notifications.
- **Vanilla JavaScript (ES6+)**: Asynchronous REST API integration, state management, interactive modal workflows, search and filter engine, JSON passport export.

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Framework**: [Express.js](https://expressjs.com/) (v4.21.2)
- **Middleware & Security**:
  - `cors`: Cross-Origin Resource Sharing
  - `dotenv`: Environment variable management
  - `express.json`: JSON payload parsing
- **Database Driver**: [`pg` (node-postgres)](https://node-postgres.com/) with connection pooling and automated SSL configuration.

### **Database & Data Layer**
- **Engine**: [PostgreSQL](https://www.postgresql.org/) (Relational Database)
- **Schema & Migrations (`backend/schema.sql`)**:
  - `students`: Academic details, career readiness, experience scores
  - `skills` & `student_skills`: Skill mapping and proficiency levels
  - `mentors`: Industry profiles, experience metrics, availability status
  - `mentor_bookings`: 15-minute monthly mentorship capsule scheduling
  - `companies`: Verified corporate and startup partners
  - `gigs`: Micro-internships with deliverables, durations, and stipend values
  - `gig_applications`: Application lifecycle tracking
  - `experience_records`: Verifiable Experience Passport credentials
- **Auto-Initialization**: Built-in bootstrap runner in `backend/db.js` that verifies and seeds tables automatically upon startup.

---

## 📂 Project Structure

```
skillbridge-ai/
├── backend/
│   ├── db.js              # PostgreSQL connection pool, health check & auto-seeder
│   ├── package.json       # Backend dependencies (express, pg, cors, dotenv)
│   ├── schema.sql         # PostgreSQL schema definition & initial seed data
│   └── server.js          # REST API endpoints & static frontend server
├── frontend/
│   ├── app.js             # Client-side state, API calls, event handlers & UI logic
│   ├── index.html         # Main application interface & dashboard layout
│   └── style.css          # Design system, layout grids, components & theme
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules for node_modules, logs, and secrets
├── metadata.json          # Application configuration metadata
├── package.json           # Root workspace configuration & execution scripts
└── README.md              # Project documentation
```

---

## 🔌 API Endpoints Reference

### **Health & Database**
- `GET /api/health` — Checks service health, uptime, and live PostgreSQL connection timestamp.

### **Student Profile & Analytics**
- `GET /api/student` — Retrieves student profile, target role, career readiness score, and experience points.
- `GET /api/ai/career-analysis` — AI career compatibility, strongest capability, and priority gap analysis.
- `GET /api/ai/skill-gaps` — Detailed skill breakdown with severity indicators.

### **Mentorship & Capsules**
- `GET /api/mentors` — Returns all industry mentors and match percentages.
- `GET /api/mentors/best-match` — Returns highest-rated AI-matched mentor.
- `POST /api/mentors` — Adds a new mentor to the database.
- `POST /api/mentors/book` — Schedules and records a 15-minute mentor capsule session.

### **Micro-Internship Gig Board**
- `GET /api/gigs` — Fetches active micro-internship listings with company info.
- `POST /api/gigs` — Creates and publishes a new industry gig to PostgreSQL.
- `POST /api/gigs/apply` — Submits a gig application and updates experience metrics.

### **Experience Passport**
- `GET /api/passport` — Returns verified experience credentials and portfolio history.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [PostgreSQL](https://www.postgresql.org/) database instance (local or hosted on Supabase, Neon, Cloud SQL, AWS RDS, Render, etc.)

### 2. Environment Variables Setup
Copy `.env.example` into `.env` and provide your database credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>?sslmode=require
DATABASE_SSL=true
PORT=3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
```bash
npm run dev
# or
npm start
```
The server will start on `http://localhost:3000` (or `http://0.0.0.0:3000`), verify/seed the PostgreSQL schema, and serve both API and frontend UI.

---

## 📦 Deployment Options

- **Full Stack / Cloud Containers**: Google Cloud Run, AWS App Runner, Render, Railway, Heroku.
- **Database**: Managed PostgreSQL on Google Cloud SQL, Supabase, Neon, AWS RDS, or Render Postgres.
