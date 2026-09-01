import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  User, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Trash2, 
  X, 
  FileText, 
  Star, 
  ChevronRight, 
  Sparkles, 
  CheckSquare, 
  Square,
  BookOpen,
  Target,
  Mail,
  Phone,
  ArrowUpRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { FacultyStudentMentorship, MenteeSession } from '../types';
import { 
  getStoredMentorshipProfiles, 
  saveStoredMentorshipProfiles 
} from '../data/facultyCollaborationData';

interface StudentMentorshipViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const StudentMentorshipView: React.FC<StudentMentorshipViewProps> = ({ 
  onShowToast = () => {} 
}) => {
  const [mentees, setMentees] = useState<FacultyStudentMentorship[]>(getStoredMentorshipProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [trackFilter, setTrackFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'sessions-desc' | 'cgpa-desc' | 'name'>('sessions-desc');

  // Modals
  const [selectedMentee, setSelectedMentee] = useState<FacultyStudentMentorship | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMentee, setEditingMentee] = useState<FacultyStudentMentorship | null>(null);
  const [deletingMentee, setDeletingMentee] = useState<FacultyStudentMentorship | null>(null);

  // Quick Session Log Modal
  const [isLogSessionModalOpen, setIsLogSessionModalOpen] = useState(false);
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [newSessionSummary, setNewSessionSummary] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<FacultyStudentMentorship>>({
    studentName: '',
    rollNo: '',
    program: 'B.Tech Computer Science & Engineering',
    semester: 'Semester VII (Final Year)',
    cgpa: 8.5,
    email: '',
    phone: '+91 98765 43210',
    mentorshipArea: 'AI Research & Tier-1 Masters Prep',
    mentor: 'Dr. Arvind K. Sharma (HOD & Faculty Mentor)',
    sessionsCompleted: 1,
    totalPlannedSessions: 8,
    status: 'Active/Ongoing',
    startDate: '2026-08-01',
    targetCareerGoal: 'Tier-1 Product Company SDE / Top University Master’s Program',
    skillGapsIdentified: ['System Design LLD', 'Advanced Algorithms'],
    strengths: ['Curious', 'Diligent', 'Strong Core Foundation'],
    rating: 4.8,
    recentNotes: 'Mentee is showing consistent progress in algorithmic thinking and interview readiness.'
  });

  const [skillsGapsInput, setSkillsGapsInput] = useState('');
  const [strengthsInput, setStrengthsInput] = useState('');

  const syncMentees = (updated: FacultyStudentMentorship[]) => {
    setMentees(updated);
    saveStoredMentorshipProfiles(updated);
  };

  // Filter & Sort
  const filteredMentees = useMemo(() => {
    return mentees
      .filter(m => {
        const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
        const matchesTrack = trackFilter === 'All' || m.mentorshipArea.toLowerCase().includes(trackFilter.toLowerCase());
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          m.studentName.toLowerCase().includes(q) ||
          m.rollNo.toLowerCase().includes(q) ||
          m.mentorshipArea.toLowerCase().includes(q) ||
          m.mentor.toLowerCase().includes(q) ||
          m.targetCareerGoal.toLowerCase().includes(q);

        return matchesStatus && matchesTrack && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'sessions-desc') return b.sessionsCompleted - a.sessionsCompleted;
        if (sortBy === 'cgpa-desc') return b.cgpa - a.cgpa;
        if (sortBy === 'name') return a.studentName.localeCompare(b.studentName);
        return 0;
      });
  }, [mentees, statusFilter, trackFilter, searchQuery, sortBy]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalCount = mentees.length;
    const activeCount = mentees.filter(m => m.status === 'Active/Ongoing').length;
    const completedCount = mentees.filter(m => m.status === 'Completed').length;
    const totalSessions = mentees.reduce((acc, m) => acc + m.sessionsCompleted, 0);
    const avgCgpa = totalCount > 0 ? (mentees.reduce((acc, m) => acc + m.cgpa, 0) / totalCount).toFixed(2) : '8.50';

    return {
      totalCount,
      activeCount,
      completedCount,
      totalSessions,
      avgCgpa
    };
  }, [mentees]);

  // Unique Mentorship Tracks
  const uniqueTracks = useMemo(() => {
    const tracks = new Set(mentees.map(m => m.mentorshipArea));
    return Array.from(tracks);
  }, [mentees]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingMentee(null);
    setFormData({
      studentName: '',
      rollNo: `2301040${Math.floor(10 + Math.random() * 90)}`,
      program: 'B.Tech Computer Science & Engineering',
      semester: 'Semester VII (Final Year)',
      cgpa: 8.6,
      email: '',
      phone: '+91 98765 43210',
      mentorshipArea: 'AI Research & Tier-1 Masters Prep',
      mentor: 'Dr. Arvind K. Sharma (HOD & Faculty Mentor)',
      sessionsCompleted: 1,
      totalPlannedSessions: 8,
      status: 'Active/Ongoing',
      startDate: '2026-08-01',
      targetCareerGoal: 'Tier-1 Product Company SDE / Top University Master’s Program',
      rating: 4.8,
      recentNotes: 'Orientation session complete. Roadmaps charted.'
    });
    setSkillsGapsInput('System Design LLD, Advanced Concurrency');
    setStrengthsInput('High Problem-Solving Aptitude, Diligent');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (m: FacultyStudentMentorship, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMentee(m);
    setFormData({ ...m });
    setSkillsGapsInput(m.skillGapsIdentified ? m.skillGapsIdentified.join(', ') : '');
    setStrengthsInput(m.strengths ? m.strengths.join(', ') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName?.trim()) {
      onShowToast('Please provide mentee student name.', 'error');
      return;
    }
    if (!formData.rollNo?.trim()) {
      onShowToast('Please provide student university roll number.', 'error');
      return;
    }

    const gaps = skillsGapsInput.split(',').map(s => s.trim()).filter(Boolean);
    const str = strengthsInput.split(',').map(s => s.trim()).filter(Boolean);

    if (editingMentee) {
      const updated = mentees.map(m => {
        if (m.id === editingMentee.id) {
          return {
            ...m,
            ...formData,
            skillGapsIdentified: gaps.length > 0 ? gaps : m.skillGapsIdentified,
            strengths: str.length > 0 ? str : m.strengths
          } as FacultyStudentMentorship;
        }
        return m;
      });
      syncMentees(updated);
      onShowToast(`Updated mentorship record for: ${formData.studentName}`, 'success');
    } else {
      const newMentee: FacultyStudentMentorship = {
        id: `ment-${Date.now()}`,
        studentName: formData.studentName || 'Student Mentee',
        rollNo: formData.rollNo || '230104011',
        program: formData.program || 'B.Tech CSE',
        semester: formData.semester || 'Semester VII',
        cgpa: Number(formData.cgpa) || 8.5,
        email: formData.email || `${formData.studentName?.toLowerCase().replace(/\s+/g, '.')}@mjpru.ac.in`,
        phone: formData.phone || '+91 98765 43210',
        mentorshipArea: formData.mentorshipArea || 'Career & Technical Excellence',
        mentor: formData.mentor || 'Dr. Arvind K. Sharma (HOD & Faculty Mentor)',
        sessionsCompleted: Number(formData.sessionsCompleted) || 1,
        totalPlannedSessions: Number(formData.totalPlannedSessions) || 8,
        status: (formData.status as any) || 'Active/Ongoing',
        startDate: formData.startDate || '2026-08-01',
        targetCareerGoal: formData.targetCareerGoal || 'Top Tier Software Development Engineer',
        skillGapsIdentified: gaps.length > 0 ? gaps : ['System Design', 'Mock Interview Polish'],
        strengths: str.length > 0 ? str : ['Quick Learner', 'Strong Programming Fundamentals'],
        rating: Number(formData.rating) || 4.8,
        recentNotes: formData.recentNotes || 'Mentorship roadmap initialized.',
        actionChecklist: [
          { id: 'ac1', task: 'Complete Initial Diagnostic Assessment', completed: true, dueDate: '2026-09-10' },
          { id: 'ac2', task: 'Submit Milestone 1 Technical Review', completed: false, dueDate: '2026-09-25' }
        ],
        sessionLogs: [
          {
            id: `sl-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            topic: 'Initial Career Assessment & Roadmapping',
            duration: '45 mins',
            summary: 'Mapped academic interests with placement targets and technical skill gaps.',
            actionItems: ['Prepare portfolio draft', 'Solve 10 LeetCode Mediums'],
            completed: true,
            attendance: 'Present'
          }
        ]
      };
      syncMentees([newMentee, ...mentees]);
      onShowToast(`Enrolled new mentee: ${newMentee.studentName} (${newMentee.rollNo})`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingMentee(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingMentee) return;
    const updated = mentees.filter(m => m.id !== deletingMentee.id);
    syncMentees(updated);
    if (selectedMentee?.id === deletingMentee.id) {
      setSelectedMentee(null);
    }
    onShowToast(`Removed mentorship profile for: "${deletingMentee.studentName}"`, 'info');
    setDeletingMentee(null);
  };

  // Toggle Action Checklist item
  const handleToggleChecklist = (menteeId: string, taskId: string) => {
    const updated = mentees.map(m => {
      if (m.id === menteeId && m.actionChecklist) {
        const newChecklist = m.actionChecklist.map(t => {
          if (t.id === taskId) {
            const next = !t.completed;
            onShowToast(
              next ? `Action task "${t.task}" marked as Completed!` : `Task marked as Pending`,
              'success'
            );
            return { ...t, completed: next };
          }
          return t;
        });
        return { ...m, actionChecklist: newChecklist };
      }
      return m;
    });

    syncMentees(updated);
    if (selectedMentee?.id === menteeId) {
      setSelectedMentee(updated.find(m => m.id === menteeId) || null);
    }
  };

  // Log a new 1-on-1 session
  const handleLogSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee) return;
    if (!newSessionTopic.trim()) {
      onShowToast('Please provide a session discussion topic.', 'error');
      return;
    }

    const newSession: MenteeSession = {
      id: `sl-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      topic: newSessionTopic,
      duration: '45 mins',
      summary: newSessionSummary || 'One-on-one mentorship checkpoint covering career milestones and task reviews.',
      actionItems: ['Follow up in next weekly slot'],
      completed: true,
      attendance: 'Present'
    };

    const updated = mentees.map(m => {
      if (m.id === selectedMentee.id) {
        const updatedLogs = [newSession, ...(m.sessionLogs || [])];
        const nextSessionsCount = Math.min(m.totalPlannedSessions, m.sessionsCompleted + 1);
        const isCompletedNow = nextSessionsCount >= m.totalPlannedSessions;
        return {
          ...m,
          sessionsCompleted: nextSessionsCount,
          status: isCompletedNow ? ('Completed' as const) : m.status,
          sessionLogs: updatedLogs,
          recentNotes: `Latest session on ${newSessionTopic}: ${newSession.summary}`
        };
      }
      return m;
    });

    syncMentees(updated);
    const updatedSelected = updated.find(m => m.id === selectedMentee.id) || null;
    setSelectedMentee(updatedSelected);
    setIsLogSessionModalOpen(false);
    setNewSessionTopic('');
    setNewSessionSummary('');
    onShowToast(`Logged 1-on-1 mentorship session with ${selectedMentee.studentName}`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-violet-400" />
              <span>Student Mentorship & Career Guidance</span>
            </div>
            <h2 className="text-2xl font-black text-white">One-on-One Faculty Mentorship Tracking</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Personalized career, research, and high-frequency placement mentoring by CSIT faculty for ambitious undergraduate and postgraduate scholars.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all border border-violet-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Mentee Profile</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Mentees</span>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.activeCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Active guidance tracks</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Sessions Delivered</span>
              <Calendar className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-black text-violet-300">{stats.totalSessions}</div>
            <div className="text-[10px] text-violet-400/80 mt-0.5">1-on-1 counseling slots</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Graduated Mentees</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{stats.completedCount}</div>
            <div className="text-[10px] text-indigo-300/80 mt-0.5">Placed / Tier-1 Masters</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Average CGPA</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.avgCgpa}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">High academic standing</div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Active/Ongoing', 'Upcoming', 'Completed', 'Proposal Stage'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search, Track & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search mentee name, roll no, track..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 transition-colors"
            />
          </div>

          <select
            value={trackFilter}
            onChange={e => setTrackFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-400 max-w-[150px]"
          >
            <option value="All">All Tracks</option>
            {uniqueTracks.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-400"
          >
            <option value="sessions-desc">Most Sessions Completed</option>
            <option value="cgpa-desc">Highest CGPA</option>
            <option value="name">Mentee Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Mentees Grid */}
      {filteredMentees.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Mentee Profiles Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or enroll a new student mentee.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setTrackFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-violet-300 font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMentees.map(mentee => {
            const sessionPercentage = Math.round((mentee.sessionsCompleted / mentee.totalPlannedSessions) * 100);

            return (
              <div
                key={mentee.id}
                onClick={() => setSelectedMentee(mentee)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#4B3B8A] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-violet-950/20"
              >
                <div>
                  {/* Mentorship Track & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-950/60 text-violet-300 border border-violet-700/50 flex items-center gap-1">
                        <Target className="w-3 h-3 text-violet-400" />
                        <span>{mentee.mentorshipArea}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-700/50">
                        CGPA {mentee.cgpa}
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 ${
                        mentee.status === 'Active/Ongoing'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : mentee.status === 'Completed'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : mentee.status === 'Upcoming'
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          mentee.status === 'Active/Ongoing' ? 'bg-emerald-400 animate-pulse' :
                          mentee.status === 'Completed' ? 'bg-blue-400' :
                          mentee.status === 'Upcoming' ? 'bg-indigo-400' : 'bg-amber-400'
                        }`} />
                        {mentee.status}
                      </span>

                      {/* Quick Actions */}
                      <button
                        onClick={(e) => handleOpenEditModal(mentee, e)}
                        title="Edit Profile"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingMentee(mentee);
                        }}
                        title="Delete Mentee"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Student Name & Roll No */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/60 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                      {mentee.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white group-hover:text-violet-300 transition-colors leading-tight">
                        {mentee.studentName}
                      </h3>
                      <div className="text-xs text-slate-400">
                        Roll: <span className="text-slate-200 font-mono font-bold">{mentee.rollNo}</span> · {mentee.program}
                      </div>
                    </div>
                  </div>

                  {/* Career Goal Banner */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964]">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Target Career Goal
                    </div>
                    <div className="text-xs font-bold text-violet-200 mt-0.5 line-clamp-1">
                      {mentee.targetCareerGoal}
                    </div>
                  </div>

                  {/* Mentor & Recent Notes */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-white">Assigned Mentor:</strong> {mentee.mentor}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#141C48]/40 border border-[#1E2964] text-[11px] text-slate-300 italic line-clamp-2">
                      "{mentee.recentNotes}"
                    </div>
                  </div>
                </div>

                {/* Bottom Sessions Progress & Details Trigger */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-violet-400" />
                        Sessions Completed
                      </span>
                      <span className="font-bold text-slate-200">
                        {mentee.sessionsCompleted} of {mentee.totalPlannedSessions} Slots ({sessionPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#141C48] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-500"
                        style={{ width: `${sessionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMentee(mentee);
                      }}
                      className="text-xs text-violet-300 hover:text-violet-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Session History & Action Plan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Exported Official Mentorship Record & Recommendation Letter for ${mentee.studentName}`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-violet-400" />
                      <span>Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedMentee && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedMentee(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMentee(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/30 border border-violet-500 flex items-center justify-center text-violet-300 font-black text-xl shrink-0">
                {selectedMentee.studentName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-violet-900/50 text-violet-300 border border-violet-700/50">
                    {selectedMentee.mentorshipArea}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-900/50 text-amber-300 border border-amber-700/50">
                    CGPA {selectedMentee.cgpa}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    selectedMentee.status === 'Active/Ongoing' ? 'bg-emerald-900/50 text-emerald-300' :
                    selectedMentee.status === 'Completed' ? 'bg-blue-900/50 text-blue-300' : 'bg-amber-900/50 text-amber-300'
                  }`}>
                    {selectedMentee.status}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white leading-tight">
                  {selectedMentee.studentName}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
                  <span>Roll No: <strong className="text-white font-mono">{selectedMentee.rollNo}</strong></span>
                  <span>{selectedMentee.program} ({selectedMentee.semester})</span>
                </div>
              </div>
            </div>

            {/* Target Goal & Mentor Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Career Aspiration</span>
                <span className="font-bold text-violet-200 mt-0.5 block">
                  {selectedMentee.targetCareerGoal}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Advisor</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <User className="w-3.5 h-3.5 text-violet-400" />
                  {selectedMentee.mentor}
                </span>
              </div>
            </div>

            {/* Strengths & Focus Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#141C48]/60 border border-[#233175]">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                  Core Strengths
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedMentee.strengths?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] font-bold border border-emerald-700/40">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#141C48]/60 border border-[#233175]">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                  Identified Growth Areas
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedMentee.skillGapsIdentified?.map((g, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[10px] font-bold border border-amber-700/40">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Items Checklist */}
            {selectedMentee.actionChecklist && selectedMentee.actionChecklist.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                    Mentee Action Items Checklist
                  </h4>
                  <span className="text-[10px] text-slate-400 italic">Click checkbox to update task status</span>
                </div>
                <div className="space-y-2">
                  {selectedMentee.actionChecklist.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleChecklist(selectedMentee.id, task.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-violet-950/30 border-violet-600/50 hover:bg-violet-950/40'
                          : 'bg-[#090E2C] border-[#1E2964] hover:border-[#2B3B8A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckSquare className="w-5 h-5 text-violet-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <div className={`text-xs font-bold ${task.completed ? 'text-violet-200 line-through' : 'text-white'}`}>
                            {task.task}
                          </div>
                          {task.dueDate && (
                            <div className="text-[10px] text-slate-400">Target Date: {task.dueDate}</div>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.completed ? 'bg-emerald-900/60 text-emerald-300' : 'bg-[#141C48] text-slate-400'
                      }`}>
                        {task.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Logs History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                  1-on-1 Mentorship Session History ({selectedMentee.sessionsCompleted} of {selectedMentee.totalPlannedSessions})
                </h4>
                <button
                  onClick={() => setIsLogSessionModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-violet-600/80 hover:bg-violet-600 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log New Session</span>
                </button>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {selectedMentee.sessionLogs && selectedMentee.sessionLogs.length > 0 ? (
                  selectedMentee.sessionLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-violet-400" />
                          {log.topic}
                        </span>
                        <span className="text-[10px] text-slate-400">{log.date} · {log.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{log.summary}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3 text-xs text-slate-400">No session logs recorded yet.</div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <button
                onClick={() => {
                  onShowToast(`Exported Comprehensive Mentorship Portfolio & Recommendation Letter for ${selectedMentee.studentName}`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Mentorship Dossier</span>
              </button>

              <button
                onClick={() => setSelectedMentee(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-xs text-slate-300 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK LOG SESSION MODAL */}
      {isLogSessionModalOpen && selectedMentee && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsLogSessionModalOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-[#0E1538] border border-violet-500/50 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2964]">
              <h3 className="text-base font-bold text-white">Log Mentorship Session</h3>
              <button onClick={() => setIsLogSessionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleLogSession} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Session Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design Mock Interview or Thesis Feedback"
                  value={newSessionTopic}
                  onChange={e => setNewSessionTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                />
              </div>
              <div>
                <label className="font-bold text-slate-300 block mb-1">Discussion Summary & Prescriptions</label>
                <textarea
                  rows={3}
                  placeholder="Covered distributed caches, review of LeetCode hard problems, prescribed mock tests..."
                  value={newSessionSummary}
                  onChange={e => setNewSessionSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogSessionModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#141C48] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold"
                >
                  Save Session Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2964]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-black text-white">
                  {editingMentee ? 'Edit Mentorship Profile' : 'Enroll New Student Mentee'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.studentName}
                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 230104011"
                    value={formData.rollNo}
                    onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Academic Program</label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={e => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={e => setFormData({ ...formData, cgpa: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Mentorship Track *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Research & Tier-1 Masters Prep"
                    value={formData.mentorshipArea}
                    onChange={e => setFormData({ ...formData, mentorshipArea: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Assigned Faculty Mentor</label>
                  <input
                    type="text"
                    value={formData.mentor}
                    onChange={e => setFormData({ ...formData, mentor: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sessions Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sessionsCompleted}
                    onChange={e => setFormData({ ...formData, sessionsCompleted: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Total Target Slots</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalPlannedSessions}
                    onChange={e => setFormData({ ...formData, totalPlannedSessions: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  >
                    <option value="Active/Ongoing">Active/Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposal Stage">Proposal Stage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Target Career Goal *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE-1 at Tier-1 Tech Firm / Ph.D. Admissions at IISc"
                  value={formData.targetCareerGoal}
                  onChange={e => setFormData({ ...formData, targetCareerGoal: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Core Strengths (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="PyTorch, Systems Thinking, Curiosity"
                    value={strengthsInput}
                    onChange={e => setStrengthsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Growth Gaps (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="System Design LLD, Advanced Math"
                    value={skillsGapsInput}
                    onChange={e => setSkillsGapsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Recent Mentorship Notes</label>
                <textarea
                  rows={2}
                  placeholder="Progress summary, upcoming mock deadlines, or research feedback..."
                  value={formData.recentNotes}
                  onChange={e => setFormData({ ...formData, recentNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2964]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#A78BFA] hover:to-[#8B5CF6] text-white font-bold shadow-lg"
                >
                  {editingMentee ? 'Update Mentee Profile' : 'Enroll Mentee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingMentee && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingMentee(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0E1538] border border-rose-600/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Mentee Profile?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-white">"{deletingMentee.studentName}"</strong> (Roll: {deletingMentee.rollNo})? All historical 1-on-1 notes and action items will be deleted.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingMentee(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-xs text-slate-300 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
