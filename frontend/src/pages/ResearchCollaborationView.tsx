import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Building2, 
  IndianRupee, 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Plus, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Trash2, 
  X, 
  FileText, 
  Microscope, 
  Award, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  BookOpen,
  CheckSquare,
  Square,
  Landmark,
  Share2
} from 'lucide-react';
import { ResearchCollaboration } from '../types';
import { 
  getStoredResearchCollaborations, 
  saveStoredResearchCollaborations 
} from '../data/facultyCollaborationData';

interface ResearchCollaborationViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ResearchCollaborationView: React.FC<ResearchCollaborationViewProps> = ({ 
  onShowToast = () => {} 
}) => {
  const [projects, setProjects] = useState<ResearchCollaboration[]>(getStoredResearchCollaborations);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [agencyFilter, setAgencyFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'grant-desc' | 'grant-asc' | 'date-desc' | 'title'>('grant-desc');

  // Modals
  const [selectedProject, setSelectedProject] = useState<ResearchCollaboration | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ResearchCollaboration | null>(null);
  const [deletingProject, setDeletingProject] = useState<ResearchCollaboration | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ResearchCollaboration>>({
    title: '',
    partnerInstitution: '',
    pi: 'Dr. Arvind K. Sharma (PI)',
    coPis: ['Dr. Meenakshi Sundaram (Co-PI)'],
    fundingAgency: 'DST-SERB',
    grantAmount: 3500000,
    grantAmountFormatted: '₹35,00,000',
    duration: '36 Months (2026–2029)',
    startDate: '2026-10-01',
    endDate: '2029-09-30',
    status: 'Active/Ongoing',
    researchDomain: 'AI & Data Science',
    thrustArea: 'Trustworthy AI & Systems',
    description: '',
    sanctionOrderNumber: `DST/SERB/2026/${Math.floor(100 + Math.random() * 900)}`,
    keyDeliverables: [],
    publicationsExpected: '2 SCI Journals & 1 Conference Paper'
  });

  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [coPisInput, setCoPisInput] = useState('');

  const syncProjects = (updated: ResearchCollaboration[]) => {
    setProjects(updated);
    saveStoredResearchCollaborations(updated);
  };

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesAgency = agencyFilter === 'All' || p.fundingAgency.toLowerCase().includes(agencyFilter.toLowerCase());
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          p.title.toLowerCase().includes(q) ||
          p.partnerInstitution.toLowerCase().includes(q) ||
          p.fundingAgency.toLowerCase().includes(q) ||
          p.pi.toLowerCase().includes(q) ||
          p.researchDomain.toLowerCase().includes(q) ||
          (p.sanctionOrderNumber && p.sanctionOrderNumber.toLowerCase().includes(q));

        return matchesStatus && matchesAgency && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'grant-desc') return b.grantAmount - a.grantAmount;
        if (sortBy === 'grant-asc') return a.grantAmount - b.grantAmount;
        if (sortBy === 'date-desc') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [projects, statusFilter, agencyFilter, searchQuery, sortBy]);

  // Financial Stats & Metrics
  const stats = useMemo(() => {
    const totalCount = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active/Ongoing');
    const completedProjects = projects.filter(p => p.status === 'Completed');
    const proposalProjects = projects.filter(p => p.status === 'Proposal Stage');

    const totalGrantValue = projects.reduce((acc, p) => acc + p.grantAmount, 0);
    const activeGrantValue = activeProjects.reduce((acc, p) => acc + p.grantAmount, 0);
    const completedGrantValue = completedProjects.reduce((acc, p) => acc + p.grantAmount, 0);

    const formatLakhs = (num: number) => {
      const lakhs = (num / 100000).toFixed(2);
      return `₹${lakhs} L`;
    };

    return {
      totalCount,
      activeCount: activeProjects.length,
      activeGrant: formatLakhs(activeGrantValue),
      totalGrant: formatLakhs(totalGrantValue),
      completedCount: completedProjects.length,
      completedGrant: formatLakhs(completedGrantValue),
      proposalCount: proposalProjects.length,
      partnerCount: new Set(projects.map(p => p.partnerInstitution)).size
    };
  }, [projects]);

  // Unique funding agencies list
  const uniqueAgencies = useMemo(() => {
    const agencies = new Set(projects.map(p => p.fundingAgency));
    return Array.from(agencies);
  }, [projects]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      partnerInstitution: '',
      pi: 'Dr. Arvind K. Sharma (PI)',
      coPis: ['Dr. Meenakshi Sundaram (Co-PI)'],
      fundingAgency: 'DST-SERB',
      grantAmount: 3500000,
      grantAmountFormatted: '₹35,00,000',
      duration: '36 Months (2026–2029)',
      startDate: '2026-10-01',
      endDate: '2029-09-30',
      status: 'Active/Ongoing',
      researchDomain: 'AI & Data Science',
      thrustArea: 'Trustworthy AI & Systems',
      description: '',
      sanctionOrderNumber: `DST/SERB/2026/${Math.floor(100 + Math.random() * 900)}`,
      keyDeliverables: [],
      publicationsExpected: '2 SCI Journals & 1 Conference Paper'
    });
    setDeliverablesInput('');
    setCoPisInput('Dr. Meenakshi Sundaram (Co-PI)');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: ResearchCollaboration, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setFormData({ ...p });
    setDeliverablesInput(p.keyDeliverables ? p.keyDeliverables.join('\n') : '');
    setCoPisInput(p.coPis ? p.coPis.join(', ') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      onShowToast('Please provide a research collaboration project title.', 'error');
      return;
    }
    if (!formData.partnerInstitution?.trim()) {
      onShowToast('Please specify the partner research institution.', 'error');
      return;
    }

    const val = Number(formData.grantAmount) || 2500000;
    const formattedVal = `₹${val.toLocaleString('en-IN')}`;

    const deliverablesList = deliverablesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const coPisList = coPisInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProject) {
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            ...formData,
            grantAmount: val,
            grantAmountFormatted: formattedVal,
            keyDeliverables: deliverablesList.length > 0 ? deliverablesList : p.keyDeliverables,
            coPis: coPisList.length > 0 ? coPisList : p.coPis
          } as ResearchCollaboration;
        }
        return p;
      });
      syncProjects(updated);
      onShowToast(`Updated research collaboration: "${formData.title}"`, 'success');
    } else {
      const newProject: ResearchCollaboration = {
        id: `res-collab-${Date.now()}`,
        title: formData.title || 'Untitled Research Collaboration',
        partnerInstitution: formData.partnerInstitution || 'Research Partner Institute',
        pi: formData.pi || 'Dr. Arvind K. Sharma (PI)',
        coPis: coPisList.length > 0 ? coPisList : ['Dr. Meenakshi Sundaram (Co-PI)'],
        fundingAgency: formData.fundingAgency || 'DST-SERB',
        grantAmount: val,
        grantAmountFormatted: formattedVal,
        duration: formData.duration || '36 Months',
        startDate: formData.startDate || '2026-10-01',
        endDate: formData.endDate || '2029-09-30',
        status: (formData.status as any) || 'Active/Ongoing',
        researchDomain: formData.researchDomain || 'Applied Computer Science',
        thrustArea: formData.thrustArea || 'Interdisciplinary AI',
        description: formData.description || 'Inter-institutional sponsored research grant fostering high-impact computational research.',
        sanctionOrderNumber: formData.sanctionOrderNumber || `DST/SERB/2026/${Math.floor(100 + Math.random() * 900)}`,
        keyDeliverables: deliverablesList.length > 0 ? deliverablesList : [
          'High-throughput computational framework and algorithm implementation',
          'Peer-reviewed publications in Tier-1 IEEE/ACM venues',
          'Final project technical repository and institutional technology transfer'
        ],
        publicationsExpected: formData.publicationsExpected || '2 SCI Journals & 1 Patent',
        milestones: [
          { id: 'rm1', title: 'Phase 1: Architecture Formulation & Baseline Experiments', targetDate: '2026-12-31', completed: true, grantShare: `₹${Math.round(val * 0.3).toLocaleString('en-IN')}` },
          { id: 'rm2', title: 'Phase 2: Collaborative Model Training & Multi-Centric Trials', targetDate: '2027-12-31', completed: false, grantShare: `₹${Math.round(val * 0.4).toLocaleString('en-IN')}` },
          { id: 'rm3', title: 'Phase 3: Final Journal Dissemination & Grant Signoff', targetDate: formData.endDate || '2029-09-30', completed: false, grantShare: `₹${Math.round(val * 0.3).toLocaleString('en-IN')}` }
        ]
      };
      syncProjects([newProject, ...projects]);
      onShowToast(`Registered new research grant: "${newProject.title}" (Grant: ${formattedVal})`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingProject(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingProject) return;
    const updated = projects.filter(p => p.id !== deletingProject.id);
    syncProjects(updated);
    if (selectedProject?.id === deletingProject.id) {
      setSelectedProject(null);
    }
    onShowToast(`Removed research grant: "${deletingProject.title}"`, 'info');
    setDeletingProject(null);
  };

  // Toggle milestone completion
  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId && p.milestones) {
        const newMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextCompleted = !m.completed;
            onShowToast(
              nextCompleted ? `Milestone "${m.title}" marked as Complete!` : `Milestone marked as Pending`,
              'success'
            );
            return { ...m, completed: nextCompleted };
          }
          return m;
        });

        const allDone = newMilestones.every(m => m.completed);
        return {
          ...p,
          milestones: newMilestones,
          status: allDone ? ('Completed' as const) : p.status
        };
      }
      return p;
    });

    syncProjects(updated);
    if (selectedProject?.id === projectId) {
      setSelectedProject(updated.find(p => p.id === projectId) || null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner & Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Microscope className="w-3.5 h-3.5 text-indigo-400" />
              <span>Research Collaboration & Sponsored Grants</span>
            </div>
            <h2 className="text-2xl font-black text-white">Funded R&D & Academic Consortium Projects</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              High-impact sponsored research projects funded by DST-SERB, MeitY, CSIR, and ISRO led by CSIT faculty with top national and international research institutions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] hover:from-[#8B5CF6] hover:to-[#7C5CFC] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Research Project</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Grants</span>
              <Microscope className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.activeCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">{stats.activeGrant} in active research</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Grants</span>
              <IndianRupee className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.totalGrant}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stats.totalCount} projects sanctioned</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed Grants</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{stats.completedGrant}</div>
            <div className="text-[10px] text-indigo-300/80 mt-0.5">{stats.completedCount} grants delivered</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Partner Institutes</span>
              <Landmark className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">{stats.partnerCount}</div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5">AIIMS, IISc, IIT, ISRO...</div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sorting Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Active/Ongoing', 'Upcoming', 'Completed', 'Proposal Stage'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search, Agency Filter & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, partner, PI, agency..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <select
            value={agencyFilter}
            onChange={e => setAgencyFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400 max-w-[150px]"
          >
            <option value="All">All Agencies</option>
            {uniqueAgencies.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="grant-desc">Highest Grant (₹)</option>
            <option value="grant-asc">Lowest Grant (₹)</option>
            <option value="date-desc">Newest Project</option>
            <option value="title">Project Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <Microscope className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Research Collaborations Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or register a new sponsored research collaboration.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setAgencyFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-indigo-300 font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map(project => {
            const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
            const totalMilestones = project.milestones?.length || 0;
            const milestonePercentage = totalMilestones > 0 
              ? Math.round((completedMilestones / totalMilestones) * 100) 
              : 0;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#384DA5] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-indigo-950/20"
              >
                <div>
                  {/* Funding Agency Badge & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-700/50 flex items-center gap-1">
                        <Landmark className="w-3 h-3 text-amber-400" />
                        <span>{project.fundingAgency}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
                        {project.researchDomain}
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 ${
                        project.status === 'Active/Ongoing'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : project.status === 'Completed'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : project.status === 'Upcoming'
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          project.status === 'Active/Ongoing' ? 'bg-emerald-400 animate-pulse' :
                          project.status === 'Completed' ? 'bg-blue-400' :
                          project.status === 'Upcoming' ? 'bg-indigo-400' : 'bg-amber-400'
                        }`} />
                        {project.status}
                      </span>

                      {/* HOD Quick Actions */}
                      <button
                        onClick={(e) => handleOpenEditModal(project, e)}
                        title="Edit Project"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProject(project);
                        }}
                        title="Delete Project"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Partner Institution Highlight */}
                  <div className="mt-2 text-xs text-indigo-300 font-bold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">Partner: {project.partnerInstitution}</span>
                  </div>

                  {/* Grant Value & Duration Banner */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Sanctioned Grant
                      </div>
                      <div className="text-lg font-black text-amber-300 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-amber-400" />
                        <span>{project.grantAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Project Duration
                      </div>
                      <div className="text-xs font-bold text-slate-200">
                        {project.duration}
                      </div>
                    </div>
                  </div>

                  {/* Principal Investigator & Details */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-white">Lead PI:</strong> {project.pi}
                      </span>
                    </div>
                    {project.coPis && project.coPis.length > 0 && (
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">Co-PIs: {project.coPis.join(', ')}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <BookOpen className="w-3 h-3 text-indigo-400" />
                        <span className="truncate">{project.publicationsExpected || 'SCI Target'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{project.sanctionOrderNumber || 'Ref: Sanction Order'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Milestones & Details Trigger */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] space-y-2.5">
                  {totalMilestones > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          Grant Milestone Attainment
                        </span>
                        <span className="font-bold text-slate-200">
                          {completedMilestones} of {totalMilestones} Completed ({milestonePercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#141C48] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${milestonePercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="text-xs text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Sanction Scope & Milestones</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Exported Official DST/MeitY Research Dossier for "${project.title}"`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Sanction Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-900/50 text-amber-300 border border-amber-700/50">
                  {selectedProject.fundingAgency}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                  {selectedProject.researchDomain}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedProject.status === 'Active/Ongoing' ? 'bg-emerald-900/50 text-emerald-300' :
                  selectedProject.status === 'Completed' ? 'bg-blue-900/50 text-blue-300' : 'bg-amber-900/50 text-amber-300'
                }`}>
                  {selectedProject.status}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedProject.title}
              </h2>
              <p className="text-xs text-indigo-300 font-semibold mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Partner: {selectedProject.partnerInstitution}</span>
              </p>
            </div>

            {/* Financial & Sanction Order Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grant Sanctioned</span>
                <span className="text-base font-black text-amber-300 flex items-center gap-0.5 mt-0.5">
                  <IndianRupee className="w-4 h-4" />
                  {selectedProject.grantAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sanction Order Ref</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedProject.sanctionOrderNumber || 'DST/SERB/2026/0418'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-slate-200 mt-0.5 block truncate">
                  {selectedProject.duration}
                </span>
              </div>
            </div>

            {/* Investigator Team */}
            <div className="p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] space-y-2">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Research Leadership & Collaborative Consortium
              </span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
                  PI
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{selectedProject.pi}</div>
                  <div className="text-[10px] text-slate-400">Head of Department · CSIT</div>
                </div>
              </div>
              {selectedProject.coPis && selectedProject.coPis.length > 0 && (
                <div className="text-[11px] text-slate-300 pt-1 border-t border-white/5 flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">Co-Principal Investigators:</span>
                  <span>{selectedProject.coPis.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Abstract */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Research Abstract & Problem Statement</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Key Deliverables */}
            {selectedProject.keyDeliverables && selectedProject.keyDeliverables.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Sanctioned Research Deliverables</h4>
                <div className="space-y-1.5">
                  {selectedProject.keyDeliverables.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#090E2C] border border-[#1E2964] flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones Tracker */}
            {selectedProject.milestones && selectedProject.milestones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Grant Milestones & Fund Utilization
                  </h4>
                  <span className="text-[10px] text-slate-400 italic">Click checkbox to update milestone attainment</span>
                </div>
                <div className="space-y-2">
                  {selectedProject.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(selectedProject.id, m.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        m.completed
                          ? 'bg-indigo-950/30 border-indigo-600/50 hover:bg-indigo-950/40'
                          : 'bg-[#090E2C] border-[#1E2964] hover:border-[#2B3B8A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.completed ? (
                          <CheckSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <div className={`text-xs font-bold ${m.completed ? 'text-indigo-200 line-through' : 'text-white'}`}>
                            {m.title}
                          </div>
                          <div className="text-[10px] text-slate-400">Target Date: {m.targetDate}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded bg-[#141C48] text-amber-300 text-[10px] font-bold border border-[#233175]">
                          {m.grantShare}
                        </span>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {m.completed ? 'Fund Utilized & Audited' : 'Pending Milestone'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <button
                onClick={() => {
                  onShowToast(`Exported formal Grant Utilization Certificate (UC) & SE for ${selectedProject.fundingAgency}`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export UC & SE Certificate</span>
              </button>

              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1E2964] text-xs text-slate-300 font-bold"
              >
                Close
              </button>
            </div>
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
                <Microscope className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-black text-white">
                  {editingProject ? 'Edit Research Project' : 'Register New Research Collaboration'}
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
              <div>
                <label className="font-bold text-slate-300 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Explainable AI Framework for Clinical Decision Support in Oncology"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Partner Institution *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIIMS New Delhi & IIT Roorkee"
                    value={formData.partnerInstitution}
                    onChange={e => setFormData({ ...formData, partnerInstitution: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Funding Agency *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DST-SERB, MeitY, ISRO RESPOND, CSIR"
                    value={formData.fundingAgency}
                    onChange={e => setFormData({ ...formData, fundingAgency: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sanctioned Grant (₹) *</label>
                  <input
                    type="number"
                    required
                    min="100000"
                    step="50000"
                    placeholder="3500000"
                    value={formData.grantAmount}
                    onChange={e => setFormData({ ...formData, grantAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Project Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Active/Ongoing">Active/Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposal Stage">Proposal Stage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sanction Order Ref</label>
                  <input
                    type="text"
                    placeholder="DST/SERB/2026/0418"
                    value={formData.sanctionOrderNumber}
                    onChange={e => setFormData({ ...formData, sanctionOrderNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Principal Investigator (PI)</label>
                  <input
                    type="text"
                    value={formData.pi}
                    onChange={e => setFormData({ ...formData, pi: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Co-PIs (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Dr. Meenakshi Sundaram (Co-PI), Dr. Rajesh Narang"
                    value={coPisInput}
                    onChange={e => setCoPisInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Research Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Medical AI & Explainable Deep Learning"
                    value={formData.researchDomain}
                    onChange={e => setFormData({ ...formData, researchDomain: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Duration & Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 36 Months (2026–2029)"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Project Description & Abstract</label>
                <textarea
                  rows={3}
                  placeholder="Problem formulation, collaborative experimental testbeds, expected societal and technological outcomes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Key Deliverables (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Multi-modal transformer attention map visualization pipeline&#10;Clinical trial dataset validation with 5,000+ anonymized slides&#10;Technology transfer documentation and patent filing"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400 font-mono text-[11px]"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] hover:from-[#8B5CF6] hover:to-[#7C5CFC] text-white font-bold shadow-lg"
                >
                  {editingProject ? 'Update Research Project' : 'Register Research Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deletingProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingProject(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0E1538] border border-rose-600/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Research Project?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deletingProject.title}"</strong>? This will remove all associated sanction milestones and deliverables from the institutional portal.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingProject(null)}
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
