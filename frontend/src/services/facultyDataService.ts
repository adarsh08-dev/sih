import { FacultyProfile, FacultyOpportunity, FacultyApplication, FacultyNotification, StudentForIntervention, MoURequest } from '../types';

export const getFacultyProfile = (): FacultyProfile => ({
  id: 'f1',
  name: 'Dr. Arvind K. Sharma',
  designation: 'Head of Department',
  department: 'Computer Science & Information Technology',
  institution: 'MJPRU Bareilly',
  email: 'arvind.sharma@mjpru.ac.in',
  qualifications: ['Ph.D. Computer Science', 'M.Tech IT'],
  experienceYears: 15,
  expertise: ['AI', 'Cloud Computing', 'Database Systems'],
  technicalSkills: ['Python', 'PostgreSQL', 'React', 'AWS'],
  researchInterests: ['Federated Learning', 'Distributed Systems'],
  profileCompletion: 92
});

export const getUnplacedStudents = (): StudentForIntervention[] => [
  { id: 's1', name: 'Rahul Kumar', rollNo: 'CS202601', cgpa: 7.2, readiness: 65, skillGap: 'System Design', risk: 'Medium', lastActivity: '2 days ago' },
  { id: 's2', name: 'Priya Singh', rollNo: 'CS202605', cgpa: 6.5, readiness: 45, skillGap: 'Database Optimization', risk: 'High', lastActivity: '1 day ago' },
];

export const getMoUDraft = (request: MoURequest) => `
  MEMORANDUM OF UNDERSTANDING
  
  This agreement is between ${request.institution} and ${request.partnerName}.
  Objective: ${request.objective}
  Duration: ${request.duration}
  
  [Draft for Institutional Review]
`;
