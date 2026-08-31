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
  title: string;
  company: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  applications: number;
  deadline: string;
  status: 'Active' | 'Draft' | 'Closed';
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
