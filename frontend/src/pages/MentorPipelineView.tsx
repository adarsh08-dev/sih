import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Video, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  FileCode, 
  MessageSquare, 
  Star, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  SlidersHorizontal, 
  LayoutGrid, 
  Table as TableIcon, 
  RefreshCw, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  Award, 
  Check, 
  X, 
  Code, 
  Layers,
  Send,
  MoreVertical,
  Trash2,
  Lock
} from 'lucide-react';
import { 
  StudentPipelineRecord, 
  PipelineStage, 
  MentorProfileInfo, 
  TaskSubmissionDetails,
  CapsuleBookingDetails,
  MentorFeedbackRecord 
} from '../types/pipeline';
import { 
  MentorPipelineService, 
  PIPELINE_STAGES 
} from '../services/mentorPipelineService';

interface MentorPipelineViewProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateTab?: (tab: string) => void;
}

export const MentorPipelineView: React.FC<MentorPipelineViewProps> = ({ 
  onShowToast,
  onNavigateTab 
}) => {
  const [students, setStudents] = useState<StudentPipelineRecord[]>([]);
  const [mentor, setMentor] = useState<MentorProfileInfo>(MentorPipelineService.getMentorProfile());
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  // Drag and Drop state
  const [draggedStudentId, setDraggedStudentId] = useState<string | number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  // Active Modals & Selected Student
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentPipelineRecord | null>(null);
  
  // 1. Capsule Modal
  const [capsuleModalStudent, setCapsuleModalStudent] = useState<StudentPipelineRecord | null>(null);
  const [capsuleDate, setCapsuleDate] = useState('2026-09-02');
  const [capsuleTime, setCapsuleTime] = useState('16:00');
  const [capsuleTopic, setCapsuleTopic] = useState('System Architecture & High Concurrency Review');
  const [capsuleDuration, setCapsuleDuration] = useState(15);
  const [capsuleAdvanceStage, setCapsuleAdvanceStage] = useState(true);

  // 2. Task Review Modal
  const [taskModalStudent, setTaskModalStudent] = useState<StudentPipelineRecord | null>(null);
  const [taskScore, setTaskScore] = useState(95);
  const [taskFeedback, setTaskFeedback] = useState('Clean implementation with modular controllers and optimal query index usage.');
  const [taskMintPassport, setTaskMintPassport] = useState(true);
  const [taskAdvanceNext, setTaskAdvanceNext] = useState(true);

  // 3. Send Feedback Modal
  const [feedbackModalStudent, setFeedbackModalStudent] = useState<StudentPipelineRecord | null>(null);
  const [fbRating, setFbRating] = useState(5);
  const [fbCodeQuality, setFbCodeQuality] = useState(5);
  const [fbArchitecture, setFbArchitecture] = useState(4);
  const [fbProblemSolving, setFbProblemSolving] = useState(5);
  const [fbCommunication, setFbCommunication] = useState(4);
  const [fbStrengths, setFbStrengths] = useState('High algorithmic precision, structured Git commits, solid TypeScript adherence.');
  const [fbAreasToImprove, setFbAreasToImprove] = useState('Enhance automated integration test coverage and edge-case handling for distributed sync.');
  const [fbActionableSteps, setFbActionableSteps] = useState('Complete Redis Rate-Limiter module & prepare for TCS Architect live mock.');

  // 4. Add Student Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Computer Science & Information Technology');
  const [newStudentYear, setNewStudentYear] = useState('4th Year');
  const [newStudentStage, setNewStudentStage] = useState<PipelineStage>('Applied');
  const [newStudentSkills, setNewStudentSkills] = useState('React, Node.js, PostgreSQL');
  const [newStudentAction, setNewStudentAction] = useState('Review profile & schedule screening diagnostic');

  // Load data
  const loadData = async () => {
    setLoading(true);
    const data = await MentorPipelineService.getPipelineStudents();
    setStudents(data);
    setMentor(MentorPipelineService.getMentorProfile());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter options
  const uniqueCourses = Array.from(new Set(students.map(s => s.course)));
  const uniqueYears = Array.from(new Set(students.map(s => s.year)));

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.next_action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = selectedCourse === 'ALL' || student.course === selectedCourse;
    const matchesYear = selectedYear === 'ALL' || student.year === selectedYear;
    const matchesStage = selectedStage === 'ALL' || student.stage === selectedStage;

    return matchesSearch && matchesCourse && matchesYear && matchesStage;
  });

  // Stage change handler
  const handleStageChange = (studentId: number | string, newStage: PipelineStage) => {
    const updated = MentorPipelineService.updateStudentStage(studentId, newStage);
    setStudents(updated);
    setMentor(MentorPipelineService.getMentorProfile());
    const student = updated.find(s => String(s.student_id) === String(studentId));
    onShowToast(`Moved ${student?.name || 'student'} to "${newStage}" stage!`, 'success');
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, studentId: number | string) => {
    e.dataTransfer.setData('text/plain', String(studentId));
    setDraggedStudentId(studentId);
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const studentId = e.dataTransfer.getData('text/plain') || draggedStudentId;
    if (studentId) {
      handleStageChange(studentId, targetStage);
    }
    setDraggedStudentId(null);
    setDragOverStage(null);
  };

  // 1. Submit Schedule Capsule
  const handleConfirmCapsule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleModalStudent) return;

    const updated = MentorPipelineService.scheduleCapsuleSlot(capsuleModalStudent.student_id, {
      date: capsuleDate,
      time: capsuleTime,
      topic: capsuleTopic,
      durationMinutes: capsuleDuration,
      advanceStage: capsuleAdvanceStage
    });

    setStudents(updated);
    setMentor(MentorPipelineService.getMentorProfile());
    onShowToast(`15-Min Capsule with ${capsuleModalStudent.name} scheduled for ${capsuleDate} at ${capsuleTime}!`, 'success');
    setCapsuleModalStudent(null);
  };

  // 2. Submit Review Task
  const handleConfirmTaskReview = async (status: 'approved' | 'changes_requested') => {
    if (!taskModalStudent) return;

    const updated = await MentorPipelineService.reviewTaskSubmission(taskModalStudent.student_id, {
      status,
      score: taskScore,
      feedback: taskFeedback,
      mintPassport: taskMintPassport,
      advanceToNextStage: taskAdvanceNext
    });

    setStudents(updated);
    setMentor(MentorPipelineService.getMentorProfile());

    if (status === 'approved') {
      onShowToast(`Approved task for ${taskModalStudent.name}! Score ${taskScore}/100 and minted Blockchain Passport.`, 'success');
    } else {
      onShowToast(`Sent revision request & mentor feedback to ${taskModalStudent.name}.`, 'info');
    }
    setTaskModalStudent(null);
  };

  // 3. Submit Feedback
  const handleConfirmFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackModalStudent) return;

    const updated = MentorPipelineService.sendMentorFeedback(feedbackModalStudent.student_id, {
      rating: fbRating,
      codeQualityRating: fbCodeQuality,
      architectureRating: fbArchitecture,
      problemSolvingRating: fbProblemSolving,
      communicationRating: fbCommunication,
      strengths: fbStrengths,
      areasForImprovement: fbAreasToImprove,
      actionableNextSteps: fbActionableSteps
    });

    setStudents(updated);
    setMentor(MentorPipelineService.getMentorProfile());
    onShowToast(`Mentor evaluation & coaching feedback logged for ${feedbackModalStudent.name}!`, 'success');
    setFeedbackModalStudent(null);
  };

  // 4. Submit Add Student
  const handleConfirmAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName) return;

    const skillList = newStudentSkills.split(',').map(s => s.trim()).filter(Boolean);
    const updated = MentorPipelineService.addStudentToPipeline({
      name: newStudentName,
      email: newStudentEmail || `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      course: newStudentCourse,
      year: newStudentYear,
      stage: newStudentStage,
      skills: skillList.length > 0 ? skillList : ['React', 'Node.js'],
      next_action: newStudentAction,
      dna_score: 80,
      readiness_score: 78
    });

    setStudents(updated);
    setMentor(MentorPipelineService.getMentorProfile());
    onShowToast(`Candidate ${newStudentName} enrolled into ${newStudentStage} pipeline!`, 'success');
    setIsAddModalOpen(false);
    setNewStudentName('');
    setNewStudentEmail('');
  };

  const handleDeleteStudent = (studentId: number | string, studentName: string) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from this mentorship pipeline?`)) {
      const updated = MentorPipelineService.deleteStudentFromPipeline(studentId);
      setStudents(updated);
      setMentor(MentorPipelineService.getMentorProfile());
      onShowToast(`Removed ${studentName} from pipeline.`, 'info');
      if (selectedStudentForDetail && String(selectedStudentForDetail.student_id) === String(studentId)) {
        setSelectedStudentForDetail(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none text-slate-200">
      
      {/* 1. MENTOR PROFILE CARD & PLATFORM BRANDING */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#12193E] via-[#0E1538] to-[#090D28] border border-[#1E2B68] shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Mentor Details */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#4F46E5] p-0.5 shadow-lg shadow-purple-500/20 shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0E1538] flex items-center justify-center text-white font-black text-xl">
                AV
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Official Industry Mentor
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                  <Building2 className="w-3 h-3" />
                  Tata Consultancy Services
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  4.9 Rating
                </span>
              </div>

              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Amit Verma</span>
                <span className="text-slate-400 text-sm font-normal">· TCS Senior Architect</span>
              </h1>
              
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Platform: <strong className="text-white">Ladder</strong> — <span className="text-[#A78BFA] italic">"Empowering Talent, Bridging Academia & Industry"</span>. 
                Full accountability assigned for candidate screening, ghost task code grading, and 15-min capsule milestones.
              </p>
            </div>
          </div>

          {/* Key Metrics / Funnel Stats */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-[#090D26]/80 border border-[#1A2454] text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">In Funnel</span>
              <span className="text-xl font-black text-white">{students.length}</span>
              <span className="text-[10px] text-[#A78BFA] block font-medium">Active Students</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D26]/80 border border-[#1A2454] text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Capsules</span>
              <span className="text-xl font-black text-pink-400">{mentor.capsules_completed}</span>
              <span className="text-[10px] text-slate-400 block font-medium">Conducted</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090D26]/80 border border-[#1A2454] text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Conversion</span>
              <span className="text-xl font-black text-emerald-400">{mentor.conversion_rate}%</span>
              <span className="text-[10px] text-emerald-400/80 block font-medium">Placement Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PIPELINE STAGE SUMMARY METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PIPELINE_STAGES.map((s, idx) => {
          const count = students.filter(st => st.stage === s.stage).length;
          const isSelected = selectedStage === s.stage;

          return (
            <button
              key={s.stage}
              onClick={() => setSelectedStage(isSelected ? 'ALL' : s.stage)}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? `${s.bg} ${s.border} ring-1 ring-white/20 shadow-md` 
                  : 'bg-[#0E1538] border-[#1E2964] hover:border-[#2E3C84]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stage {idx + 1}</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${s.bg} ${s.color} border ${s.border}`}>
                  {count}
                </span>
              </div>
              <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {s.stage}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {count === 1 ? '1 student' : `${count} students`}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. TOOLBAR & FILTERS CONTROLS */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Search & Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, skill, next action..."
              className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl pl-9 pr-4 py-2 outline-none focus:border-[#7C5CFC] transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Course Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Course:</span>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-[#7C5CFC]"
            >
              <option value="ALL">All Courses & Branches</option>
              {uniqueCourses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-[#7C5CFC]"
            >
              <option value="ALL">All Academic Years</option>
              {uniqueYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Stage:</span>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-[#7C5CFC]"
            >
              <option value="ALL">All Pipeline Stages</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.stage} value={s.stage}>{s.stage}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {(selectedCourse !== 'ALL' || selectedYear !== 'ALL' || selectedStage !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCourse('ALL');
                setSelectedYear('ALL');
                setSelectedStage('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-[#A78BFA] hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: View Mode Toggle & Add Student Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="p-1 rounded-xl bg-[#070B1E] border border-[#1E2964] flex items-center">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' 
                  ? 'bg-[#7C5CFC] text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' 
                  ? 'bg-[#7C5CFC] text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Data Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Candidate</span>
          </button>
        </div>
      </div>

      {/* 4. VIEW 1: KANBAN DRAG & DROP BOARD */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-w-[1200px]">
            {PIPELINE_STAGES.map((stageItem, stageIdx) => {
              const stageStudents = filteredStudents.filter(s => s.stage === stageItem.stage);
              const isDragOver = dragOverStage === stageItem.stage;

              return (
                <div
                  key={stageItem.stage}
                  onDragOver={(e) => handleDragOver(e, stageItem.stage)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stageItem.stage)}
                  className={`flex flex-col rounded-2xl bg-[#0B0F2A] border transition-all duration-200 min-h-[550px] ${
                    isDragOver 
                      ? 'border-[#7C5CFC] bg-[#121945]/70 ring-2 ring-[#7C5CFC]/40 scale-[1.01]' 
                      : 'border-[#1E2964]/80'
                  }`}
                >
                  {/* Column Header */}
                  <div className={`p-3.5 border-b border-[#1E2964] rounded-t-2xl bg-[#0E1538] flex items-center justify-between sticky top-0 z-10`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${
                        stageIdx === 0 ? 'bg-sky-400' :
                        stageIdx === 1 ? 'bg-indigo-400' :
                        stageIdx === 2 ? 'bg-amber-400' :
                        stageIdx === 3 ? 'bg-purple-400' :
                        stageIdx === 4 ? 'bg-pink-400' : 'bg-emerald-400'
                      }`} />
                      <h2 className="text-xs font-bold text-white truncate" title={stageItem.stage}>
                        {stageItem.stage}
                      </h2>
                    </div>

                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${stageItem.bg} ${stageItem.color} border ${stageItem.border}`}>
                      {stageStudents.length}
                    </span>
                  </div>

                  {/* Candidate Cards List */}
                  <div className="p-2.5 space-y-3 flex-1 overflow-y-auto">
                    {stageStudents.length === 0 ? (
                      <div className="h-40 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-[11px] text-slate-500">No candidates in this stage</p>
                        <p className="text-[10px] text-slate-600 mt-1">Drag and drop cards here</p>
                      </div>
                    ) : (
                      stageStudents.map((student) => (
                        <div
                          key={student.student_id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, student.student_id)}
                          className="p-4 rounded-xl bg-[#0E1538] hover:bg-[#131B45] border border-[#1E2964] hover:border-[#7C5CFC]/50 shadow-md transition-all cursor-grab active:cursor-grabbing group space-y-3"
                        >
                          {/* Student Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <button
                                onClick={() => setSelectedStudentForDetail(student)}
                                className="text-xs font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate block text-left"
                              >
                                {student.name}
                              </button>
                              <p className="text-[10px] text-slate-400 truncate">{student.course}</p>
                            </div>
                            
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-semibold shrink-0">
                              {student.year}
                            </span>
                          </div>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap gap-1">
                            {student.skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-[#070B1E] border border-[#1A2352] text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="text-[9px] px-1 rounded bg-white/5 text-slate-400">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Next Action Box */}
                          <div className="p-2.5 rounded-lg bg-[#070B1E] border border-[#17204A] text-[11px]">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 text-[#A78BFA]" />
                              Next Action
                            </span>
                            <p className="text-slate-200 text-[11px] leading-snug line-clamp-2">
                              {student.next_action}
                            </p>
                          </div>

                          {/* Mentor Accountability Badge */}
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#17204A]">
                            <span className="truncate flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-[#A78BFA]" />
                              <strong className="text-slate-300">{student.mentor_name}</strong>
                            </span>
                            <span className="text-[9px] text-slate-400 shrink-0 ml-1">
                              {student.updated_at}
                            </span>
                          </div>

                          {/* 3 Quick Action Buttons */}
                          <div className="grid grid-cols-3 gap-1 pt-1">
                            {/* 1. Schedule Capsule */}
                            <button
                              onClick={() => {
                                setCapsuleModalStudent(student);
                                setCapsuleTopic(`15-Min Capsule: ${student.skills[0] || 'System Architecture'} Review`);
                              }}
                              title="Schedule 15-Min Capsule Slot"
                              className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                            >
                              <Video className="w-3 h-3" />
                              <span className="truncate">Capsule</span>
                            </button>

                            {/* 2. Review Task */}
                            <button
                              onClick={() => {
                                setTaskModalStudent(student);
                                setTaskScore(student.task_details?.score || 95);
                                setTaskFeedback(student.task_details?.feedback || 'Code adheres to Clean Architecture and passes test criteria.');
                              }}
                              title="Review Task Submission"
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                            >
                              <FileCode className="w-3 h-3" />
                              <span className="truncate">Task</span>
                            </button>

                            {/* 3. Send Feedback */}
                            <button
                              onClick={() => {
                                setFeedbackModalStudent(student);
                              }}
                              title="Send Mentor Feedback"
                              className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span className="truncate">Feedback</span>
                            </button>
                          </div>

                          {/* Quick Stage Move Dropdown */}
                          <div className="pt-1">
                            <select
                              value={student.stage}
                              onChange={(e) => handleStageChange(student.student_id, e.target.value as PipelineStage)}
                              className="w-full bg-[#070B1E] border border-[#1A2352] text-slate-300 text-[10px] rounded-lg px-2 py-1 outline-none"
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s.stage} value={s.stage}>Move to: {s.stage}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. VIEW 2: DATA TABLE / LIST VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-[#0E1538] border border-[#1E2964] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E2964] bg-[#0A0E2A] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Student Candidate</th>
                  <th className="py-3.5 px-4">Course & Year</th>
                  <th className="py-3.5 px-4">Current Pipeline Stage</th>
                  <th className="py-3.5 px-4">Key Skills</th>
                  <th className="py-3.5 px-4">Next Action</th>
                  <th className="py-3.5 px-4">Mentor Accountability</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2352]">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No student records match the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const stageConfig = PIPELINE_STAGES.find(s => s.stage === student.stage) || PIPELINE_STAGES[0];

                    return (
                      <tr 
                        key={student.student_id}
                        className="hover:bg-[#131B45] transition-colors group"
                      >
                        {/* Student Name + College */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setSelectedStudentForDetail(student)}
                            className="font-bold text-white hover:text-[#A78BFA] transition-colors block text-left"
                          >
                            {student.name}
                          </button>
                          <span className="text-[10px] text-slate-400 block">{student.email}</span>
                        </td>

                        {/* Course & Year */}
                        <td className="py-3.5 px-4">
                          <span className="text-slate-200 font-medium block">{student.course}</span>
                          <span className="text-[10px] text-slate-400">{student.year}</span>
                        </td>

                        {/* Stage Pill + Select Dropdown */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={student.stage}
                              onChange={(e) => handleStageChange(student.student_id, e.target.value as PipelineStage)}
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${stageConfig.bg} ${stageConfig.color} ${stageConfig.border}`}
                            >
                              {PIPELINE_STAGES.map(s => (
                                <option key={s.stage} value={s.stage} className="bg-[#0E1538] text-white">
                                  {s.stage}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        {/* Skills */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {student.skills.map((skill, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded bg-[#070B1E] border border-[#1A2352] text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Next Action */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex items-start gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#A78BFA] shrink-0 mt-0.5" />
                            <span className="text-slate-200 text-xs line-clamp-2">
                              {student.next_action}
                            </span>
                          </div>
                        </td>

                        {/* Mentor Card info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <div>
                              <strong className="text-slate-200 text-xs block">{student.mentor_name}</strong>
                              <span className="text-[10px] text-slate-400 block">{student.mentor_role}</span>
                            </div>
                          </div>
                        </td>

                        {/* Last Updated */}
                        <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                          {student.updated_at}
                        </td>

                        {/* Quick Actions Buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setCapsuleModalStudent(student);
                                setCapsuleTopic(`15-Min Capsule: ${student.skills[0] || 'System Architecture'} Review`);
                              }}
                              title="Schedule 15-Min Capsule"
                              className="p-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 transition-all"
                            >
                              <Video className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                setTaskModalStudent(student);
                                setTaskScore(student.task_details?.score || 95);
                                setTaskFeedback(student.task_details?.feedback || 'Clean architecture, all unit & integration tests pass.');
                              }}
                              title="Review Task Submission"
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all"
                            >
                              <FileCode className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setFeedbackModalStudent(student)}
                              title="Send Feedback"
                              className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteStudent(student.student_id, student.name)}
                              title="Remove Candidate"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. MODAL 1: SCHEDULE 15-MIN CAPSULE SLOT */}
      {capsuleModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0E1538] border border-[#1E2964] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2964] pb-3">
              <div className="flex items-center gap-2 text-pink-400">
                <Video className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Schedule 15-Min Mentor Capsule Slot</h3>
              </div>
              <button 
                onClick={() => setCapsuleModalStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#070B1E] border border-[#1A2352] flex items-center justify-between">
              <div>
                <strong className="text-white text-xs block">{capsuleModalStudent.name}</strong>
                <span className="text-[11px] text-slate-400">{capsuleModalStudent.course} · {capsuleModalStudent.year}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-[#7C5CFC]/20 text-[#C4B5FD] font-bold">
                Mentor: Amit Verma
              </span>
            </div>

            <form onSubmit={handleConfirmCapsule} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={capsuleDate}
                    onChange={(e) => setCapsuleDate(e.target.value)}
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={capsuleTime}
                    onChange={(e) => setCapsuleTime(e.target.value)}
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Capsule Focus Topic</label>
                <input
                  type="text"
                  required
                  value={capsuleTopic}
                  onChange={(e) => setCapsuleTopic(e.target.value)}
                  placeholder="e.g. Express Middleware & Distributed Rate Limiting Review"
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration</label>
                  <select
                    value={capsuleDuration}
                    onChange={(e) => setCapsuleDuration(Number(e.target.value))}
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value={15}>15 Minutes (Standard Capsule)</option>
                    <option value={30}>30 Minutes (Deep Dive Mock)</option>
                    <option value={45}>45 Minutes (Architecture Sprint)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={capsuleAdvanceStage}
                      onChange={(e) => setCapsuleAdvanceStage(e.target.checked)}
                      className="w-4 h-4 rounded text-[#7C5CFC] bg-[#070B1E]"
                    />
                    <span>Auto-advance stage to "Capsule Booked"</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E2964] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCapsuleModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-500/20"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Confirm Capsule Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL 2: REVIEW TASK SUBMISSION */}
      {taskModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0E1538] border border-[#1E2964] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E2964] pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <FileCode className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Review Ghost Task Submission</h3>
              </div>
              <button 
                onClick={() => setTaskModalStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate & Task summary */}
            <div className="p-4 rounded-xl bg-[#070B1E] border border-[#1A2352] space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{taskModalStudent.task_details?.title || 'Ghost Task: Enterprise Micro-Service Implementation'}</h4>
                  <p className="text-xs text-slate-400">Candidate: <strong className="text-slate-200">{taskModalStudent.name}</strong> ({taskModalStudent.course})</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                  {taskModalStudent.task_details?.testsPassed || '3/3 (100%) Tests Passed'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#17204A] text-xs font-mono">
                <span className="text-slate-400 truncate">Repo: {taskModalStudent.task_details?.repoUrl || 'https://github.com/aryan-11825114/sih'}</span>
                <a
                  href={taskModalStudent.task_details?.repoUrl || 'https://github.com/aryan-11825114/sih'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A78BFA] hover:text-white flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Open PR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Code Snippet Inspector */}
            {taskModalStudent.task_details?.codeSnippet && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Submitted Source Code</label>
                <pre className="p-3 rounded-xl bg-[#050816] border border-[#17204A] text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {taskModalStudent.task_details.codeSnippet}
                </pre>
              </div>
            )}

            {/* Grading Score & Feedback */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Technical Score</span>
                  <span className="text-emerald-400">{taskScore}/100</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={taskScore}
                  onChange={(e) => setTaskScore(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Mentor Code Review & Architectural Comments</label>
                <textarea
                  rows={3}
                  value={taskFeedback}
                  onChange={(e) => setTaskFeedback(e.target.value)}
                  placeholder="Provide constructive feedback on rate-limiting, error handlers, and schema design..."
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl p-3 outline-none resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskMintPassport}
                    onChange={(e) => setTaskMintPassport(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7C5CFC]"
                  />
                  <span>Mint Cryptographic Blockchain Passport Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskAdvanceNext}
                    onChange={(e) => setTaskAdvanceNext(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7C5CFC]"
                  />
                  <span>Advance stage to "Interview Scheduled"</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#1E2964] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleConfirmTaskReview('changes_requested')}
                className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold"
              >
                Request Code Revisions
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTaskModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleConfirmTaskReview('approved')}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Sign Deliverable</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL 3: SEND FEEDBACK */}
      {feedbackModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-[#0E1538] border border-[#1E2964] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#1E2964] pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <MessageSquare className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Send Mentor Feedback & Roadmap Guidance</h3>
              </div>
              <button 
                onClick={() => setFeedbackModalStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#070B1E] border border-[#1A2352] flex items-center justify-between">
              <div>
                <strong className="text-white text-xs block">{feedbackModalStudent.name}</strong>
                <span className="text-[11px] text-slate-400">Stage: {feedbackModalStudent.stage} · {feedbackModalStudent.course}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                TCS Mentor Evaluation
              </span>
            </div>

            <form onSubmit={handleConfirmFeedback} className="space-y-4">
              {/* Competency Ratings Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#070B1E] border border-[#1A2352]">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Code Quality</span>
                    <span className="text-emerald-400 font-bold">{fbCodeQuality}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={fbCodeQuality}
                    onChange={(e) => setFbCodeQuality(Number(e.target.value))}
                    className="w-full accent-[#7C5CFC]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>System Architecture</span>
                    <span className="text-emerald-400 font-bold">{fbArchitecture}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={fbArchitecture}
                    onChange={(e) => setFbArchitecture(Number(e.target.value))}
                    className="w-full accent-[#7C5CFC]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Problem Solving</span>
                    <span className="text-emerald-400 font-bold">{fbProblemSolving}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={fbProblemSolving}
                    onChange={(e) => setFbProblemSolving(Number(e.target.value))}
                    className="w-full accent-[#7C5CFC]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Communication</span>
                    <span className="text-emerald-400 font-bold">{fbCommunication}/5</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={fbCommunication}
                    onChange={(e) => setFbCommunication(Number(e.target.value))}
                    className="w-full accent-[#7C5CFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Key Strengths</label>
                <textarea
                  rows={2}
                  value={fbStrengths}
                  onChange={(e) => setFbStrengths(e.target.value)}
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl p-2.5 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Areas for Improvement</label>
                <textarea
                  rows={2}
                  value={fbAreasToImprove}
                  onChange={(e) => setFbAreasToImprove(e.target.value)}
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl p-2.5 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Actionable Next Steps (Updates Pipeline Next Action)</label>
                <input
                  type="text"
                  required
                  value={fbActionableSteps}
                  onChange={(e) => setFbActionableSteps(e.target.value)}
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="pt-3 border-t border-[#1E2964] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackModalStudent(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send & Record Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL 4: ADD CANDIDATE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0E1538] border border-[#1E2964] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2964] pb-3">
              <div className="flex items-center gap-2 text-[#A78BFA]">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Add Student Candidate to Mentorship Pipeline</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Ishan Verma"
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="e.g. ishan.v@college.edu"
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Course / Branch</label>
                  <select
                    value={newStudentCourse}
                    onChange={(e) => setNewStudentCourse(e.target.value)}
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value="Computer Science & Information Technology">Computer Science & IT (CSIT)</option>
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication Engineering">Electronics & Comm.</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Academic Year</label>
                  <select
                    value={newStudentYear}
                    onChange={(e) => setNewStudentYear(e.target.value)}
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Initial Pipeline Stage</label>
                  <select
                    value={newStudentStage}
                    onChange={(e) => setNewStudentStage(e.target.value as PipelineStage)}
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                  >
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.stage} value={s.stage}>{s.stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Key Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={newStudentSkills}
                    onChange={(e) => setNewStudentSkills(e.target.value)}
                    placeholder="React, Node.js, SQL"
                    className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Next Action</label>
                <input
                  type="text"
                  value={newStudentAction}
                  onChange={(e) => setNewStudentAction(e.target.value)}
                  placeholder="e.g. Schedule screening diagnostic"
                  className="w-full bg-[#070B1E] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="pt-3 border-t border-[#1E2964] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. DRAWER / DETAIL MODAL: STUDENT PROFILE & PROGRESSION */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg h-full bg-[#0E1538] border-l border-[#1E2964] p-6 shadow-2xl overflow-y-auto space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E2964] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A78BFA]">Candidate Deep-Dive</span>
                <h3 className="text-xl font-black text-white">{selectedStudentForDetail.name}</h3>
                <p className="text-xs text-slate-400">{selectedStudentForDetail.email}</p>
              </div>
              <button 
                onClick={() => setSelectedStudentForDetail(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Academic & Readiness Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#070B1E] border border-[#1A2352]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Skill DNA Score</span>
                <span className="text-xl font-black text-emerald-400">{selectedStudentForDetail.dna_score || 84}/100</span>
                <span className="text-[10px] text-slate-400 block">Verified Assessment</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070B1E] border border-[#1A2352]">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Stage</span>
                <span className="text-sm font-bold text-[#A78BFA] block truncate mt-1">{selectedStudentForDetail.stage}</span>
                <span className="text-[10px] text-slate-400 block">{selectedStudentForDetail.year}</span>
              </div>
            </div>

            {/* Academic Institute */}
            <div className="p-3.5 rounded-xl bg-[#070B1E] border border-[#1A2352] space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Institution & Course</span>
              <p className="text-xs font-semibold text-white">{selectedStudentForDetail.course}</p>
              <p className="text-[11px] text-slate-400">{selectedStudentForDetail.college || 'Mahatma Jyotiba Phule Rohilkhand University'}</p>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white block">Key Technical Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentForDetail.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[#070B1E] border border-[#1A2352] text-slate-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Next Action Box */}
            <div className="p-4 rounded-xl bg-[#0B0F2A] border border-[#1E2964] space-y-1">
              <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider block">Assigned Next Action</span>
              <p className="text-xs text-white leading-relaxed">{selectedStudentForDetail.next_action}</p>
              <p className="text-[10px] text-slate-400 mt-2">Updated: {selectedStudentForDetail.updated_at}</p>
            </div>

            {/* Mentor Feedback History */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white block">Mentor Coaching & Feedback History</span>
              {selectedStudentForDetail.feedback_history && selectedStudentForDetail.feedback_history.length > 0 ? (
                selectedStudentForDetail.feedback_history.map(fb => (
                  <div key={fb.id} className="p-3.5 rounded-xl bg-[#070B1E] border border-[#1A2352] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{fb.mentorName} ({fb.mentorCompany})</span>
                      <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {fb.rating}/5
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]"><strong className="text-slate-200">Strengths:</strong> {fb.strengths}</p>
                    <p className="text-slate-300 text-[11px]"><strong className="text-slate-200">Next Steps:</strong> {fb.actionableNextSteps}</p>
                    <span className="text-[10px] text-slate-500 block">{fb.date}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#070B1E] border border-[#1A2352] text-center text-xs text-slate-500">
                  No feedback records logged yet. Click "Feedback" to send the first coaching note.
                </div>
              )}
            </div>

            {/* Actions in drawer */}
            <div className="pt-4 border-t border-[#1E2964] space-y-2">
              <button
                onClick={() => {
                  setCapsuleModalStudent(selectedStudentForDetail);
                  setCapsuleTopic(`15-Min Capsule: ${selectedStudentForDetail.skills[0] || 'System Architecture'} Review`);
                  setSelectedStudentForDetail(null);
                }}
                className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <Video className="w-4 h-4" />
                <span>Schedule 15-Min Capsule Slot</span>
              </button>

              <button
                onClick={() => {
                  setTaskModalStudent(selectedStudentForDetail);
                  setTaskScore(selectedStudentForDetail.task_details?.score || 95);
                  setSelectedStudentForDetail(null);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <FileCode className="w-4 h-4" />
                <span>Review Task Submission</span>
              </button>

              <button
                onClick={() => {
                  setFeedbackModalStudent(selectedStudentForDetail);
                  setSelectedStudentForDetail(null);
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Mentor Feedback</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
