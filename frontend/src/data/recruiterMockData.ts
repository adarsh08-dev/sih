export const mockCandidates = [
  { id: 'c1', name: 'Aarav Singh', dept: 'B.Tech CSE', gradYear: 2027, skills: ['React', 'Node.js', 'SQL'], cgpa: 8.4, readiness: 92, match: 92, resume: 'Verified', projects: 2, internships: 1 },
  { id: 'c2', name: 'Priya Sharma', dept: 'B.Tech CSE', gradYear: 2027, skills: ['Python', 'SQL', 'Power BI'], cgpa: 8.7, readiness: 88, match: 89, resume: 'Verified', projects: 3, internships: 1 },
  { id: 'c3', name: 'Rohan Verma', dept: 'B.Tech IT', gradYear: 2027, skills: ['Java', 'Spring Boot', 'MySQL'], cgpa: 8.1, readiness: 85, match: 86, resume: 'Verified', projects: 2, internships: 0 },
  { id: 'c4', name: 'Ananya Gupta', dept: 'B.Tech CSE', gradYear: 2026, skills: ['Python', 'ML', 'TensorFlow'], cgpa: 9.0, readiness: 95, match: 95, resume: 'Verified', projects: 4, internships: 2 },
  { id: 'c5', name: 'Kunal Mehta', dept: 'B.Tech CSE', gradYear: 2027, skills: ['React', 'TypeScript', 'Firebase'], cgpa: 8.2, readiness: 87, match: 87, resume: 'Verified', projects: 2, internships: 1 },
  { id: 'c6', name: 'Sneha Reddy', dept: 'B.Tech ECE', gradYear: 2026, skills: ['C++', 'Embedded Systems'], cgpa: 8.5, readiness: 90, match: 82, resume: 'Verified', projects: 3, internships: 1 },
  { id: 'c7', name: 'Vikram Joshi', dept: 'B.Tech CSE', gradYear: 2027, skills: ['Go', 'Docker', 'Kubernetes'], cgpa: 8.6, readiness: 89, match: 88, resume: 'Pending', projects: 2, internships: 1 },
  { id: 'c8', name: 'Megha Shah', dept: 'B.Tech IT', gradYear: 2026, skills: ['UI/UX', 'Figma', 'React'], cgpa: 8.8, readiness: 91, match: 90, resume: 'Verified', projects: 5, internships: 2 },
  { id: 'c9', name: 'Aryan Khan', dept: 'B.Tech CSE', gradYear: 2027, skills: ['JavaScript', 'HTML', 'CSS'], cgpa: 7.9, readiness: 80, match: 78, resume: 'Verified', projects: 1, internships: 0 },
  { id: 'c10', name: 'Divya Nair', dept: 'B.Tech CSE', gradYear: 2026, skills: ['Java', 'Android'], cgpa: 8.3, readiness: 86, match: 85, resume: 'Verified', projects: 3, internships: 1 },
  { id: 'c11', name: 'Harsh Patel', dept: 'B.Tech CSE', gradYear: 2027, skills: ['React', 'Python'], cgpa: 8.0, readiness: 84, match: 81, resume: 'Pending', projects: 2, internships: 0 },
  { id: 'c12', name: 'Ishita Roy', dept: 'B.Tech IT', gradYear: 2026, skills: ['Node.js', 'PostgreSQL'], cgpa: 8.9, readiness: 93, match: 91, resume: 'Verified', projects: 3, internships: 2 },
];

export const mockJobs = [
  { id: 'j1', title: 'Software Engineer Intern', company: 'TechNova Solutions', location: 'Bengaluru', type: 'Hybrid', stipend: '₹25,000', openings: 8, apps: 64, deadline: '2026-09-15', status: 'Active' },
  { id: 'j2', title: 'Frontend Developer Intern', company: 'PixelWorks', location: 'Remote', type: 'Remote', stipend: '₹20,000', openings: 5, apps: 41, deadline: '2026-09-20', status: 'Active' },
  { id: 'j3', title: 'Data Analyst Intern', company: 'DataSphere', location: 'Noida', type: 'In-Office', stipend: '₹22,000', openings: 3, apps: 28, deadline: '2026-09-25', status: 'Active' },
  { id: 'j4', title: 'Java Developer', company: 'CloudMatrix', location: 'Pune', type: 'In-Office', stipend: '₹8.5 LPA', openings: 2, apps: 31, deadline: '2026-10-01', status: 'Active' },
  { id: 'j5', title: 'ML Engineer Intern', company: 'AI Labs', location: 'Hyderabad', type: 'Hybrid', stipend: '₹30,000', openings: 4, apps: 20, deadline: '2026-09-30', status: 'Active' },
  { id: 'j6', title: 'Cloud Support Associate', company: 'NexaCloud', location: 'Bengaluru', type: 'In-Office', stipend: '₹7.2 LPA', openings: 10, apps: 18, deadline: '2026-10-15', status: 'Draft' },
];

export const mockApplications = [
    { id: 'a1', cand: 'Aarav Singh', job: 'Software Engineer Intern', date: 'Aug 29', match: 92, stage: 'Shortlisted' },
    { id: 'a2', cand: 'Priya Sharma', job: 'Data Analyst Intern', date: 'Aug 28', match: 89, stage: 'Screening' },
    { id: 'a3', cand: 'Ananya Gupta', job: 'ML Engineer Intern', date: 'Aug 28', match: 95, stage: 'Interview' },
    { id: 'a4', cand: 'Rohan Verma', job: 'Java Developer', date: 'Aug 27', match: 86, stage: 'Applied' },
    { id: 'a5', cand: 'Kunal Mehta', job: 'Frontend Developer Intern', date: 'Aug 27', match: 87, stage: 'Applied' },
    { id: 'a6', cand: 'Sneha Reddy', job: 'Software Engineer Intern', date: 'Aug 26', match: 82, stage: 'Rejected' },
    { id: 'a7', cand: 'Vikram Joshi', job: 'ML Engineer Intern', date: 'Aug 26', match: 88, stage: 'Screening' },
    { id: 'a8', cand: 'Megha Shah', job: 'Frontend Developer Intern', date: 'Aug 25', match: 90, stage: 'Shortlisted' },
    { id: 'a9', cand: 'Aryan Khan', job: 'Data Analyst Intern', date: 'Aug 25', match: 78, stage: 'Applied' },
    { id: 'a10', cand: 'Divya Nair', job: 'Java Developer', date: 'Aug 24', match: 85, stage: 'Applied' },
    { id: 'a11', cand: 'Ishita Roy', job: 'Software Engineer Intern', date: 'Aug 24', match: 91, stage: 'Interview' },
    { id: 'a12', cand: 'Harsh Patel', job: 'Frontend Developer Intern', date: 'Aug 23', match: 81, stage: 'Applied' },
    { id: 'a13', cand: 'Aarav Singh', job: 'Frontend Developer Intern', date: 'Aug 23', match: 92, stage: 'Selected' },
    { id: 'a14', cand: 'Priya Sharma', job: 'Software Engineer Intern', date: 'Aug 22', match: 89, stage: 'Screening' },
    { id: 'a15', cand: 'Ananya Gupta', job: 'Java Developer', date: 'Aug 22', match: 95, stage: 'Selected' },
];

export const mockInterviews = [
    { id: 'in1', cand: 'Aarav Singh', job: 'Software Engineer Intern', date: '02 Sep 2026', time: '11:00 AM', round: 'Technical', interviewer: 'Rahul Mehta', mode: 'Google Meet', status: 'Scheduled' },
    { id: 'in2', cand: 'Ishita Roy', job: 'Software Engineer Intern', date: '02 Sep 2026', time: '02:00 PM', round: 'HR', interviewer: 'Sarah Connor', mode: 'Zoom', status: 'Scheduled' },
    { id: 'in3', cand: 'Ananya Gupta', job: 'ML Engineer Intern', date: '03 Sep 2026', time: '10:00 AM', round: 'Technical', interviewer: 'Dr. Jones', mode: 'In-Person', status: 'Scheduled' },
    { id: 'in4', cand: 'Priya Sharma', job: 'Data Analyst Intern', date: '04 Sep 2026', time: '03:00 PM', round: 'Technical', interviewer: 'Rahul Mehta', mode: 'Google Meet', status: 'Upcoming' },
    { id: 'in5', cand: 'Rohan Verma', job: 'Java Developer', date: '01 Sep 2026', time: '09:00 AM', round: 'Technical', interviewer: 'Sarah Connor', mode: 'Google Meet', status: 'Completed' },
    { id: 'in6', cand: 'Kunal Mehta', job: 'Frontend Developer Intern', date: '30 Aug 2026', time: '04:00 PM', round: 'HR', interviewer: 'Rahul Mehta', mode: 'Google Meet', status: 'Completed' },
    { id: 'in7', cand: 'Megha Shah', job: 'Frontend Developer Intern', date: '29 Aug 2026', time: '11:00 AM', round: 'Technical', interviewer: 'Sarah Connor', mode: 'Google Meet', status: 'Completed' },
    { id: 'in8', cand: 'Aryan Khan', job: 'Data Analyst Intern', date: '28 Aug 2026', time: '02:00 PM', round: 'Technical', interviewer: 'Rahul Mehta', mode: 'In-Person', status: 'Completed' },
];

export const mockDrives = [
    { id: 'd1', company: 'TechNova Solutions', name: 'Campus Drive 2026', date: '15 Sep 2026', eligible: 200, reg: 150, short: 40, sel: 5, status: 'Upcoming' },
    { id: 'd2', company: 'PixelWorks', name: 'Pixel Drive', date: '10 Sep 2026', eligible: 150, reg: 120, short: 30, sel: 2, status: 'Upcoming' },
    { id: 'd3', company: 'DataSphere', name: 'Data Hiring Day', date: '05 Sep 2026', eligible: 100, reg: 80, short: 20, sel: 1, status: 'Ongoing' },
    { id: 'd4', company: 'CloudMatrix', name: 'Cloud Summit Hiring', date: '25 Aug 2026', eligible: 300, reg: 250, short: 60, sel: 10, status: 'Completed' },
    { id: 'd5', company: 'AI Labs', name: 'AI Talent Hunt', date: '20 Aug 2026', eligible: 200, reg: 180, short: 50, sel: 8, status: 'Completed' },
];

export const mockInternships = [
    { id: 'i1', title: 'Software Engineering', company: 'TechNova', domain: 'CSE', duration: '6 Months', openings: 10, apps: 50, sel: 5, status: 'Active' },
    { id: 'i2', title: 'Data Analytics', company: 'DataSphere', domain: 'IT', duration: '3 Months', openings: 5, apps: 30, sel: 2, status: 'Active' },
    { id: 'i3', title: 'Cloud Infrastructure', company: 'CloudMatrix', domain: 'CSE', duration: '6 Months', openings: 4, apps: 20, sel: 1, status: 'Active' },
    { id: 'i4', title: 'AI/ML Research', company: 'AI Labs', domain: 'CSE', duration: '6 Months', openings: 3, apps: 40, sel: 3, status: 'Upcoming' },
    { id: 'i5', title: 'UI/UX Design', company: 'PixelWorks', domain: 'IT', duration: '3 Months', openings: 2, apps: 15, sel: 1, status: 'Completed' },
    { id: 'i6', title: 'Security Audit', company: 'NexaCloud', domain: 'CSE', duration: '4 Months', openings: 5, apps: 25, sel: 2, status: 'Completed' },
];

export const mockCollabs = [
    { id: 'c1', org: 'TCS', type: 'Industry Guest Lecture', dept: 'CSE', purpose: 'Tech Talk', date: '10 Sep 2026', status: 'Pending' },
    { id: 'c2', org: 'Infosys', type: 'Live Industry Project', dept: 'IT', purpose: 'Development', date: '05 Sep 2026', status: 'Approved' },
    { id: 'c3', org: 'Wipro', type: 'Research Collaboration', dept: 'CSE', purpose: 'R&D', date: '01 Sep 2026', status: 'Pending' },
    { id: 'c4', org: 'AWS', type: 'Faculty Training', dept: 'CSE', purpose: 'Cloud Ops', date: '25 Aug 2026', status: 'Completed' },
    { id: 'c5', org: 'Google', type: 'Student Hackathon', dept: 'CSE', purpose: 'Innovation', date: '20 Aug 2026', status: 'Completed' },
    { id: 'c6', org: 'IBM', type: 'Placement Partnership', dept: 'IT', purpose: 'Recruitment', date: '15 Aug 2026', status: 'Declined' },
];

export const mockMessages = [
    { id: 'm1', from: 'Placement Cell', last: 'Interview panel confirmed for 11 AM.', unread: 1 },
    { id: 'm2', from: 'Dr. Arvind Sharma', last: 'Industry collaboration discussion needed.', unread: 0 },
    { id: 'm3', from: 'Aarav Singh', last: 'Can I reschedule interview?', unread: 2 },
    { id: 'm4', from: 'Priya Sharma', last: 'Thanks for the feedback.', unread: 0 },
    { id: 'm5', from: 'TCS Team', last: 'Project proposal attached.', unread: 1 },
    { id: 'm6', from: 'Infosys HR', last: 'When is the next drive?', unread: 0 },
];

export const mockNotifications = [
    { id: 'n1', msg: '12 new applications for Software Engineer Intern.', time: '2m ago', read: false },
    { id: 'n2', msg: 'Aarav Singh has been shortlisted.', time: '1h ago', read: false },
    { id: 'n3', msg: 'Interview scheduled for Ananya Gupta.', time: '3h ago', true: true },
    { id: 'n4', msg: 'Placement Cell sent a message.', time: '5h ago', read: false },
    { id: 'n5', msg: 'Application deadline approaching for AI Labs.', time: '1d ago', read: true },
    { id: 'n6', msg: 'New job posting approved.', time: '1d ago', read: true },
    { id: 'n7', msg: 'Kunal Mehta accepted offer.', time: '2d ago', read: true },
    { id: 'n8', msg: 'New collaboration request from Wipro.', time: '2d ago', read: true },
];
