-- Ladder AI PostgreSQL Schema

-- 1. STUDENTS
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    course VARCHAR(100),
    batch VARCHAR(20),
    target_role VARCHAR(150),
    career_readiness INT DEFAULT 0,
    experience_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SKILLS
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(100)
);

-- 3. STUDENT SKILLS
CREATE TABLE IF NOT EXISTS student_skills (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    proficiency INT DEFAULT 0
);

-- 4. MENTORS
CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    role VARCHAR(150),
    company VARCHAR(150),
    experience_years INT,
    availability BOOLEAN DEFAULT TRUE
);

-- 5. MENTOR BOOKINGS
CREATE TABLE IF NOT EXISTS mentor_bookings (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    mentor_id INT REFERENCES mentors(id) ON DELETE CASCADE,
    session_date DATE,
    session_time TIME,
    duration_minutes INT DEFAULT 15,
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. INDUSTRY COMPANIES
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(150),
    industry VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE
);

-- 7. MICRO INTERNSHIP GIGS
CREATE TABLE IF NOT EXISTS gigs (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    title VARCHAR(200),
    description TEXT,
    required_skill VARCHAR(100),
    duration_hours INT,
    payment DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. GIG APPLICATIONS
CREATE TABLE IF NOT EXISTS gig_applications (
    id SERIAL PRIMARY KEY,
    gig_id INT REFERENCES gigs(id) ON DELETE CASCADE,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(30) DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. EXPERIENCE PASSPORT
CREATE TABLE IF NOT EXISTS experience_records (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(200),
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    experience_type VARCHAR(100),
    verified BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. USERS (Authentication & Role Management)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'mentor', 'hod', 'recruiter', 'company', 'admin')),
    student_id INTEGER REFERENCES students(id) ON DELETE SET NULL,
    mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL,
    company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. HELPDESK TICKETS
CREATE TABLE IF NOT EXISTS helpdesk_tickets (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'open',
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. RECRUITER JOB POSTINGS
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    company VARCHAR(150) NOT NULL,
    title VARCHAR(200) NOT NULL,
    location VARCHAR(150) DEFAULT 'Remote',
    type VARCHAR(50) DEFAULT 'Full-Time',
    duration VARCHAR(50) DEFAULT 'Full-Time',
    stipend VARCHAR(100) DEFAULT 'Competitive',
    openings INT DEFAULT 1,
    required_skills TEXT[] DEFAULT '{}',
    eligibility VARCHAR(200),
    description TEXT,
    deadline VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Active',
    apps INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA FOR DEMO / INITIALIZATION
INSERT INTO students (id, name, course, batch, target_role, career_readiness, experience_score)
VALUES (1, 'Adarsh Pratap Singh', 'CSIT', '2025-29', 'Full Stack Software Engineer', 81, 64)
ON CONFLICT (id) DO NOTHING;

INSERT INTO companies (id, company_name, industry, verified)
VALUES 
(1, 'TechNova Labs', 'Software & AI', TRUE),
(2, 'CloudSphere Systems', 'Cloud Infrastructure', TRUE),
(3, 'FinEdge Solutions', 'Fintech & Analytics', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mentors (id, name, role, company, experience_years, availability)
VALUES
(1, 'Rohan Mehta', 'Senior Software Architect', 'TechNova Labs', 12, TRUE),
(2, 'Priya Sharma', 'Engineering Manager', 'CloudSphere', 10, TRUE),
(3, 'Arjun Kapoor', 'AI/ML Lead', 'DataSphere AI', 14, TRUE),
(4, 'Aryan Mehrotra', 'Senior Software Developer', 'My Tech', 10, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO gigs (id, company_id, title, description, required_skill, duration_hours, payment, status)
VALUES
(1, 1, 'Build a Responsive Product Landing Page', 'Design and code a high converting landing page', 'Web Development', 3, 1500.00, 'open'),
(2, 2, 'Build an Authenticated REST API', 'Develop JWT secured API with Node.js & PostgreSQL', 'Backend', 5, 3500.00, 'open'),
(3, 3, 'SQL Business Analytics Challenge', 'Write analytical queries for financial reports', 'SQL', 3, 1800.00, 'open')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, company_id, company, title, location, type, duration, stipend, openings, required_skills, eligibility, description, deadline, status, apps)
VALUES
(1, 1, 'TechNova Solutions', 'Software Engineer Intern', 'Bengaluru', 'Hybrid', '6 Months', '₹25,000/month', 8, ARRAY['React', 'Node.js', 'PostgreSQL'], 'B.Tech CSE/IT 2026/2027', 'Work on high-scale cloud-native web microservices and UI components.', '2026-09-15', 'Active', 64),
(2, 2, 'PixelWorks Digital', 'Frontend Developer Intern', 'Remote', 'Remote', '3 Months', '₹20,000/month', 5, ARRAY['React', 'TypeScript', 'Tailwind CSS'], 'All Engineering Branches', 'Build responsive interactive dashboards and accessible user components.', '2026-09-20', 'Active', 41),
(3, 3, 'DataSphere Analytics', 'Data Analyst Intern', 'Noida', 'In-Office', '6 Months', '₹22,000/month', 3, ARRAY['Python', 'SQL', 'Power BI'], 'B.Tech / MCA / Data Science', 'Perform cohort queries, pipeline automation and KPI dashboard visualizations.', '2026-09-25', 'Active', 28),
(4, 1, 'CloudMatrix Systems', 'Java Cloud Developer', 'Pune', 'In-Office', 'Full-Time', '₹8.5 LPA', 2, ARRAY['Java', 'Spring Boot', 'AWS'], 'B.Tech CSE / IT 2025/2026', 'Develop mission critical backend services and Kubernetes deployments.', '2026-10-01', 'Active', 31),
(5, 2, 'AI Labs Global', 'ML Engineer Intern', 'Hyderabad', 'Hybrid', '6 Months', '₹30,000/month', 4, ARRAY['Python', 'PyTorch', 'FastAPI'], 'B.Tech CSE / AI Specialization', 'Train, benchmark and deploy generative models and predictive algorithms.', '2026-09-30', 'Active', 20),
(6, 3, 'NexaCloud Infrastructure', 'Cloud Support Associate', 'Bengaluru', 'In-Office', 'Full-Time', '₹7.2 LPA', 10, ARRAY['Linux', 'Docker', 'Bash'], 'B.Tech / BCA 2026', 'Assist enterprise clients in cloud migrations, monitoring and SLAs.', '2026-10-15', 'Draft', 18)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, name, email, password_hash, role, student_id, mentor_id, company_id)
VALUES
(1, 'Adarsh Pratap Singh', 'adarsh@mjpru.ac.in', '$2a$10$7vI6V2tB5k3K7MeqY.v6jOlBsz2vYQ6.Fw8Lg6gT8x3U6kEwG49l2', 'student', 1, NULL, NULL),
(2, 'Amit Verma', 'amit.verma@tcs.com', '$2a$10$7vI6V2tB5k3K7MeqY.v6jOlBsz2vYQ6.Fw8Lg6gT8x3U6kEwG49l2', 'mentor', NULL, 1, NULL),
(3, 'Dr. Arvind K. Sharma', 'hod.csit@mjpru.ac.in', '$2a$10$7vI6V2tB5k3K7MeqY.v6jOlBsz2vYQ6.Fw8Lg6gT8x3U6kEwG49l2', 'hod', NULL, NULL, NULL),
(4, 'Rahul Mehta', 'recruiter@technova.com', '$2a$10$7vI6V2tB5k3K7MeqY.v6jOlBsz2vYQ6.Fw8Lg6gT8x3U6kEwG49l2', 'recruiter', NULL, NULL, 1)
ON CONFLICT (id) DO NOTHING;

-- SYNC SEQUENCES WITH SEEDED IDS
SELECT setval('students_id_seq', (SELECT COALESCE(MAX(id), 1) FROM students));
SELECT setval('companies_id_seq', (SELECT COALESCE(MAX(id), 1) FROM companies));
SELECT setval('mentors_id_seq', (SELECT COALESCE(MAX(id), 1) FROM mentors));
SELECT setval('gigs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM gigs));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('helpdesk_tickets_id_seq', (SELECT COALESCE(MAX(id), 1) FROM helpdesk_tickets));
SELECT setval('jobs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM jobs));

