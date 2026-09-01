import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Sparkles, 
  Edit3, 
  Trash2, 
  X, 
  BookOpen, 
  Building2, 
  ShieldCheck, 
  FileText,
  Printer,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { FdpProgram } from '../types';
import { getStoredFdpPrograms, saveStoredFdpPrograms } from '../data/fdpConsultancyData';

interface FdpProgramsViewProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const FdpProgramsView: React.FC<FdpProgramsViewProps> = ({ onShowToast }) => {
  const [programs, setPrograms] = useState<FdpProgram[]>(getStoredFdpPrograms);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'seats' | 'title'>('date-desc');

  // Modals
  const [selectedProgram, setSelectedProgram] = useState<FdpProgram | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<FdpProgram | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<FdpProgram | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<FdpProgram | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<FdpProgram>>({
    title: '',
    type: 'AI & Emerging Tech',
    mode: 'Hybrid',
    duration: '1 Week (30 Hours)',
    startDate: '2026-10-15',
    endDate: '2026-10-20',
    datesFormatted: 'Oct 15 – Oct 20, 2026',
    resourcePerson: {
      name: '',
      designation: '',
      organization: '',
      bio: ''
    },
    organizingBody: 'AICTE Training and Learning (ATAL) Academy & MJPRU',
    status: 'Open for Registration',
    totalSeats: 60,
    registeredSeats: 0,
    description: '',
    learningOutcomes: [],
    targetAudience: 'Faculty Members and Research Supervisors in CSE/IT',
    prerequisites: '',
    venueOrPlatform: 'CSIT Seminar Hall / Virtual Meet',
    certificateAvailable: false,
    isRegistered: false
  });

  const [outcomesInput, setOutcomesInput] = useState('');

  const syncPrograms = (updated: FdpProgram[]) => {
    setPrograms(updated);
    saveStoredFdpPrograms(updated);
  };

  // Filter & Sort
  const filteredPrograms = useMemo(() => {
    return programs
      .filter(p => {
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesMode = modeFilter === 'All' || p.mode === modeFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          p.title.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.organizingBody.toLowerCase().includes(q) ||
          p.resourcePerson.name.toLowerCase().includes(q) ||
          p.resourcePerson.organization.toLowerCase().includes(q);

        return matchesStatus && matchesMode && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        if (sortBy === 'seats') {
          return (b.totalSeats - b.registeredSeats) - (a.totalSeats - a.registeredSeats);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [programs, statusFilter, modeFilter, searchQuery, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = programs.length;
    const openForReg = programs.filter(p => p.status === 'Open for Registration').length;
    const upcoming = programs.filter(p => p.status === 'Upcoming').length;
    const completed = programs.filter(p => p.status === 'Completed').length;
    const myRegistrations = programs.filter(p => p.isRegistered).length;
    return { total, openForReg, upcoming, completed, myRegistrations };
  }, [programs]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      type: 'AI & Emerging Tech',
      mode: 'Hybrid',
      duration: '1 Week (30 Hours)',
      startDate: '2026-10-20',
      endDate: '2026-10-25',
      datesFormatted: 'Oct 20 – Oct 25, 2026',
      resourcePerson: {
        name: '',
        designation: '',
        organization: '',
        bio: ''
      },
      organizingBody: 'AICTE Training and Learning (ATAL) Academy & MJPRU',
      status: 'Open for Registration',
      totalSeats: 60,
      registeredSeats: 0,
      description: '',
      learningOutcomes: [],
      targetAudience: 'Faculty Members and Research Supervisors in CSE/IT',
      prerequisites: 'Basic programming knowledge',
      venueOrPlatform: 'Seminar Hall 2 & Microsoft Teams',
      certificateAvailable: false,
      isRegistered: false
    });
    setOutcomesInput('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: FdpProgram, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProgram(p);
    setFormData({ ...p });
    setOutcomesInput(p.learningOutcomes ? p.learningOutcomes.join('\n') : '');
    setIsAddModalOpen(true);
  };

  // Save Form (Create or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      onShowToast('Please provide an FDP program title.', 'error');
      return;
    }
    if (!formData.resourcePerson?.name?.trim()) {
      onShowToast('Please specify the resource person / instructor.', 'error');
      return;
    }

    const outcomesList = outcomesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProgram) {
      // Update
      const updated = programs.map(p => {
        if (p.id === editingProgram.id) {
          return {
            ...p,
            ...formData,
            learningOutcomes: outcomesList.length > 0 ? outcomesList : p.learningOutcomes,
            certificateAvailable: formData.status === 'Completed',
            certificateDetails: formData.status === 'Completed' ? (p.certificateDetails || {
              certificateId: `FDP-MJPRU-${Math.floor(1000 + Math.random() * 9000)}`,
              issueDate: formData.endDate || '2026-10-30',
              recipientName: 'Dr. Arvind K. Sharma',
              recipientDesignation: 'Head of Department, CSIT',
              grade: 'Distinction (A+)',
              accreditation: formData.organizingBody || 'AICTE ATAL & MJPRU'
            }) : undefined
          } as FdpProgram;
        }
        return p;
      });
      syncPrograms(updated);
      onShowToast(`Updated FDP program: "${formData.title}"`, 'success');
    } else {
      // Create new
      const newProgram: FdpProgram = {
        id: `fdp-${Date.now()}`,
        title: formData.title || 'Untitled FDP Program',
        type: formData.type || 'Technical',
        mode: (formData.mode as any) || 'Hybrid',
        duration: formData.duration || '1 Week',
        startDate: formData.startDate || '2026-10-20',
        endDate: formData.endDate || '2026-10-25',
        datesFormatted: formData.datesFormatted || `${formData.startDate} – ${formData.endDate}`,
        resourcePerson: {
          name: formData.resourcePerson?.name || 'Guest Faculty Expert',
          designation: formData.resourcePerson?.designation || 'Principal Researcher',
          organization: formData.resourcePerson?.organization || 'Industry Partner',
          bio: formData.resourcePerson?.bio || 'Experienced academician and industry consultant.'
        },
        organizingBody: formData.organizingBody || 'AICTE ATAL & MJPRU',
        status: (formData.status as any) || 'Open for Registration',
        totalSeats: Number(formData.totalSeats) || 60,
        registeredSeats: Number(formData.registeredSeats) || 0,
        description: formData.description || 'Comprehensive faculty development program designed to strengthen technical capabilities and curriculum rigor.',
        learningOutcomes: outcomesList.length > 0 ? outcomesList : [
          'Strengthening core concepts and emerging paradigms',
          'Developing lab exercises and practical project assignments',
          'Enhancing research methodologies and publication capability'
        ],
        targetAudience: formData.targetAudience || 'Faculty Members and Researchers in Computer Science & Engineering',
        prerequisites: formData.prerequisites || 'Familiarity with course discipline',
        venueOrPlatform: formData.venueOrPlatform || 'MJPRU CSIT Complex & Online Stream',
        certificateAvailable: formData.status === 'Completed',
        certificateDetails: formData.status === 'Completed' ? {
          certificateId: `FDP-MJPRU-${Math.floor(1000 + Math.random() * 9000)}`,
          issueDate: formData.endDate || '2026-10-30',
          recipientName: 'Dr. Arvind K. Sharma',
          recipientDesignation: 'Head of Department, CSIT',
          grade: 'Distinction (A+)',
          accreditation: formData.organizingBody || 'AICTE ATAL & MJPRU'
        } : undefined,
        isRegistered: false
      };
      syncPrograms([newProgram, ...programs]);
      onShowToast(`Created new FDP program: "${newProgram.title}"`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingProgram(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingProgram) return;
    const updated = programs.filter(p => p.id !== deletingProgram.id);
    syncPrograms(updated);
    if (selectedProgram?.id === deletingProgram.id) {
      setSelectedProgram(null);
    }
    onShowToast(`Removed FDP program: "${deletingProgram.title}"`, 'info');
    setDeletingProgram(null);
  };

  // Register / Enroll Faculty
  const handleToggleRegistration = (programId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = programs.map(p => {
      if (p.id === programId) {
        const isNowRegistered = !p.isRegistered;
        const newSeats = isNowRegistered 
          ? Math.min(p.totalSeats, p.registeredSeats + 1)
          : Math.max(0, p.registeredSeats - 1);
        
        if (isNowRegistered) {
          onShowToast(`Successfully enrolled in "${p.title}"! Calendar invite sent to arvind.sharma@mjpru.ac.in`, 'success');
        } else {
          onShowToast(`Cancelled registration for "${p.title}".`, 'info');
        }

        return {
          ...p,
          isRegistered: isNowRegistered,
          registeredSeats: newSeats
        };
      }
      return p;
    });
    syncPrograms(updated);
    if (selectedProgram?.id === programId) {
      setSelectedProgram(updated.find(p => p.id === programId) || null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header Banner & Stats Overview */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Faculty Development Programs (FDP)</span>
            </div>
            <h2 className="text-2xl font-black text-white">Academic Upskilling & Pedagogical Excellence</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Accredited AICTE-ATAL, IEEE, NASSCOM, and industry-sponsored programs to upgrade instructional competencies, emerging tech labs, and NAAC/NBA research attainment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#5B36F5] hover:from-[#8B6EFC] hover:to-[#6A47F7] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FDP</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Programs</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Approved department listings</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Open for Reg</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-300">{stats.openForReg}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Active registration window</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed / Certs</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-black text-purple-300">{stats.completed}</div>
            <div className="text-[10px] text-purple-400/80 mt-0.5">Certificates ready for NAAC</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Enrolled By You</span>
              <User className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-cyan-300">{stats.myRegistrations}</div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5">Dr. Arvind K. Sharma (HOD)</div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sorting Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Open for Registration', 'Upcoming', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-[#7C5CFC] text-white shadow-md shadow-indigo-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Right Search, Mode & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search FDPs, experts, organizers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="All">All Modes</option>
            <option value="Online">Online Only</option>
            <option value="Offline">In-Person Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="date-desc">Newest Dates First</option>
            <option value="date-asc">Oldest Dates First</option>
            <option value="seats">Most Seats Available</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Program Cards Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <Award className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No FDP Programs Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria, switching status filters, or create a new Faculty Development Program listing.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setModeFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-indigo-300 font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPrograms.map(program => {
            const seatsRemaining = Math.max(0, program.totalSeats - program.registeredSeats);
            const fillPercentage = Math.min(100, Math.round((program.registeredSeats / program.totalSeats) * 100));

            return (
              <div
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#384DA8] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-indigo-950/30"
              >
                {/* Mode & Category Tag Line */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-900/40 text-indigo-300 border border-indigo-700/40">
                        {program.type}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        program.mode === 'Online' 
                          ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/40' 
                          : program.mode === 'Hybrid'
                          ? 'bg-purple-900/40 text-purple-300 border border-purple-700/40'
                          : 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
                      }`}>
                        {program.mode}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 ${
                        program.status === 'Open for Registration'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : program.status === 'Upcoming'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          program.status === 'Open for Registration' ? 'bg-emerald-400 animate-pulse' :
                          program.status === 'Upcoming' ? 'bg-blue-400' : 'bg-slate-400'
                        }`} />
                        {program.status}
                      </span>

                      {/* HOD Quick Actions */}
                      <button
                        onClick={(e) => handleOpenEditModal(program, e)}
                        title="Edit FDP"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProgram(program);
                        }}
                        title="Delete FDP"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                    {program.title}
                  </h3>

                  {/* Organizing Body */}
                  <p className="text-[11px] font-semibold text-indigo-200/80 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{program.organizingBody}</span>
                  </p>

                  {/* Resource Person Spotlight Box */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
                      {program.resourcePerson.name.charAt(program.resourcePerson.name.startsWith('Dr.') ? 4 : 0) || 'E'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{program.resourcePerson.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {program.resourcePerson.designation} · {program.resourcePerson.organization}
                      </div>
                    </div>
                  </div>

                  {/* Meta Dates & Duration */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate text-[11px]">{program.datesFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate text-[11px]">{program.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Section: Seats & Actions */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] space-y-3">
                  {/* Seats Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        {program.status === 'Completed' ? 'Participation Cohort' : 'Available Seats'}
                      </span>
                      <span className="font-bold text-slate-200">
                        {program.status === 'Completed' ? (
                          <span className="text-emerald-400 font-extrabold">{program.registeredSeats} Attended (100%)</span>
                        ) : (
                          <span>
                            <strong className="text-indigo-300">{seatsRemaining} left</strong> ({program.registeredSeats}/{program.totalSeats})
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#141C48] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          program.status === 'Completed' ? 'bg-emerald-500' :
                          fillPercentage > 85 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProgram(program);
                      }}
                      className="text-xs text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Full Syllabus & Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {program.status === 'Completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingCertificate(program);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
                        >
                          <Download className="w-3.5 h-3.5 text-purple-300" />
                          <span>Certificate</span>
                        </button>
                      )}

                      {program.status === 'Open for Registration' && (
                        <button
                          onClick={(e) => handleToggleRegistration(program.id, e)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow ${
                            program.isRegistered
                              ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-200 hover:bg-emerald-600/40'
                              : 'bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white'
                          }`}
                        >
                          {program.isRegistered ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Enrolled</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Enroll Now</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL ON CARD CLICK */}
      {selectedProgram && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedProgram(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                  {selectedProgram.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-900/50 text-purple-300 border border-purple-700/50">
                  {selectedProgram.mode}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedProgram.status === 'Open for Registration' ? 'bg-emerald-900/50 text-emerald-300' :
                  selectedProgram.status === 'Upcoming' ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-300'
                }`}>
                  {selectedProgram.status}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedProgram.title}
              </h2>
              <p className="text-xs text-indigo-300 font-semibold mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Organizing Body: {selectedProgram.organizingBody}</span>
              </p>
            </div>

            {/* Dates & Logistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedProgram.duration}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dates</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedProgram.datesFormatted}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Venue / Link</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5 truncate" title={selectedProgram.venueOrPlatform}>
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {selectedProgram.venueOrPlatform || 'Virtual Platform'}
                </span>
              </div>
            </div>

            {/* Resource Person Profile */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#141C48] to-[#10173F] border border-[#233175] flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg">
                {selectedProgram.resourcePerson.name.charAt(selectedProgram.resourcePerson.name.startsWith('Dr.') ? 4 : 0) || 'E'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{selectedProgram.resourcePerson.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-bold">Resource Person</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{selectedProgram.resourcePerson.designation} · {selectedProgram.resourcePerson.organization}</p>
                {selectedProgram.resourcePerson.bio && (
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{selectedProgram.resourcePerson.bio}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Program Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProgram.description}</p>
            </div>

            {/* Learning Outcomes */}
            {selectedProgram.learningOutcomes && selectedProgram.learningOutcomes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Key Learning Competencies</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProgram.learningOutcomes.map((item, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#090E2C] border border-[#1E2964] flex items-start gap-2 text-[11px] text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090E2C] border border-[#1E2964]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Target Audience</span>
                <p className="text-[11px] text-slate-300">{selectedProgram.targetAudience}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#090E2C] border border-[#1E2964]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Prerequisites</span>
                <p className="text-[11px] text-slate-300">{selectedProgram.prerequisites || 'Open to all engineering faculty'}</p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <div className="text-xs text-slate-400">
                Seats: <strong className="text-white">{selectedProgram.registeredSeats} / {selectedProgram.totalSeats}</strong> filled
              </div>

              <div className="flex items-center gap-2">
                {selectedProgram.status === 'Completed' && (
                  <button
                    onClick={() => {
                      setViewingCertificate(selectedProgram);
                      setSelectedProgram(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-900/80 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center gap-2 transition-all shadow"
                  >
                    <Award className="w-4 h-4 text-purple-300" />
                    <span>Download Official Certificate</span>
                  </button>
                )}

                {selectedProgram.status === 'Open for Registration' && (
                  <button
                    onClick={() => handleToggleRegistration(selectedProgram.id)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                      selectedProgram.isRegistered
                        ? 'bg-emerald-600/40 border border-emerald-500 text-emerald-200 hover:bg-emerald-600/50'
                        : 'bg-gradient-to-r from-[#7C5CFC] to-[#5B36F5] hover:from-[#8B6EFC] hover:to-[#6A47F7] text-white shadow-indigo-950/60'
                    }`}
                  >
                    {selectedProgram.isRegistered ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Registered (Click to Unenroll)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Register For This FDP</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-xs text-slate-300 font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL VERIFIABLE CERTIFICATE MODAL */}
      {viewingCertificate && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setViewingCertificate(null)}
        >
          <div 
            className="w-full max-w-3xl bg-[#0A0E2A] border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 space-y-6 my-auto text-white shadow-2xl relative animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Verifiable Faculty Development Certificate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    onShowToast(`Downloaded certificate ${viewingCertificate.certificateDetails?.certificateId}.pdf`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setViewingCertificate(null)}
                  className="p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Canvas Box */}
            <div className="p-8 sm:p-10 rounded-xl bg-gradient-to-b from-[#0F1642] via-[#0B1033] to-[#070A24] border-4 border-double border-amber-500/30 text-center relative overflow-hidden">
              {/* Watermark Graphic */}
              <Award className="w-80 h-80 text-amber-500/5 absolute -right-20 -bottom-20 pointer-events-none" />
              
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="text-left">
                  <div className="text-xs font-black tracking-widest text-amber-400 uppercase">
                    {viewingCertificate.organizingBody}
                  </div>
                  <div className="text-[10px] text-slate-400">National Accreditation & Training Directorate</div>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-amber-400/60 bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-xl shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              {/* Certificate Title */}
              <div className="space-y-1 mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider uppercase">
                  Certificate of Completion
                </h1>
                <p className="text-xs text-slate-300 italic">This is proudly awarded to</p>
              </div>

              {/* Recipient Name */}
              <div className="py-2 border-b border-dashed border-amber-400/40 inline-block px-8 mb-4">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
                  {viewingCertificate.certificateDetails?.recipientName || 'Dr. Arvind K. Sharma'}
                </h2>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-6">
                {viewingCertificate.certificateDetails?.recipientDesignation || 'Head of Department, CSIT'} · MJPRU Bareilly
              </p>

              {/* Course Accomplishment Text */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
                for successfully completing the rigorous Faculty Development Program on{' '}
                <strong className="text-white font-bold block mt-1 text-base">"{viewingCertificate.title}"</strong>
                held from <span className="text-indigo-300 font-semibold">{viewingCertificate.datesFormatted}</span> ({viewingCertificate.duration}) with a grade of{' '}
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40">
                  {viewingCertificate.certificateDetails?.grade || 'Distinction (A+)'}
                </span>.
              </p>

              {/* Signatures & Accreditation Footer */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-500/20 text-left text-[10px] text-slate-400 mt-6">
                <div>
                  <div className="font-serif italic text-xs text-slate-200 border-b border-slate-600 pb-1 mb-1 font-bold">
                    {viewingCertificate.resourcePerson.name}
                  </div>
                  <span>Principal Resource Person</span>
                  <div className="text-[9px] text-slate-500">{viewingCertificate.resourcePerson.organization}</div>
                </div>

                <div className="text-center">
                  <div className="font-mono text-[9px] text-emerald-400 font-bold bg-[#090E2C] py-1 px-2 rounded border border-emerald-500/30 inline-block mb-1">
                    {viewingCertificate.certificateDetails?.certificateId}
                  </div>
                  <div className="text-[9px] text-slate-500">Issued: {viewingCertificate.certificateDetails?.issueDate}</div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-xs text-slate-200 border-b border-slate-600 pb-1 mb-1 font-bold">
                    Director (Academics)
                  </div>
                  <span>Accreditation Council</span>
                  <div className="text-[9px] text-slate-500">{viewingCertificate.certificateDetails?.accreditation}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT FDP FORM MODAL */}
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
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-black text-white">
                  {editingProgram ? 'Edit FDP Program' : 'Add New Faculty Development Program'}
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
              {/* Program Title */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Edge AI & Embedded System Integration"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Type, Mode, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Discipline / Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="AI & Emerging Tech">AI & Emerging Tech</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Research Methodology & Deep Tech">Research & Deep Tech</option>
                    <option value="Pedagogy & Accreditation">Pedagogy & Accreditation</option>
                    <option value="Cybersecurity & Cryptography">Cybersecurity</option>
                    <option value="VLSI & Hardware Systems">VLSI & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={e => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline (In-Person)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Open for Registration">Open for Registration</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Duration & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Week (30 Hours)"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Resource Person Info */}
              <div className="p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] space-y-3">
                <span className="font-bold text-indigo-300 uppercase tracking-wider block text-[11px]">
                  Resource Person / Keynote Speaker
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Speaker Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sanjay Rawat"
                      value={formData.resourcePerson?.name || ''}
                      onChange={e => setFormData({
                        ...formData,
                        resourcePerson: { ...formData.resourcePerson!, name: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-[#10173F] border border-[#233175] rounded-lg text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Designation & Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. Principal AI Scientist, Intel Labs"
                      value={formData.resourcePerson?.organization || ''}
                      onChange={e => setFormData({
                        ...formData,
                        resourcePerson: { ...formData.resourcePerson!, organization: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 bg-[#10173F] border border-[#233175] rounded-lg text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
              </div>

              {/* Organizing Body & Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-300 block mb-1">Organizing Body / Sponsor</label>
                  <input
                    type="text"
                    placeholder="e.g. AICTE Training and Learning (ATAL) Academy & MJPRU"
                    value={formData.organizingBody}
                    onChange={e => setFormData({ ...formData, organizingBody: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Total Seats</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formData.totalSeats}
                    onChange={e => setFormData({ ...formData, totalSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Description & Objectives</label>
                <textarea
                  rows={3}
                  placeholder="Detailed course scope, laboratory tools, and learning roadmap..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Learning Outcomes (one per line) */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Learning Outcomes (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Architecting production RAG pipelines&#10;Integrating hands-on lab modules for students&#10;Drafting funded grant proposals"
                  value={outcomesInput}
                  onChange={e => setOutcomesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400 font-mono text-[11px]"
                />
              </div>

              {/* Modal Actions */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#5B36F5] hover:from-[#8B6EFC] hover:to-[#6A47F7] text-white font-bold shadow-lg"
                >
                  {editingProgram ? 'Update Program' : 'Publish FDP Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingProgram && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onClick={() => setDeletingProgram(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0E1538] border border-rose-900/50 rounded-2xl p-6 space-y-4 text-white shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-black text-white">Delete FDP Program</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove <strong className="text-white">"{deletingProgram.title}"</strong>? This will remove this program from the departmental catalog.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingProgram(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
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
