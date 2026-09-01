export type UserRole = 'student' | 'mentor' | 'hod' | 'recruiter' | 'company';

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

export interface SkillItem {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'aptitude';
  subCategory?: string;
  level: number; // 1 to 5
  maxLevel: number;
  score: number; // 0 to 100
  requiredLevel: number; // Industry requirement (1 to 5)
  verified: boolean;
  assessmentScore?: number;
  lastAssessed?: string;
  trend?: 'up' | 'stable' | 'down';
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
  overallSkillScore?: number;
  technicalSkillScore?: number;
  softSkillScore?: number;
  college?: string;
  github?: string;
  linkedin?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  bio?: string;
  interests?: string[];
  careerGoals?: string;
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

export interface AssessmentQuestion {
  id: string;
  category: string;
  subCategory?: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface AssessmentCategory {
  id: string;
  title: string;
  type: 'technical' | 'soft' | 'aptitude';
  subCategory: string;
  description: string;
  iconName: string;
  questionCount: number;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: AssessmentQuestion[];
  passingScore: number;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  category: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeSpentSeconds: number;
  passed: boolean;
  answers: {
    questionId: string;
    question: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface SkillGapItem {
  skill: string;
  category: 'technical' | 'soft';
  currentLevel: number;
  requiredLevel: number;
  currentScore: number;
  requiredScore: number;
  gapStatus: 'Mastered' | 'Minor Gap' | 'Moderate Gap' | 'Critical Gap';
  impactOnPlacement: 'High' | 'Medium' | 'Low';
  recommendedCourses: {
    title: string;
    provider: string;
    duration: string;
    url?: string;
  }[];
  recommendedCertifications: string[];
  recommendedMentorTopic: string;
  recommendedProject: string;
}

export interface JobOpportunity {
  id: string;
  company: string;
  logo?: string;
  title: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  opportunityType: 'Full-Time' | 'Internship' | 'Contract';
  duration?: string;
  stipendOrSalary: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  eligibility: string;
  applicationDeadline: string;
  description: string;
  responsibilities: string[];
  openingsCount: number;
  postedDate: string;
  featured?: boolean;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Withdrawn';

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  opportunityType: 'Internship' | 'Job' | 'Micro-Gig' | 'Industry Project';
  company: string;
  location: string;
  workMode: string;
  stipendOrSalary: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  deadline: string;
  timeline: {
    status: ApplicationStatus;
    date: string;
    note: string;
    completed: boolean;
  }[];
  notes?: string;
  matchScore: number;
}

export interface LearningCourse {
  id: string;
  title: string;
  provider: string;
  category: string;
  skillsCovered: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  completedModules: number;
  progressPercent: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  targetSkillGap?: string;
  recommendationReason: string;
  rating: number;
  enrolledDate?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  type: 'Personal' | 'Academic' | 'Live Industry Challenge';
  industry?: string;
  company?: string;
  description: string;
  requiredSkills: string[];
  duration: string;
  teamSize: string;
  deadline?: string;
  status: 'Open' | 'Joined' | 'In Progress' | 'Under Review' | 'Completed';
  githubRepo?: string;
  liveDemoUrl?: string;
  milestones?: { title: string; completed: boolean }[];
  bountyOrReward?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId: string;
  credentialUrl?: string;
  status: 'Verified' | 'Pending Verification' | 'Not Verified';
  skillsVerified: string[];
  badgeColor?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  category: 'Hackathon' | 'Academic' | 'Open Source' | 'Competition';
  description: string;
  awardRank?: string;
  proofUrl?: string;
  status: 'Verified' | 'Pending Verification';
}

export interface MentorSession {
  id: string;
  mentorId: number;
  mentorName: string;
  mentorCompany: string;
  mentorRole: string;
  topic: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  meetLink?: string;
  feedback?: string;
  rating?: number;
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
  bio?: string;
  sessionsCount?: number;
  rating?: number;
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
  deadline?: string;
  workMode?: string;
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
  verificationStatus?: 'Verified' | 'Pending Verification' | 'Not Verified';
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

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'lab' | 'reading';
  completed: boolean;
  codeSnippet?: string;
  summary?: string;
}

export interface CourseItem extends LearningCourse {
  targetedSkill?: string;
  targetSkillLevel?: number;
  lessons?: CourseLesson[];
  progress?: number;
}

export interface ProjectChallenge {
  id: string;
  title: string;
  sponsorCompany: string;
  bountyReward: string;
  description: string;
  techStack: string[];
  experienceScore: number;
  teamSize: string;
  deadline: string;
  isCompleted?: boolean;
}

export interface FacultyProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  institution: string;
  email: string;
  avatar?: string;
  qualifications: string[];
  experienceYears: number;
  expertise: string[];
  technicalSkills: string[];
  researchInterests: string[];
  profileCompletion: number;
}

export interface FacultyOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Internship' | 'Industrial Training' | 'FDP' | 'Consultancy' | 'Research' | 'Live Project';
  domain: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  deadline: string;
  requiredExpertise: string[];
  matchPercentage: number;
  eligibility: string;
}

export interface FacultyApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  type: 'Internship' | 'Industrial Training' | 'FDP' | 'Consultancy' | 'Research' | 'Live Project';
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
  appliedDate: string;
}

export interface FacultyNotification {
  id: string;
  title: string;
  message: string;
  category: 'Applications' | 'Mentorship' | 'Research' | 'FDP' | 'Collaboration' | 'Events' | 'Deadlines';
  isRead: boolean;
  date: string;
}

export interface StudentForIntervention {
  id: string;
  name: string;
  rollNo: string;
  cgpa: number;
  readiness: number;
  skillGap: string;
  risk: 'Low' | 'Medium' | 'High';
  lastActivity: string;
}

