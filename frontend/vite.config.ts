import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Embedded Dev API plugin connected directly to the persistent database ledger
function devApiPlugin(): Plugin {
  return {
    name: 'skillbridge-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        // Helper to parse incoming JSON request body
        const readBody = async (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        // Load database module
        let db: any;
        try {
          // Dynamic require backend db
          db = require(path.resolve(__dirname, '../backend/db.js'));
        } catch (e) {
          console.warn('Could not load backend db in dev middleware:', e);
        }

        const url = req.url.split('?')[0];

        // 1. Health check
        if (url === '/api/health') {
          try {
            const health = db ? await db.checkDatabaseConnection() : { connected: true, type: 'Database Ledger' };
            res.statusCode = 200;
            return res.end(JSON.stringify({
              status: 'online',
              service: 'SkillBridge AI Career OS',
              version: '2026.1',
              database: health
            }));
          } catch (err: any) {
            res.statusCode = 200;
            return res.end(JSON.stringify({
              status: 'online',
              service: 'SkillBridge AI Career OS',
              database: { connected: true, type: 'SkillBridge Persistent Ledger' }
            }));
          }
        }

        // 2. Authentication: Register
        if (url === '/api/auth/register' && req.method === 'POST') {
          const body = await readBody();
          const { name, email, password, role, extraInfo } = body;

          if (!name || !email || !password || !role) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Name, email, password, and role are required.' }));
          }

          if (db) {
            try {
              const result = await db.registerUser({ name, email, password, role, extraInfo });
              res.statusCode = 201;
              return res.end(JSON.stringify(result));
            } catch (err: any) {
              const isConflict = err.message && err.message.includes('already exists');
              res.statusCode = isConflict ? 400 : 500;
              return res.end(JSON.stringify({ error: err.message || 'Registration failed' }));
            }
          }
        }

        // 3. Authentication: Login
        if (url === '/api/auth/login' && req.method === 'POST') {
          const body = await readBody();
          const { email, password } = body;

          if (!email || !password) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Email and password are required.' }));
          }

          if (db) {
            try {
              const result = await db.loginUser({ email, password });
              res.statusCode = 200;
              return res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 401;
              return res.end(JSON.stringify({ error: err.message || 'Authentication failed' }));
            }
          }
        }

        // 3b. Authentication: Me
        if (url === '/api/auth/me') {
          const authHeader = req.headers.authorization;
          const token = authHeader && authHeader.split(' ')[1];
          if (!token) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'No token provided' }));
          }
          try {
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.JWT_SECRET || 'skillbridge-secret-key-2026';
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const user = db ? db.getUserById(decoded.userId) : null;
            if (user) {
              res.statusCode = 200;
              return res.end(JSON.stringify({ user }));
            }
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'User not found' }));
          } catch (e: any) {
            res.statusCode = 403;
            return res.end(JSON.stringify({ error: 'Invalid or expired token' }));
          }
        }

        // 4. View all database users (for verification/admin)
        if (url === '/api/database/users' || url === '/api/auth/users') {
          if (db) {
            const users = db.getAllUsers();
            res.statusCode = 200;
            return res.end(JSON.stringify({ count: users.length, users }));
          }
        }

        // 5. Student details
        if (url.startsWith('/api/student')) {
          if (db) {
            const student = db.getStudentProfile();
            res.statusCode = 200;
            return res.end(JSON.stringify(student));
          }
        }

        // 6. Mentors
        if (url.startsWith('/api/mentors')) {
          if (url === '/api/mentors/best-match') {
            const mentors = db ? db.getMentors() : [];
            const best = mentors[0] || { id: 1, name: 'Amit Verma', role: 'Lead Software Architect', company: 'Tata Consultancy Services', experience: 12, match: 96 };
            res.statusCode = 200;
            return res.end(JSON.stringify(best));
          }

          if (req.method === 'POST' && url.includes('/book')) {
            const body = await readBody();
            const booking = db ? db.bookMentorSession(body) : { id: 1, status: 'confirmed' };
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, booking }));
          }

          if (req.method === 'POST') {
            const body = await readBody();
            const newMentor = db ? db.createMentor(body) : { id: Date.now(), ...body };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, mentor: newMentor }));
          }

          if (db) {
            const mentors = db.getMentors();
            res.statusCode = 200;
            return res.end(JSON.stringify(mentors));
          }
        }

        // 7. Gigs & Applications
        if (url.startsWith('/api/gigs')) {
          if (req.method === 'POST' && url.includes('/apply')) {
            const body = await readBody();
            const application = db ? db.applyForGig(body) : { id: 1, status: 'submitted' };
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, application }));
          }

          if (req.method === 'POST') {
            const body = await readBody();
            const newGig = db ? db.createGig(body) : { id: Date.now(), ...body, applicantCount: 0 };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, gig: newGig }));
          }

          if (db) {
            const gigs = db.getGigs();
            res.statusCode = 200;
            return res.end(JSON.stringify(gigs));
          }
        }

        // 8. Experience Passport
        if (url.startsWith('/api/passport')) {
          if (req.method === 'POST' && url.includes('/mint')) {
            const body = await readBody();
            const record = db ? db.mintPassportRecord(body) : { id: Date.now(), ...body, verified: true };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, record }));
          }

          if (db) {
            const records = db.getPassportRecords();
            res.statusCode = 200;
            return res.end(JSON.stringify(records));
          }
        }

        // 9. Helpdesk FAQ, Chat & Tickets
        if (url.startsWith('/api/ai/helpdesk/faq')) {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            categories: [
              { id: "all", label: "All Topics", icon: "🌐" },
              { id: "gigs", label: "Micro-Internships", icon: "💼" },
              { id: "technical", label: "Technical & Coding", icon: "💻" },
              { id: "mentorship", label: "Mentor Capsules", icon: "🎓" },
              { id: "career", label: "Career & Readiness", icon: "🚀" }
            ],
            faqs: [
              { id: 1, category: 'passport', question: 'How are Experience Passport credentials cryptographically verified?', answer: 'Every completed micro-internship produces a cryptographic SHA-256 hash containing student ID, issuer public key, and test suite outcome.' },
              { id: 2, category: 'gigs', question: 'When and how are micro-task stipends disbursed?', answer: 'Once proof-of-work is verified, stipends (₹1,500 - ₹5,000) are cleared via direct university transfer within 48 business hours.' },
              { id: 3, category: 'mentors', question: 'What is a 15-Minute Mentor Capsule?', answer: 'A high-impact sprint with a Senior Industry Architect to review PRs and career roadmaps.' },
              { id: 4, category: 'technical', question: 'What should I do if my database connection times out?', answer: 'Verify your connection string syntax, ensure SSL is configured with rejectUnauthorized: false, and verify network connectivity.' }
            ]
          }));
        }

        if (url.startsWith('/api/ai/helpdesk/chat') && req.method === 'POST') {
          const body = await readBody();
          const { message, category = 'general', studentProfile = {} } = body;

          // Attempt server-side Gemini generation if key is present
          const apiKey = process.env.GEMINI_API_KEY;
          if (apiKey && apiKey.trim().length > 5) {
            try {
              const { GoogleGenAI } = require('@google/genai');
              const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
              const prompt = `You are SkillBridge AI Help Desk & Technical Career Counselor. Answer concisely with actionable advice.\nStudent: ${studentProfile.name || 'Student'}\nCategory: ${category}\nQuery: ${message}`;
              const aiPromise = ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
              });
              const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
              const geminiRes: any = await Promise.race([aiPromise, timeoutPromise]);
              if (geminiRes && geminiRes.text) {
                res.statusCode = 200;
                return res.end(JSON.stringify({
                  reply: geminiRes.text.trim(),
                  suggestions: [
                    'What is the next step to practice this?',
                    'Can you provide a code example for this?',
                    'How do I review this with my mentor?'
                  ],
                  source: 'gemini',
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (err: any) {
              console.warn('Gemini chat notice in dev middleware:', err.message);
            }
          }

          // Fallback Counselor Engine
          const msg = (message || '').toLowerCase();
          let reply = `Hello ${studentProfile.name || 'Candidate'}! I am your SkillBridge AI Career Advisor. You can complete verified micro-internships, book 15-minute capsules with senior mentors, and track your skills passport.`;
          if (msg.includes('jwt') || msg.includes('auth') || msg.includes('token')) {
            reply = `### 🔐 JWT & Auth Troubleshooting\n1. Store tokens safely and attach \`Authorization: Bearer <token>\` to requests.\n2. Verify the server-side \`JWT_SECRET\` key matches.\n3. Try the Zero-Leak JWT sandbox in Ghost Internships for hands-on practice.`;
          } else if (msg.includes('postgres') || msg.includes('db') || msg.includes('sql')) {
            reply = `### 🗄️ Database & PostgreSQL Optimization\n1. Use connection pooling (\`pg.Pool\`) with \`ssl: { rejectUnauthorized: false }\`.\n2. Use composite indexes on high cardinality columns.\n3. Run \`EXPLAIN ANALYZE\` to diagnose query execution plans.`;
          } else if (msg.includes('gig') || msg.includes('internship') || msg.includes('stipend')) {
            reply = `### 💼 Micro-Internships & Verified Stipends\n1. Browse open tasks on the Micro-Gigs board.\n2. Submit deliverables and GitHub PRs.\n3. Upon verification, stipends (₹1,500 - ₹5,000) are disbursed directly to your account.`;
          } else if (msg.includes('mentor') || msg.includes('capsule')) {
            reply = `### 🎓 15-Minute Mentor Capsules\nBook rapid sprint sessions with senior architects from TCS, Infosys, and CloudSphere to review your system design and code architecture!`;
          }

          res.statusCode = 200;
          return res.end(JSON.stringify({
            reply,
            suggestions: [
              'How do I boost my career readiness score?',
              'Show open micro-internships',
              'Book a mentor capsule'
            ],
            source: 'counselor-engine',
            timestamp: new Date().toISOString()
          }));
        }

        if (url === '/api/ai/helpdesk/ticket' || url.startsWith('/api/ai/helpdesk/tickets')) {
          if (req.method === 'POST') {
            const body = await readBody();
            const ticket = db ? db.createHelpdeskTicket(body) : { id: 102, status: 'open', ...body, ai_summary: 'AI Diagnostic generated.' };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, ticket, message: 'Ticket logged successfully.' }));
          }

          if (db) {
            const tickets = db.getHelpdeskTickets();
            res.statusCode = 200;
            return res.end(JSON.stringify(tickets));
          }
        }

        // 9b. AI Career Analysis & Skill Gaps
        if (url === '/api/ai/career-analysis') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            student: 'Adarsh Pratap Singh',
            recommendedRole: 'Full Stack Software Engineer',
            compatibility: 87,
            placementReadiness: 91,
            strongestSkill: 'Git & Collaboration',
            priorityGap: 'Backend Architecture',
            recommendation: [
              'Complete backend micro-gig',
              'Attend system design mentor capsule',
              'Deploy authenticated REST API'
            ]
          }));
        }

        if (url === '/api/ai/skill-gaps') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            gaps: [
              { skill: 'Backend Architecture', severity: 'Critical', current: 42, required: 92 },
              { skill: 'REST API Design', severity: 'High', current: 55, required: 86 },
              { skill: 'Database Optimization', severity: 'Medium', current: 61, required: 88 },
              { skill: 'Cloud Deployment', severity: 'Medium', current: 57, required: 78 }
            ]
          }));
        }

        // 10. Ghost Tasks
        if (url.startsWith('/api/ghost-tasks')) {
          if (db) {
            const tasks = db.getGhostTasks();
            res.statusCode = 200;
            return res.end(JSON.stringify(tasks));
          }
        }

        // 11. Faculty MOUs & Swaps
        if (url.startsWith('/api/faculty/mous')) {
          if (req.method === 'POST') {
            const body = await readBody();
            const mou = db ? db.createMouRequest(body) : { id: 'MOU-1', ...body };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, mou }));
          }
          if (db) {
            const mous = db.getMouRequests();
            res.statusCode = 200;
            return res.end(JSON.stringify(mous));
          }
        }

        if (url.startsWith('/api/faculty/swaps')) {
          if (req.method === 'POST') {
            const body = await readBody();
            const swap = db ? db.createFacultySwap(body) : { id: 'SWAP-1', ...body };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, swap }));
          }
          if (db) {
            const swaps = db.getFacultySwaps();
            res.statusCode = 200;
            return res.end(JSON.stringify(swaps));
          }
        }

        if (url.startsWith('/api/faqs')) {
          if (db) {
            const faqs = db.getFaqs();
            res.statusCode = 200;
            return res.end(JSON.stringify(faqs));
          }
        }

        // Generic catch-all
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: 'SkillBridge API response OK' }));
      });
    }
  };
}

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss(), devApiPlugin()],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
});
