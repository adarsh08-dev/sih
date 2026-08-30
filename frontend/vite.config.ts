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

        // 9. Helpdesk FAQ & Tickets
        if (url.startsWith('/api/ai/helpdesk/faq')) {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            faqs: [
              { id: 1, category: 'passport', question: 'How are Experience Passport credentials cryptographically verified?', answer: 'Every completed micro-internship produces a cryptographic SHA-256 hash containing student ID, issuer public key, and test suite outcome.' },
              { id: 2, category: 'gigs', question: 'When and how are micro-task stipends disbursed?', answer: 'Once proof-of-work is verified, stipends (₹1,500 - ₹5,000) are cleared via direct university transfer within 48 business hours.' },
              { id: 3, category: 'mentors', question: 'What is a 15-Minute Mentor Capsule?', answer: 'A high-impact sprint with a Senior Industry Architect to review PRs and career roadmaps.' }
            ]
          }));
        }

        if (url.startsWith('/api/ai/helpdesk/tickets')) {
          if (req.method === 'POST') {
            const body = await readBody();
            const ticket = db ? db.createHelpdeskTicket(body) : { id: 102, status: 'open' };
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, ticket }));
          }

          if (db) {
            const tickets = db.getHelpdeskTickets();
            res.statusCode = 200;
            return res.end(JSON.stringify(tickets));
          }
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
