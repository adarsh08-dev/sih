# Ladder | Industry Career OS ()

Ladder is an AI-powered Industry Career OS designed to bridge the gap between academic institutions, students, industry mentors, and hiring companies through verifiable micro-internships, intelligent mentor matching, skill gap analytics, and digital experience passports.

---

## 🛠️ Technology Stack

### 🎨 Frontend

* React 19 — main UI framework
* TypeScript — frontend source files .tsx / .ts
* Vite 8 — development server & production bundler
* Tailwind CSS 4 — utility-first styling
* @tailwindcss/vite — Tailwind’s Vite integration
* Lucide React — icons
* Motion — animations
* React Markdown — Markdown rendering
* Canvas Confetti — UI celebration effects
* HTML5
* CSS3
* Google Fonts — Plus Jakarta Sans & JetBrains Mono 

The actual App.tsx confirms a large React component/page architecture with TypeScript, React state/hooks and multiple dashboard modules. 

### ⚙️ Backend

* Node.js
* Express.js 4.21.x
* JavaScript (CommonJS) for the primary backend
* CORS
* dotenv
* JWT — jsonwebtoken
* bcryptjs for password hashing
* REST API architecture 

### 🗄️ Database

* PostgreSQL
* node-postgres (pg) as the Node.js PostgreSQL driver
* Connection pooling through pg
* SQL schema/migrations in backend/schema.sql
* Database logic handled through backend/db.js 

### 🤖 AI

* Google Gemini API
* @google/genai SDK
* Gemini-powered AI Helpdesk / Bridge Buddy
* Gemini streaming chat for Faculty Advisor
* GEMINI_API_KEY environment variable 

### 🔐 Authentication & Security

* JWT authentication
* bcryptjs password hashing
* CORS
* dotenv environment configuration
* Role-based application pathways: Student, Mentor, HOD/Faculty and Recruiter/Company. 

### 🛠️ Development / Build

* Vite
* npm
* Node.js
* TypeScript compiler/build through Vite
* Production start through Node/Express
* Vite development server runs on port 3000.
* 
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
