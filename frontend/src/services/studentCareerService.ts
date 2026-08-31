import { 
  SkillItem, 
  SkillGapItem, 
  JobOpportunity, 
  ApplicationItem, 
  LearningCourse, 
  ProjectItem, 
  CertificationItem, 
  AchievementItem, 
  AssessmentCategory, 
  AssessmentResult, 
  MentorSession,
  StudentProfile,
  Gig,
  Mentor,
  PassportRecord
} from '../types';

import { 
  INITIAL_SKILLS, 
  INITIAL_SKILL_GAPS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_APPLICATIONS, 
  INITIAL_COURSES, 
  INITIAL_PROJECTS, 
  INITIAL_CERTIFICATIONS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_ASSESSMENT_RESULTS, 
  INITIAL_MENTOR_SESSIONS,
  ASSESSMENT_CATEGORIES
} from '../data/studentCareerData';

// Local storage key constants
const STORAGE_KEYS = {
  SKILLS: 'sb_student_skills_v1',
  SKILL_GAPS: 'sb_student_skill_gaps_v1',
  APPLICATIONS: 'sb_student_applications_v1',
  COURSES: 'sb_student_courses_v1',
  PROJECTS: 'sb_student_projects_v1',
  CERTIFICATIONS: 'sb_student_certifications_v1',
  ACHIEVEMENTS: 'sb_student_achievements_v1',
  ASSESSMENT_RESULTS: 'sb_student_assessment_results_v1',
  MENTOR_SESSIONS: 'sb_student_mentor_sessions_v1'
};

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

// ==========================================
// 1. SKILLS & SCORES MANAGEMENT
// ==========================================
export function getStudentSkills(): SkillItem[] {
  return getFromStorage<SkillItem[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
}

export function saveStudentSkills(skills: SkillItem[]): void {
  saveToStorage(STORAGE_KEYS.SKILLS, skills);
}

export function calculateReadinessMetrics(skills: SkillItem[] = getStudentSkills()) {
  const technicalSkills = skills.filter(s => s.category === 'technical');
  const softSkills = skills.filter(s => s.category === 'soft');

  const techScore = technicalSkills.length > 0 
    ? Math.round(technicalSkills.reduce((acc, s) => acc + s.score, 0) / technicalSkills.length)
    : 81;

  const softScore = softSkills.length > 0
    ? Math.round(softSkills.reduce((acc, s) => acc + s.score, 0) / softSkills.length)
    : 68;

  const overallScore = Math.round((techScore * 0.65) + (softScore * 0.35));
  
  // Industry readiness is weighted by requirement alignment
  const requiredAlignment = skills.reduce((acc, s) => {
    const ratio = Math.min(1.2, s.level / Math.max(1, s.requiredLevel));
    return acc + ratio;
  }, 0) / Math.max(1, skills.length);

  const industryReadiness = Math.min(99, Math.round(overallScore * 0.88 * requiredAlignment));

  const assessmentResults = getAssessmentResults();
  const completedAssessmentsCount = assessmentResults.length;

  return {
    overallSkillScore: overallScore,
    industryReadiness: industryReadiness,
    technicalSkillScore: techScore,
    softSkillScore: softScore,
    completedAssessmentsCount,
    assessmentStatus: completedAssessmentsCount >= 3 ? 'Proficiency Verified' : 'Assessments Incomplete'
  };
}

// ==========================================
// 2. SKILL GAP ANALYSIS
// ==========================================
export function getSkillGaps(): SkillGapItem[] {
  return getFromStorage<SkillGapItem[]>(STORAGE_KEYS.SKILL_GAPS, INITIAL_SKILL_GAPS);
}

export function updateSkillAfterAssessment(categoryTitle: string, score: number): void {
  const skills = getStudentSkills();
  const lowerCat = categoryTitle.toLowerCase();

  let targetSkillId = '';
  if (lowerCat.includes('python')) targetSkillId = 'sk-python';
  else if (lowerCat.includes('dsa') || lowerCat.includes('algorithm')) targetSkillId = 'sk-dsa';
  else if (lowerCat.includes('sql') || lowerCat.includes('database')) targetSkillId = 'sk-postgres';
  else if (lowerCat.includes('react') || lowerCat.includes('web')) targetSkillId = 'sk-react';
  else if (lowerCat.includes('communication') || lowerCat.includes('team')) targetSkillId = 'sk-comm';
  else if (lowerCat.includes('aptitude') || lowerCat.includes('problem')) targetSkillId = 'sk-problemsolving';

  if (targetSkillId) {
    const updated = skills.map(s => {
      if (s.id === targetSkillId) {
        const newScore = Math.round((s.score * 0.3) + (score * 0.7));
        const newLevel = newScore >= 90 ? 5 : newScore >= 75 ? 4 : newScore >= 60 ? 3 : newScore >= 45 ? 2 : 1;
        return {
          ...s,
          score: newScore,
          level: newLevel,
          assessmentScore: score,
          lastAssessed: new Date().toISOString().split('T')[0],
          verified: score >= 70,
          trend: score >= s.score ? ('up' as const) : ('down' as const)
        };
      }
      return s;
    });
    saveStudentSkills(updated);
  }
}

// ==========================================
// 3. DETERMINISTIC SKILL MATCHING ALGORITHM
// ==========================================
export function calculateOpportunityMatch(
  opportunityRequiredSkills: string[],
  studentSkills: SkillItem[] = getStudentSkills()
): {
  matchPercentage: number;
  matchedSkills: string[];
  gapSkills: string[];
  isEligible: boolean;
} {
  if (!opportunityRequiredSkills || opportunityRequiredSkills.length === 0) {
    return { matchPercentage: 85, matchedSkills: [], gapSkills: [], isEligible: true };
  }

  const studentSkillMap = new Map<string, SkillItem>();
  studentSkills.forEach(s => {
    studentSkillMap.set(s.name.toLowerCase(), s);
    if (s.subCategory) studentSkillMap.set(s.subCategory.toLowerCase(), s);
  });

  const matchedSkills: string[] = [];
  const gapSkills: string[] = [];
  let totalScoreWeight = 0;

  opportunityRequiredSkills.forEach(req => {
    const reqLower = req.toLowerCase().trim();
    let found = false;

    for (const [key, skill] of studentSkillMap.entries()) {
      if (key.includes(reqLower) || reqLower.includes(key)) {
        found = true;
        if (skill.level >= skill.requiredLevel || skill.score >= 65) {
          matchedSkills.push(req);
          totalScoreWeight += Math.min(100, skill.score);
        } else {
          gapSkills.push(req);
          totalScoreWeight += Math.min(50, skill.score * 0.6);
        }
        break;
      }
    }

    if (!found) {
      gapSkills.push(req);
      totalScoreWeight += 25; // baseline knowledge
    }
  });

  const rawMatch = Math.round(totalScoreWeight / opportunityRequiredSkills.length);
  const matchPercentage = Math.min(99, Math.max(35, rawMatch));
  const isEligible = matchPercentage >= 60;

  return {
    matchPercentage,
    matchedSkills,
    gapSkills,
    isEligible
  };
}

// ==========================================
// 4. OPPORTUNITIES & APPLICATIONS
// ==========================================
export function getOpportunities(): JobOpportunity[] {
  return INITIAL_OPPORTUNITIES;
}

export function getApplications(): ApplicationItem[] {
  return getFromStorage<ApplicationItem[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
}

export function applyToOpportunity(
  opportunity: JobOpportunity | Gig,
  studentProfile: StudentProfile,
  opportunityType: 'Internship' | 'Job' | 'Micro-Gig' | 'Industry Project' = 'Internship'
): ApplicationItem {
  const currentApps = getApplications();
  const oppId = String(opportunity.id);

  // Check if already applied
  const existing = currentApps.find(a => a.opportunityId === oppId);
  if (existing) {
    return existing;
  }

  const reqSkills = 'requiredSkills' in opportunity && Array.isArray(opportunity.requiredSkills) 
    ? opportunity.requiredSkills 
    : ('skill' in opportunity ? [opportunity.skill] : ['Engineering']);

  const matchData = calculateOpportunityMatch(reqSkills);

  const newApp: ApplicationItem = {
    id: `app-${Date.now()}`,
    opportunityId: oppId,
    opportunityTitle: opportunity.title,
    opportunityType: opportunityType,
    company: opportunity.company,
    location: 'location' in opportunity ? opportunity.location : 'Remote',
    workMode: 'workMode' in opportunity ? (opportunity.workMode as string) : 'Remote',
    stipendOrSalary: 'stipendOrSalary' in opportunity ? opportunity.stipendOrSalary : `₹${'payment' in opportunity ? opportunity.payment : 'Competitive'}`,
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString().split('T')[0],
    deadline: 'applicationDeadline' in opportunity ? (opportunity.applicationDeadline as string) : 'Open',
    matchScore: matchData.matchPercentage,
    notes: `Application lodged with ${studentProfile.name}'s verified SkillBridge profile.`,
    timeline: [
      { status: 'Applied', date: new Date().toISOString().split('T')[0], note: 'Application and Skill DNA submitted successfully', completed: true },
      { status: 'Under Review', date: 'In 24-48 hours', note: 'Automated profile & portfolio verification', completed: false },
      { status: 'Shortlisted', date: 'Pending', note: 'Recruiter cohort shortlisting', completed: false },
      { status: 'Interview', date: 'Pending', note: 'Technical evaluation round', completed: false },
      { status: 'Selected', date: 'Pending', note: 'Final selection and onboarding', completed: false }
    ]
  };

  const updated = [newApp, ...currentApps];
  saveToStorage(STORAGE_KEYS.APPLICATIONS, updated);
  return newApp;
}

export function withdrawApplication(appId: string): void {
  const currentApps = getApplications();
  const updated = currentApps.map(a => {
    if (a.id === appId) {
      return {
        ...a,
        status: 'Withdrawn' as const,
        lastUpdated: new Date().toISOString().split('T')[0],
        timeline: [
          ...a.timeline,
          { status: 'Withdrawn' as const, date: new Date().toISOString().split('T')[0], note: 'Application retracted by student candidate', completed: true }
        ]
      };
    }
    return a;
  });
  saveToStorage(STORAGE_KEYS.APPLICATIONS, updated);
}

// ==========================================
// 5. LEARNING HUB
// ==========================================
export function getLearningCourses(): LearningCourse[] {
  return getFromStorage<LearningCourse[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
}

export function updateCourseProgress(courseId: string, deltaModules: number = 1): LearningCourse[] {
  const courses = getLearningCourses();
  const updated = courses.map(c => {
    if (c.id === courseId) {
      const newCompleted = Math.min(c.modulesCount, c.completedModules + deltaModules);
      const newPercent = Math.round((newCompleted / c.modulesCount) * 100);
      const newStatus = newPercent >= 100 ? ('Completed' as const) : ('In Progress' as const);
      return {
        ...c,
        completedModules: newCompleted,
        progressPercent: newPercent,
        status: newStatus,
        enrolledDate: c.enrolledDate || new Date().toISOString().split('T')[0]
      };
    }
    return c;
  });
  saveToStorage(STORAGE_KEYS.COURSES, updated);
  return updated;
}

// ==========================================
// 6. PROJECTS & CHALLENGES
// ==========================================
export function getProjects(): ProjectItem[] {
  return getFromStorage<ProjectItem[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function addProject(project: Omit<ProjectItem, 'id'>): ProjectItem {
  const current = getProjects();
  const newProj: ProjectItem = {
    ...project,
    id: `proj-${Date.now()}`
  };
  const updated = [newProj, ...current];
  saveToStorage(STORAGE_KEYS.PROJECTS, updated);
  return newProj;
}

export function joinProjectChallenge(projectId: string): void {
  const current = getProjects();
  const updated = current.map(p => {
    if (p.id === projectId) {
      return { ...p, status: 'Joined' as const };
    }
    return p;
  });
  saveToStorage(STORAGE_KEYS.PROJECTS, updated);
}

// ==========================================
// 7. CERTIFICATIONS & ACHIEVEMENTS
// ==========================================
export function getCertifications(): CertificationItem[] {
  return getFromStorage<CertificationItem[]>(STORAGE_KEYS.CERTIFICATIONS, INITIAL_CERTIFICATIONS);
}

export function addCertification(cert: Omit<CertificationItem, 'id'>): CertificationItem {
  const current = getCertifications();
  const newCert: CertificationItem = {
    ...cert,
    id: `cert-${Date.now()}`
  };
  const updated = [newCert, ...current];
  saveToStorage(STORAGE_KEYS.CERTIFICATIONS, updated);
  return newCert;
}

export function getAchievements(): AchievementItem[] {
  return getFromStorage<AchievementItem[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
}

export function addAchievement(ach: Omit<AchievementItem, 'id'>): AchievementItem {
  const current = getAchievements();
  const newAch: AchievementItem = {
    ...ach,
    id: `ach-${Date.now()}`
  };
  const updated = [newAch, ...current];
  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, updated);
  return newAch;
}

// ==========================================
// 8. ASSESSMENTS ENGINE
// ==========================================
export function getAssessmentCategories(): AssessmentCategory[] {
  return ASSESSMENT_CATEGORIES;
}

export function getAssessmentResults(): AssessmentResult[] {
  return getFromStorage<AssessmentResult[]>(STORAGE_KEYS.ASSESSMENT_RESULTS, INITIAL_ASSESSMENT_RESULTS);
}

export function recordAssessmentSubmission(result: Omit<AssessmentResult, 'id'>): AssessmentResult {
  const current = getAssessmentResults();
  const newRes: AssessmentResult = {
    ...result,
    id: `res-${Date.now()}`
  };
  const updated = [newRes, ...current];
  saveToStorage(STORAGE_KEYS.ASSESSMENT_RESULTS, updated);

  // Sync skill scores
  updateSkillAfterAssessment(result.assessmentTitle, result.score);

  return newRes;
}

// ==========================================
// 9. MENTOR SESSIONS
// ==========================================
export function getMentorSessions(): MentorSession[] {
  return getFromStorage<MentorSession[]>(STORAGE_KEYS.MENTOR_SESSIONS, INITIAL_MENTOR_SESSIONS);
}

export function bookNewMentorSession(session: Omit<MentorSession, 'id'>): MentorSession {
  const current = getMentorSessions();
  const newSess: MentorSession = {
    ...session,
    id: `sess-${Date.now()}`
  };
  const updated = [newSess, ...current];
  saveToStorage(STORAGE_KEYS.MENTOR_SESSIONS, updated);
  return newSess;
}

// ==========================================
// 10. GLOBAL SEARCH ENGINE
// ==========================================
export interface SearchResultItem {
  id: string;
  type: 'skill' | 'job' | 'internship' | 'gig' | 'mentor' | 'course' | 'project';
  title: string;
  subtitle: string;
  badge?: string;
  targetTab: string;
}

export function performGlobalSearch(
  query: string,
  gigs: Gig[] = [],
  mentors: Mentor[] = []
): SearchResultItem[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // 1. Search skills
  getStudentSkills().forEach(s => {
    if (s.name.toLowerCase().includes(q) || s.subCategory?.toLowerCase().includes(q)) {
      results.push({
        id: s.id,
        type: 'skill',
        title: s.name,
        subtitle: `Level ${s.level} • ${s.category.toUpperCase()} • Score: ${s.score}%`,
        badge: s.verified ? 'Verified' : 'Pending',
        targetTab: 'skills'
      });
    }
  });

  // 2. Search Jobs & Internships
  getOpportunities().forEach(opp => {
    if (
      opp.title.toLowerCase().includes(q) ||
      opp.company.toLowerCase().includes(q) ||
      opp.requiredSkills.some(s => s.toLowerCase().includes(q))
    ) {
      results.push({
        id: opp.id,
        type: opp.opportunityType === 'Internship' ? 'internship' : 'job',
        title: opp.title,
        subtitle: `${opp.company} • ${opp.location} • ${opp.stipendOrSalary}`,
        badge: opp.opportunityType,
        targetTab: 'jobs'
      });
    }
  });

  // 3. Search Gigs
  gigs.forEach(g => {
    if (g.title.toLowerCase().includes(q) || g.company.toLowerCase().includes(q) || g.skill.toLowerCase().includes(q)) {
      results.push({
        id: String(g.id),
        type: 'gig',
        title: g.title,
        subtitle: `${g.company} • ₹${g.payment} • ${g.hours} Hours`,
        badge: 'Micro-Gig',
        targetTab: 'gigs'
      });
    }
  });

  // 4. Search Mentors
  mentors.forEach(m => {
    if (m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)) {
      results.push({
        id: String(m.id),
        type: 'mentor',
        title: m.name,
        subtitle: `${m.role} @ ${m.company} • ${m.experience} Yrs Experience`,
        badge: `${m.match}% Match`,
        targetTab: 'mentors'
      });
    }
  });

  // 5. Search Courses
  getLearningCourses().forEach(c => {
    if (c.title.toLowerCase().includes(q) || c.skillsCovered.some(s => s.toLowerCase().includes(q))) {
      results.push({
        id: c.id,
        type: 'course',
        title: c.title,
        subtitle: `${c.provider} • ${c.duration} • ${c.status}`,
        badge: c.level,
        targetTab: 'learning'
      });
    }
  });

  // 6. Search Projects
  getProjects().forEach(p => {
    if (p.title.toLowerCase().includes(q) || p.requiredSkills.some(s => s.toLowerCase().includes(q))) {
      results.push({
        id: p.id,
        type: 'project',
        title: p.title,
        subtitle: `${p.type} • ${p.duration} • ${p.status}`,
        badge: p.status,
        targetTab: 'projects'
      });
    }
  });

  return results.slice(0, 8);
}
