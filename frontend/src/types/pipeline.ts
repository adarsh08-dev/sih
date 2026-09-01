export type PipelineStage = 
  | 'Applied'
  | 'Screening'
  | 'Task Submitted'
  | 'Interview Scheduled'
  | 'Capsule Booked'
  | 'Onboarded';

export interface TaskSubmissionDetails {
  title: string;
  repoUrl: string;
  submittedAt: string;
  testsPassed: string;
  totalTests: number;
  passedTests: number;
  status: 'pending' | 'reviewed' | 'approved' | 'changes_requested';
  codeSnippet?: string;
  feedback?: string;
  score?: number;
}

export interface CapsuleBookingDetails {
  slot: string;
  date: string;
  time: string;
  topic: string;
  meetingUrl: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  durationMinutes: number;
  notes?: string;
}

export interface MentorFeedbackRecord {
  id: string;
  date: string;
  mentorName: string;
  mentorCompany: string;
  rating: number; // 1 to 5
  codeQualityRating: number;
  architectureRating: number;
  problemSolvingRating: number;
  communicationRating: number;
  strengths: string;
  areasForImprovement: string;
  actionableNextSteps: string;
}

export interface StudentPipelineRecord {
  student_id: number | string;
  name: string;
  email: string;
  course: string;
  year: string;
  stage: PipelineStage;
  skills: string[];
  mentor_id: number;
  mentor_name: string;
  mentor_role: string;
  mentor_company: string;
  next_action: string;
  updated_at: string;
  // Extra detailed properties
  college?: string;
  target_role?: string;
  avatar?: string;
  dna_score?: number;
  readiness_score?: number;
  task_details?: TaskSubmissionDetails;
  capsule_details?: CapsuleBookingDetails;
  feedback_history?: MentorFeedbackRecord[];
  notes?: string;
}

export interface MentorProfileInfo {
  id: number;
  name: string;
  role: string;
  company: string;
  experience_years: number;
  rating: number;
  total_mentored: number;
  active_in_pipeline: number;
  capsules_completed: number;
  conversion_rate: number;
  avatar?: string;
  tagline: string;
}
