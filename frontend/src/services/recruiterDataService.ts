import { Candidate, Job, Application } from '../types/recruiter';

export const mockCandidates: Candidate[] = [
  { id: 'c1', name: 'Aarav Singh', department: 'B.Tech CSE', gradYear: 2027, skills: ['React', 'Node.js', 'SQL'], projects: ['E-commerce', 'Portfolio'], internships: ['TCS Intern'], resumeStatus: 'Verified', readiness: 92, matchScore: 92 },
  { id: 'c2', name: 'Priya Sharma', department: 'B.Tech IT', gradYear: 2027, skills: ['Python', 'Power BI'], projects: ['Data Analysis'], internships: ['Infosys Intern'], resumeStatus: 'Verified', readiness: 88, matchScore: 85 },
];

export const mockJobs: Job[] = [
  { id: 'j1', title: 'Software Engineer Intern', company: 'TechNova Solutions', location: 'Bengaluru', type: 'Internship', duration: '6 Months', stipend: '₹25,000/month', applications: 64, deadline: '2026-09-15', status: 'Active' },
];

export const mockApplications: Application[] = [
  { id: 'a1', candidateId: 'c1', candidateName: 'Aarav Singh', position: 'Software Engineer Intern', appliedDate: '2026-08-29', matchScore: 92, stage: 'Shortlisted' },
];
