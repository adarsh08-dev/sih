export interface Candidate {
  id: string;
  name: string;
  department: string;
  gradYear: number;
  skills: string[];
  projects: string[];
  internships: string[];
  resumeStatus: 'Verified' | 'Pending';
  readiness: number;
  matchScore: number;
}

export interface Job {
  id: string;
  numericId?: number;
  title: string;
  company: string;
  companyId?: number;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  applications: number;
  apps?: number;
  openings?: number;
  requiredSkills?: string[];
  skills?: string[];
  eligibility?: string;
  description?: string;
  deadline: string;
  status: 'Active' | 'Draft' | 'Closed';
  created_at?: string;
}

export interface Application {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  appliedDate: string;
  matchScore: number;
  stage: 'Applied' | 'Screening' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
}
