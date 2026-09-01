import { 
  StudentPipelineRecord, 
  PipelineStage, 
  MentorProfileInfo, 
  TaskSubmissionDetails,
  CapsuleBookingDetails,
  MentorFeedbackRecord
} from '../types/pipeline';
import { mintPassportRecord } from './api';

const STORAGE_KEY = 'ladder_mentor_student_pipeline_v1';

export const CURRENT_MENTOR: MentorProfileInfo = {
  id: 1,
  name: 'Amit Verma',
  role: 'TCS Senior Architect',
  company: 'Tata Consultancy Services',
  experience_years: 12,
  rating: 4.9,
  total_mentored: 48,
  active_in_pipeline: 10,
  capsules_completed: 36,
  conversion_rate: 87,
  tagline: 'Lead Cloud Architect & Career Mentor · 12+ Yrs Experience'
};

export const PIPELINE_STAGES: { stage: PipelineStage; color: string; bg: string; border: string; desc: string }[] = [
  { 
    stage: 'Applied', 
    color: 'text-sky-400', 
    bg: 'bg-sky-500/10', 
    border: 'border-sky-500/30',
    desc: 'New candidate profile submitted for mentorship track'
  },
  { 
    stage: 'Screening', 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-500/10', 
    border: 'border-indigo-500/30',
    desc: 'Skill DNA diagnostic & curriculum vetting underway'
  },
  { 
    stage: 'Task Submitted', 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/30',
    desc: 'Ghost task code repository awaiting mentor code review'
  },
  { 
    stage: 'Interview Scheduled', 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/10', 
    border: 'border-purple-500/30',
    desc: 'Technical mock or architect review round in calendar'
  },
  { 
    stage: 'Capsule Booked', 
    color: 'text-pink-400', 
    bg: 'bg-pink-500/10', 
    border: 'border-pink-500/30',
    desc: '15-min high-impact architecture capsule slot confirmed'
  },
  { 
    stage: 'Onboarded', 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/30',
    desc: 'Successfully placed in enterprise micro-internship / hire track'
  }
];

export const INITIAL_PIPELINE_STUDENTS: StudentPipelineRecord[] = [
  {
    student_id: 1,
    name: 'Adarsh Pratap Singh',
    email: 'adarsh.pratap@mjpru.ac.in',
    course: 'Computer Science & Information Technology',
    year: '4th Year',
    stage: 'Task Submitted',
    skills: ['Node.js', 'Express', 'JWT Auth', 'PostgreSQL', 'Redis'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Review Ghost Task: Express JWT Auth API with Rate Limiting',
    updated_at: 'Today, 02:45 PM',
    college: 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
    target_role: 'Full-Stack Software Engineer',
    dna_score: 84,
    readiness_score: 81,
    task_details: {
      title: 'Ghost Task: Express JWT Auth API with Rate Limiting & Token Blacklist',
      repoUrl: 'https://github.com/aryan-11825114/sih',
      submittedAt: '2 hours ago',
      testsPassed: '3/3 (100%)',
      totalTests: 3,
      passedTests: 3,
      status: 'pending',
      codeSnippet: `// Rate Limiter & Token Blacklisting Middleware in Express
const rateLimit = require('express-rate-limit');
const redisClient = require('./redisClient');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' }
});

const verifyTokenBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  const isRevoked = await redisClient.get(\`bl_\${token}\`);
  if (isRevoked) {
    return res.status(401).json({ error: 'Token has been revoked upon logout' });
  }
  next();
};`,
      score: 96
    },
    capsule_details: {
      slot: 'Today, 4:00 PM',
      date: '2026-09-01',
      time: '16:00',
      topic: 'Express JWT Middleware & Distributed Rate Limiting Review',
      meetingUrl: 'https://meet.google.com/lad-dder-tcs',
      status: 'confirmed',
      durationMinutes: 15
    },
    feedback_history: [
      {
        id: 'fb-101',
        date: '2026-08-20',
        mentorName: 'Amit Verma',
        mentorCompany: 'Tata Consultancy Services',
        rating: 4.8,
        codeQualityRating: 5,
        architectureRating: 4.5,
        problemSolvingRating: 5,
        communicationRating: 4.5,
        strengths: 'Outstanding algorithmic depth and modular Express middleware design.',
        areasForImprovement: 'Include edge-case handling for Redis network timeouts in rate limiter.',
        actionableNextSteps: 'Implement fallback in-memory cache if Redis cluster connection degrades.'
      }
    ]
  },
  {
    student_id: 2,
    name: 'Neha Sharma',
    email: 'neha.sharma@ietlucknow.ac.in',
    course: 'Computer Science & Engineering',
    year: '4th Year',
    stage: 'Capsule Booked',
    skills: ['PostgreSQL', 'Database Indexing', 'Python', 'FastAPI', 'AWS'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Conduct 15-min Architecture Capsule: PostgreSQL Query Tuning',
    updated_at: 'Today, 11:30 AM',
    college: 'Institute of Engineering & Technology, Lucknow',
    target_role: 'Database & Cloud Architect',
    dna_score: 89,
    readiness_score: 88,
    capsule_details: {
      slot: 'Tomorrow, 11:30 AM (15 Mins)',
      date: '2026-09-02',
      time: '11:30',
      topic: 'PostgreSQL Composite Indexing & Connection Pool Sizing',
      meetingUrl: 'https://meet.google.com/lad-tcs-pool',
      status: 'confirmed',
      durationMinutes: 15
    },
    task_details: {
      title: 'Micro-Gig: PostgreSQL Query Optimization & Pool Tuning',
      repoUrl: 'https://github.com/aryan-11825114/sih',
      submittedAt: 'Yesterday, 6:00 PM',
      testsPassed: '2/2 (100%)',
      totalTests: 2,
      passedTests: 2,
      status: 'approved',
      score: 98
    }
  },
  {
    student_id: 3,
    name: 'Rohan Joshi',
    email: 'rohan.j@knit.ac.in',
    course: 'Information Technology',
    year: '3rd Year',
    stage: 'Interview Scheduled',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'GraphQL'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Technical System Design Mock Round (Frontend State Architecture)',
    updated_at: 'Yesterday, 04:15 PM',
    college: 'Kamla Nehru Institute of Technology, Sultanpur',
    target_role: 'Frontend Systems Engineer',
    dna_score: 78,
    readiness_score: 75,
    capsule_details: {
      slot: 'Thursday, 3:00 PM',
      date: '2026-09-03',
      time: '15:00',
      topic: 'Complex State Management & WebSocket Realtime Rendering',
      meetingUrl: 'https://meet.google.com/lad-front-arch',
      status: 'scheduled',
      durationMinutes: 30
    }
  },
  {
    student_id: 4,
    name: 'Ananya Roy',
    email: 'ananya.roy@hbtu.ac.in',
    course: 'Artificial Intelligence & Data Science',
    year: '4th Year',
    stage: 'Onboarded',
    skills: ['PyTorch', 'FastAPI', 'Docker', 'MLOps', 'Vector Embeddings'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Initiated 6-Month Enterprise Micro-Internship at TCS Research Labs',
    updated_at: '2 days ago',
    college: 'Harcourt Butler Technical University, Kanpur',
    target_role: 'Applied AI & MLOps Engineer',
    dna_score: 93,
    readiness_score: 95,
    feedback_history: [
      {
        id: 'fb-102',
        date: '2026-08-28',
        mentorName: 'Amit Verma',
        mentorCompany: 'Tata Consultancy Services',
        rating: 5.0,
        codeQualityRating: 5,
        architectureRating: 5,
        problemSolvingRating: 5,
        communicationRating: 4.8,
        strengths: 'Exceptional mastery of RAG pipelines, quantization, and containerized serving.',
        areasForImprovement: 'Keep exploring asynchronous batching under high telemetry loads.',
        actionableNextSteps: 'Assigned to TCS Enterprise Generative AI Foundation team.'
      }
    ]
  },
  {
    student_id: 5,
    name: 'Kavya Pillai',
    email: 'kavya.p@mjpru.ac.in',
    course: 'Computer Science & Information Technology',
    year: '3rd Year',
    stage: 'Screening',
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'Docker'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Evaluate Spring Boot Event-Driven Microservice Architecture diagnostic',
    updated_at: 'Today, 09:10 AM',
    college: 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly',
    target_role: 'Backend Microservices Developer',
    dna_score: 76,
    readiness_score: 72
  },
  {
    student_id: 6,
    name: 'Siddharth Nair',
    email: 'siddharth.n@nitk.edu.in',
    course: 'Electronics & Communication Engineering',
    year: '3rd Year',
    stage: 'Applied',
    skills: ['C++', 'Embedded Linux', 'IoT', 'MQTT', 'RTOS'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Initial screening of Industrial IoT Ghost Task eligibility',
    updated_at: '3 hours ago',
    college: 'National Institute of Technology Karnataka, Surathkal',
    target_role: 'Embedded Systems & IoT Architect',
    dna_score: 82,
    readiness_score: 79
  },
  {
    student_id: 7,
    name: 'Tanvi Desai',
    email: 'tanvi.desai@pict.edu.in',
    course: 'Computer Science & Engineering',
    year: '2nd Year',
    stage: 'Applied',
    skills: ['Python', 'Django', 'PostgreSQL', 'Git', 'Linux'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Send diagnostic skill test link for Backend Foundations Track',
    updated_at: '1 day ago',
    college: 'Pune Institute of Computer Technology, Pune',
    target_role: 'Full-Stack Developer Intern',
    dna_score: 71,
    readiness_score: 68
  },
  {
    student_id: 8,
    name: 'Vikram Choudhury',
    email: 'vikram.c@bits.ac.in',
    course: 'Computer Science & Engineering',
    year: '4th Year',
    stage: 'Task Submitted',
    skills: ['Go (Golang)', 'gRPC', 'Kubernetes', 'Prometheus', 'Distributed Systems'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Review Ghost Task: High-Throughput gRPC Order Processing Service',
    updated_at: '4 hours ago',
    college: 'BITS Pilani, Pilani Campus',
    target_role: 'Distributed Systems Engineer',
    dna_score: 91,
    readiness_score: 90,
    task_details: {
      title: 'Ghost Task: High-Throughput gRPC Service with Protobuf & Distributed Tracing',
      repoUrl: 'https://github.com/aryan-11825114/sih',
      submittedAt: '4 hours ago',
      testsPassed: '5/5 (100%)',
      totalTests: 5,
      passedTests: 5,
      status: 'pending',
      codeSnippet: `// Golang gRPC Service Implementation with OpenTelemetry
package main

import (
  "context"
  "log"
  "net"
  "google.golang.org/grpc"
  pb "github.com/ladder/proto/orders"
)

type server struct {
  pb.UnimplementedOrderServiceServer
}

func (s *server) ProcessOrder(ctx context.Context, in *pb.OrderRequest) (*pb.OrderResponse, error) {
  log.Printf("Received order for processing: %v", in.GetOrderId())
  // Concurrent validation and lock allocation
  return &pb.OrderResponse{Success: true, Status: "PROCESSED_IN_12MS"}, nil
}`,
      score: 99
    }
  },
  {
    student_id: 9,
    name: 'Meera Iyer',
    email: 'meera.iyer@ceg.ac.in',
    course: 'Information Technology',
    year: '4th Year',
    stage: 'Interview Scheduled',
    skills: ['Cybersecurity', 'OWASP Top 10', 'Penetration Testing', 'Burp Suite', 'OAuth 2.0'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Conduct Senior Security Architecture Capsule & Threat Modeling',
    updated_at: 'Yesterday, 02:00 PM',
    college: 'College of Engineering, Guindy, Chennai',
    target_role: 'Application Security Engineer',
    dna_score: 87,
    readiness_score: 85,
    capsule_details: {
      slot: 'Friday, 4:30 PM',
      date: '2026-09-04',
      time: '16:30',
      topic: 'API Threat Modeling & Zero-Trust Authentication Protocols',
      meetingUrl: 'https://meet.google.com/lad-sec-capsule',
      status: 'confirmed',
      durationMinutes: 15
    }
  },
  {
    student_id: 10,
    name: 'Aman Deep',
    email: 'aman.deep@thapar.edu',
    course: 'Computer Science & Engineering',
    year: '3rd Year',
    stage: 'Screening',
    skills: ['React Native', 'Mobile UI', 'TypeScript', 'Firebase', 'State Machines'],
    mentor_id: 1,
    mentor_name: 'Amit Verma',
    mentor_role: 'TCS Senior Architect',
    mentor_company: 'Tata Consultancy Services',
    next_action: 'Review portfolio mobile apps and offline sync architecture',
    updated_at: '2 days ago',
    college: 'Thapar Institute of Engineering and Technology, Patiala',
    target_role: 'Mobile Systems Engineer',
    dna_score: 75,
    readiness_score: 74
  }
];

export class MentorPipelineService {
  private static getStoredList(): StudentPipelineRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PIPELINE_STUDENTS));
        return INITIAL_PIPELINE_STUDENTS;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PIPELINE_STUDENTS));
        return INITIAL_PIPELINE_STUDENTS;
      }
      return parsed;
    } catch (e) {
      return INITIAL_PIPELINE_STUDENTS;
    }
  }

  private static saveList(records: StudentPipelineRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to persist student pipeline list to localStorage:', e);
    }
  }

  public static async getPipelineStudents(): Promise<StudentPipelineRecord[]> {
    // Try fetching from backend API if online
    try {
      const res = await fetch('/api/mentor/pipeline');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.saveList(data);
          return data;
        }
      }
    } catch (err) {
      // Fallback to local storage
    }
    return this.getStoredList();
  }

  public static getMentorProfile(): MentorProfileInfo {
    const list = this.getStoredList();
    const active = list.filter(s => s.stage !== 'Onboarded').length;
    const onboarded = list.filter(s => s.stage === 'Onboarded').length;
    const rate = list.length > 0 ? Math.round((onboarded / list.length) * 100) : 87;

    return {
      ...CURRENT_MENTOR,
      active_in_pipeline: active,
      total_mentored: 40 + onboarded,
      conversion_rate: rate > 0 ? rate : 85
    };
  }

  public static updateStudentStage(studentId: number | string, newStage: PipelineStage): StudentPipelineRecord[] {
    const list = this.getStoredList();
    const updated = list.map(item => {
      if (String(item.student_id) === String(studentId)) {
        let nextAction = item.next_action;
        if (newStage === 'Applied') nextAction = 'Review application and conduct initial screening';
        else if (newStage === 'Screening') nextAction = 'Assess Skill DNA diagnostic & verify curriculum fundamentals';
        else if (newStage === 'Task Submitted') nextAction = 'Inspect submitted code repository and test outcomes';
        else if (newStage === 'Interview Scheduled') nextAction = 'Conduct mock technical system design round';
        else if (newStage === 'Capsule Booked') nextAction = 'Conduct 15-min high-impact architect capsule sprint';
        else if (newStage === 'Onboarded') nextAction = 'Candidate placed! Monitor first sprint micro-internship deliverables';

        return {
          ...item,
          stage: newStage,
          next_action: nextAction,
          updated_at: 'Just now'
        };
      }
      return item;
    });

    this.saveList(updated);
    return updated;
  }

  public static scheduleCapsuleSlot(
    studentId: number | string,
    slotData: {
      date: string;
      time: string;
      topic: string;
      meetingUrl?: string;
      durationMinutes?: number;
      advanceStage?: boolean;
    }
  ): StudentPipelineRecord[] {
    const list = this.getStoredList();
    const updated = list.map(item => {
      if (String(item.student_id) === String(studentId)) {
        const capsuleDetails: CapsuleBookingDetails = {
          slot: `${slotData.date} at ${slotData.time} (${slotData.durationMinutes || 15} Mins)`,
          date: slotData.date,
          time: slotData.time,
          topic: slotData.topic,
          meetingUrl: slotData.meetingUrl || `https://meet.google.com/lad-${Math.random().toString(36).substring(2, 7)}`,
          status: 'confirmed',
          durationMinutes: slotData.durationMinutes || 15
        };

        const targetStage: PipelineStage = slotData.advanceStage !== false ? 'Capsule Booked' : item.stage;

        return {
          ...item,
          stage: targetStage,
          capsule_details: capsuleDetails,
          next_action: `Capsule Scheduled: "${slotData.topic}" (${slotData.date} at ${slotData.time})`,
          updated_at: 'Just now'
        };
      }
      return item;
    });

    this.saveList(updated);
    return updated;
  }

  public static async reviewTaskSubmission(
    studentId: number | string,
    reviewData: {
      status: 'approved' | 'changes_requested';
      score: number;
      feedback: string;
      mintPassport?: boolean;
      advanceToNextStage?: boolean;
    }
  ): Promise<StudentPipelineRecord[]> {
    const list = this.getStoredList();
    const student = list.find(s => String(s.student_id) === String(studentId));

    if (student && reviewData.mintPassport && reviewData.status === 'approved') {
      try {
        await mintPassportRecord({
          studentId: Number(student.student_id) || 1,
          title: student.task_details?.title || 'Ghost Task: Enterprise Micro-Service Architecture',
          company: student.mentor_company || 'Tata Consultancy Services',
          score: reviewData.score || 95,
          skillsVerified: student.skills || ['Backend Architecture', 'Distributed Systems']
        });
      } catch (e) {
        console.warn('Mint passport caught:', e);
      }
    }

    const updated = list.map(item => {
      if (String(item.student_id) === String(studentId)) {
        const currentTask = item.task_details || {
          title: 'Ghost Task Deliverable',
          repoUrl: 'https://github.com/aryan-11825114/sih',
          submittedAt: 'Today',
          testsPassed: '3/3 (100%)',
          totalTests: 3,
          passedTests: 3,
          status: reviewData.status
        };

        let newStage = item.stage;
        let nextAction = item.next_action;

        if (reviewData.status === 'approved') {
          if (reviewData.advanceToNextStage) {
            newStage = 'Interview Scheduled';
            nextAction = 'Task Passed (Score: ' + reviewData.score + '/100). Schedule Technical Mock Interview.';
          } else {
            nextAction = 'Task Approved (' + reviewData.score + '/100). Blockchain passport minted.';
          }
        } else {
          nextAction = 'Changes Requested: ' + reviewData.feedback.slice(0, 60) + '...';
        }

        return {
          ...item,
          stage: newStage,
          next_action: nextAction,
          updated_at: 'Just now',
          task_details: {
            ...currentTask,
            status: reviewData.status,
            score: reviewData.score,
            feedback: reviewData.feedback
          }
        };
      }
      return item;
    });

    this.saveList(updated);
    return updated;
  }

  public static sendMentorFeedback(
    studentId: number | string,
    feedback: {
      rating: number;
      codeQualityRating: number;
      architectureRating: number;
      problemSolvingRating: number;
      communicationRating: number;
      strengths: string;
      areasForImprovement: string;
      actionableNextSteps: string;
    }
  ): StudentPipelineRecord[] {
    const list = this.getStoredList();
    const updated = list.map(item => {
      if (String(item.student_id) === String(studentId)) {
        const newRecord: MentorFeedbackRecord = {
          id: `fb-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          mentorName: item.mentor_name || 'Amit Verma',
          mentorCompany: item.mentor_company || 'Tata Consultancy Services',
          ...feedback
        };

        const existingHistory = item.feedback_history || [];

        return {
          ...item,
          feedback_history: [newRecord, ...existingHistory],
          next_action: `Feedback Logged: ${feedback.actionableNextSteps.slice(0, 50)}...`,
          updated_at: 'Just now'
        };
      }
      return item;
    });

    this.saveList(updated);
    return updated;
  }

  public static addStudentToPipeline(newStudent: Partial<StudentPipelineRecord>): StudentPipelineRecord[] {
    const list = this.getStoredList();
    const id = Date.now();
    const record: StudentPipelineRecord = {
      student_id: id,
      name: newStudent.name || 'New Candidate',
      email: newStudent.email || `candidate.${id}@college.edu`,
      course: newStudent.course || 'Computer Science & Engineering',
      year: newStudent.year || '3rd Year',
      stage: (newStudent.stage as PipelineStage) || 'Applied',
      skills: newStudent.skills && newStudent.skills.length > 0 ? newStudent.skills : ['JavaScript', 'Python', 'SQL'],
      mentor_id: CURRENT_MENTOR.id,
      mentor_name: CURRENT_MENTOR.name,
      mentor_role: CURRENT_MENTOR.role,
      mentor_company: CURRENT_MENTOR.company,
      next_action: newStudent.next_action || 'Initial profile review & skill screening',
      updated_at: 'Just now',
      college: newStudent.college || 'Engineering Institute',
      target_role: newStudent.target_role || 'Software Engineer Intern',
      dna_score: newStudent.dna_score || 75,
      readiness_score: newStudent.readiness_score || 72
    };

    const updated = [record, ...list];
    this.saveList(updated);
    return updated;
  }

  public static deleteStudentFromPipeline(studentId: number | string): StudentPipelineRecord[] {
    const list = this.getStoredList();
    const updated = list.filter(item => String(item.student_id) !== String(studentId));
    this.saveList(updated);
    return updated;
  }
}
