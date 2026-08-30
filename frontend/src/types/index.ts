export type UserRole = 'student' | 'mentor' | 'hod' | 'company';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  studentId?: number | null;
  mentorId?: number | null;
  companyId?: number | null;
  college?: string;
  avatar?: string;
}

export interface StudentProfile {
  id: number;
  name: string;
  course: string;
  batch: string;
  year?: string;
  rollNo?: string;
  email?: string;
  targetRole: string;
  careerReadiness: number;
  experienceScore: number;
  college?: string;
  github?: string;
  linkedin?: string;
  skills?: { name: string; level: number; category: string }[];
  dnaScores?: {
    algorithmicThinking: number;
    systemDesign: number;
    codeQuality: number;
    communication: number;
    problemSolving: number;
    adaptability: number;
  };
  timeMachinePredictions?: {
    currentQuarter: string;
    targetDate: string;
    expectedPlacementPackage: string;
    milestones: { month: string; target: string; completed: boolean }[];
  };
}

export interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  experience: number;
  match: number;
  availability: boolean;
  avatar?: string;
  specialization?: string;
  capsuleSlots?: string[];
}

export interface Gig {
  id: number;
  title: string;
  company: string;
  skill: string;
  hours: number;
  payment: number;
  status: 'open' | 'applied' | 'completed' | 'in_progress';
  description?: string;
  deliverables?: string[];
  applicantCount?: number;
}

export interface PassportRecord {
  id: number;
  title: string;
  company: string;
  experience_type: string;
  verified: boolean;
  score: number;
  hash?: string;
  issueDate?: string;
  issuer?: string;
  skillsVerified?: string[];
  transactionHash?: string;
}

export interface HelpdeskTicket {
  id: number;
  student_id: number;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  ai_summary?: string;
  created_at: string;
}

export interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface GhostInternshipTask {
  id: string;
  company: string;
  role: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeEstimate: string;
  bounty: string;
  summary: string;
  starterCode: string;
  solutionHints: string[];
  testCases: { name: string; passed: boolean }[];
}

export interface MouRequest {
  id: string;
  companyName: string;
  industry: string;
  contactPerson: string;
  status: 'Draft' | 'Sent' | 'Approved' | 'Active';
  dateCreated: string;
  scopes: string[];
}

export interface FacultySwapOffer {
  id: string;
  facultyName: string;
  department: string;
  originCollege: string;
  specialization: string;
  targetTopics: string[];
  mode: 'Online Guest' | 'Semester Exchange' | 'Weekend Masterclass';
  status: 'Available' | 'Matched';
}
