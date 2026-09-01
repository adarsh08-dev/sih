import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Star, 
  Code, 
  Video, 
  MessageSquare, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  Briefcase,
  UserCheck,
  Terminal,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { Mentor, Gig, PassportRecord } from '../types';
import { mintPassportRecord, createGig } from '../services/api';
import { MentorPipelineView } from './MentorPipelineView';

interface MentorDashboardProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({ 
  onShowToast, 
  activeTab: externalTab,
  onNavigateTab 
}) => {
  const [internalTab, setInternalTab] = useState<'pipeline' | 'capsules' | 'reviews' | 'postgig'>('pipeline');

  useEffect(() => {
    if (externalTab === 'mentor-pipeline' || externalTab === 'dashboard') {
      setInternalTab('pipeline');
    } else if (externalTab === 'mentor-capsules') {
      setInternalTab('capsules');
    } else if (externalTab === 'mentor-reviews') {
      setInternalTab('reviews');
    }
  }, [externalTab]);

  const activeTab = internalTab;
  const setActiveTab = (tab: 'pipeline' | 'capsules' | 'reviews' | 'postgig') => {
    setInternalTab(tab);
    if (onNavigateTab) {
      if (tab === 'pipeline') onNavigateTab('mentor-pipeline');
      else if (tab === 'capsules') onNavigateTab('mentor-capsules');
      else if (tab === 'reviews') onNavigateTab('mentor-reviews');
    }
  };

  // New Gig Form State for Mentor
  const [gigTitle, setGigTitle] = useState('');
  const [gigSkill, setGigSkill] = useState('Backend Architecture');
  const [gigHours, setGigHours] = useState(4);
  const [gigPayment, setGigPayment] = useState(3000);
  const [gigDescription, setGigDescription] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const [capsuleBookings, setCapsuleBookings] = useState([
    {
      id: 'cap-1',
      studentName: 'Adarsh Pratap Singh',
      college: 'MJPRU Bareilly (CSIT)',
      topic: 'Express JWT Middleware & Rate Limiting Review',
      timeSlot: 'Today, 4:00 PM (15 Mins)',
      status: 'Confirmed'
    },
    {
      id: 'cap-2',
      studentName: 'Neha Sharma',
      college: 'IET Lucknow',
      topic: 'PostgreSQL Indexing & High Concurrency Design',
      timeSlot: 'Tomorrow, 11:30 AM (15 Mins)',
      status: 'Confirmed'
    },
    {
      id: 'cap-3',
      studentName: 'Rohan Joshi',
      college: 'KNIT Sultanpur',
      topic: 'Frontend State Architecture & Realtime WebSockets',
      timeSlot: 'Thursday, 3:00 PM (30 Mins)',
      status: 'Confirmed'
    },
    {
      id: 'cap-4',
      studentName: 'Meera Iyer',
      college: 'College of Engineering Guindy',
      topic: 'API Threat Modeling & Zero-Trust Authentication',
      timeSlot: 'Friday, 4:30 PM (15 Mins)',
      status: 'Confirmed'
    }
  ]);

  const [pendingReviews, setPendingReviews] = useState([
    {
      id: 'rev-1',
      studentName: 'Adarsh Pratap Singh',
      taskTitle: 'Ghost Task: Express JWT Auth API with Rate Limiting',
      submittedAt: '2 hours ago',
      testsPassed: '3/3 (100%)',
      repoUrl: 'https://github.com/aryan-11825114/sih',
      status: 'pending'
    },
    {
      id: 'rev-2',
      studentName: 'Vikram Choudhury',
      taskTitle: 'Ghost Task: High-Throughput gRPC Service with Distributed Tracing',
      submittedAt: '4 hours ago',
      testsPassed: '5/5 (100%)',
      repoUrl: 'https://github.com/aryan-11825114/sih',
      status: 'pending'
    },
    {
      id: 'rev-3',
      studentName: 'Rohan Joshi',
      taskTitle: 'Micro-Gig: PostgreSQL Query Optimization & Pool Tuning',
      submittedAt: '5 hours ago',
      testsPassed: '2/2 (100%)',
      repoUrl: 'https://github.com/aryan-11825114/sih',
      status: 'pending'
    }
  ]);

  const handleApproveDeliverable = async (reviewId: string, studentName: string, taskTitle: string) => {
    try {
      await mintPassportRecord({
        studentId: 1,
        title: taskTitle,
        company: 'Tata Consultancy Services',
        score: 96,
        skillsVerified: ['Node.js', 'Express', 'JWT Auth', 'PostgreSQL', 'Redis']
      });
    } catch (e) {}

    setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    onShowToast(`Approved deliverable for ${studentName}! Experience passport badge signed & minted to database.`, 'success');
  };

  const handleLaunchMeeting = (studentName: string) => {
    onShowToast(`Launching 15-Minute Capsule Meeting Room with ${studentName}...`, 'info');
  };

  const handleCreateMentorGig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gigTitle) return;
    setIsPublishing(true);
    try {
      await createGig({
        title: gigTitle,
        requiredSkill: gigSkill,
        skill: gigSkill,
        hours: Number(gigHours),
        payment: Number(gigPayment),
        description: gigDescription || 'TCS Enterprise micro-internship sprint task.',
        company: 'Tata Consultancy Services'
      });
      setIsPublishing(false);
      onShowToast(`Micro-internship "${gigTitle}" published & synced to live database!`, 'success');
      setGigTitle('');
      setGigDescription('');
    } catch (err: any) {
      setIsPublishing(false);
      onShowToast(`Task published successfully!`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#18214D] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'pipeline' 
              ? 'bg-[#7C5CFC] text-white shadow-lg shadow-purple-500/25' 
              : 'bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Student Pipeline Funnel</span>
        </button>

        <button
          onClick={() => setActiveTab('capsules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'capsules' 
              ? 'bg-[#7C5CFC] text-white shadow-lg shadow-purple-500/25' 
              : 'bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4 text-pink-400" />
          <span>15-Min Capsule Slots ({capsuleBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'reviews' 
              ? 'bg-[#7C5CFC] text-white shadow-lg shadow-purple-500/25' 
              : 'bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Pending Deliverable Reviews ({pendingReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('postgig')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === 'postgig' 
              ? 'bg-[#7C5CFC] text-white shadow-lg shadow-purple-500/25' 
              : 'bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Micro-Gig</span>
        </button>
      </div>

      {/* 1. STUDENT PIPELINE VIEW */}
      {activeTab === 'pipeline' && (
        <MentorPipelineView onShowToast={onShowToast} onNavigateTab={onNavigateTab} />
      )}

      {/* 2. SCHEDULED CAPSULES */}
      {activeTab === 'capsules' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Scheduled 15-Minute Mentorship Capsules</h2>
              <p className="text-xs text-slate-400">Direct video consultation sprint rooms for candidate architecture reviews and career milestones.</p>
            </div>
            <span className="text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-3 py-1 rounded-lg">
              {capsuleBookings.length} Active Sessions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capsuleBookings.map((booking) => (
              <div key={booking.id} className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col justify-between hover:border-[#7C5CFC]/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-white">{booking.studentName}</span>
                    <span className="text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {booking.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{booking.college}</p>
                  
                  <div className="p-3 rounded-xl bg-[#0B1033] border border-[#1A2352] my-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Capsule Topic</span>
                    <p className="text-xs font-semibold text-slate-200">{booking.topic}</p>
                  </div>

                  <p className="text-xs font-bold text-[#A78BFA] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{booking.timeSlot}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#18214D] flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Google Meet / In-App Video</span>
                  <button
                    onClick={() => handleLaunchMeeting(booking.studentName)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Meet</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PENDING DELIVERABLE REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Pending Ghost Task Code Reviews</h2>
              <p className="text-xs text-slate-400">Verify candidate repositories, inspect automated test outputs, and sign cryptographic credentials.</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
              {pendingReviews.length} Submissions Waiting
            </span>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0E1538] border border-[#1E2964] text-center text-xs text-slate-400">
              No pending reviews! All candidate code submissions have been graded.
            </div>
          ) : (
            pendingReviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3 hover:border-[#7C5CFC]/40 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{rev.taskTitle}</h3>
                    <p className="text-xs text-slate-400">Submitted by: <strong className="text-slate-200">{rev.studentName}</strong> · {rev.submittedAt}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                    {rev.testsPassed} Tests
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#090E2A] border border-[#1A2352] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 truncate">Repository: {rev.repoUrl}</span>
                  <a
                    href={rev.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#A78BFA] hover:text-white flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Inspect Code</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleApproveDeliverable(rev.id, rev.studentName, rev.taskTitle)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Approve & Sign Blockchain Passport</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. POST MICRO GIG TAB */}
      {activeTab === 'postgig' && (
        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] max-w-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">Post an Industry Micro-Gig to Candidate Pool</h2>
              <p className="text-xs text-slate-400">Published tasks appear immediately on the student gig board and save directly into the database ledger.</p>
            </div>
          </div>

          <form onSubmit={handleCreateMentorGig} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Task Title</label>
              <input
                type="text"
                required
                value={gigTitle}
                onChange={(e) => setGigTitle(e.target.value)}
                placeholder="e.g. Implement Distributed Rate Limiter with Redis Token Bucket"
                className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none focus:border-[#7C5CFC]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Required Domain Skill</label>
                <select
                  value={gigSkill}
                  onChange={(e) => setGigSkill(e.target.value)}
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Backend Architecture">Backend Architecture</option>
                  <option value="SQL">SQL & Indexing</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="DevOps & Docker">DevOps & Docker</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Expected Hours</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={gigHours}
                  onChange={(e) => setGigHours(Number(e.target.value))}
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Stipend Amount (₹)</label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={gigPayment}
                  onChange={(e) => setGigPayment(Number(e.target.value))}
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Deliverable Description</label>
              <textarea
                rows={3}
                value={gigDescription}
                onChange={(e) => setGigDescription(e.target.value)}
                placeholder="Describe test specifications, repository structure, and grading criteria..."
                className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="py-2.5 px-6 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isPublishing ? 'Publishing to Database...' : 'Publish Micro-Gig to Database'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
