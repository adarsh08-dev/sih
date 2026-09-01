import React, { useState, useMemo } from 'react';
import { 
  BriefcaseBusiness, 
  Building2, 
  IndianRupee, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Search, 
  Plus, 
  CheckCircle2, 
  Download, 
  Edit3, 
  Trash2, 
  X, 
  FileText, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  CheckSquare,
  Square,
  ArrowUpRight,
  PieChart,
  FileSpreadsheet
} from 'lucide-react';
import { ConsultancyProject, ConsultancyMilestone } from '../types';
import { getStoredConsultancies, saveStoredConsultancies } from '../data/fdpConsultancyData';

interface ConsultancyViewProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ConsultancyView: React.FC<ConsultancyViewProps> = ({ onShowToast }) => {
  const [projects, setProjects] = useState<ConsultancyProject[]>(getStoredConsultancies);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'date-desc' | 'title'>('value-desc');

  // Modals
  const [selectedProject, setSelectedProject] = useState<ConsultancyProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ConsultancyProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<ConsultancyProject | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ConsultancyProject>>({
    projectTitle: '',
    clientOrganization: '',
    domain: 'Industrial IoT & Anomaly Detection',
    facultyLead: 'Dr. Arvind K. Sharma (PI)',
    coInvestigators: ['Dr. Meenakshi Sundaram (Co-PI)'],
    duration: '6 Months (Oct 2026 – Mar 2027)',
    startDate: '2026-10-01',
    endDate: '2027-03-31',
    engagementType: 'Industrial R&D & Software Delivery',
    status: 'Ongoing',
    consultancyValue: 750000,
    consultancyValueFormatted: '₹7,50,000',
    description: '',
    deliverables: [],
    contractRefNumber: `MJPRU/IND-CONS/2026/${Math.floor(100 + Math.random() * 900)}`
  });

  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [coInvestigatorsInput, setCoInvestigatorsInput] = useState('');

  const syncProjects = (updated: ConsultancyProject[]) => {
    setProjects(updated);
    saveStoredConsultancies(updated);
  };

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesDomain = domainFilter === 'All' || p.domain.toLowerCase().includes(domainFilter.toLowerCase());
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          p.projectTitle.toLowerCase().includes(q) ||
          p.clientOrganization.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q) ||
          p.facultyLead.toLowerCase().includes(q) ||
          (p.contractRefNumber && p.contractRefNumber.toLowerCase().includes(q));

        return matchesStatus && matchesDomain && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'value-desc') {
          return b.consultancyValue - a.consultancyValue;
        }
        if (sortBy === 'value-asc') {
          return a.consultancyValue - b.consultancyValue;
        }
        if (sortBy === 'date-desc') {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        if (sortBy === 'title') {
          return a.projectTitle.localeCompare(b.projectTitle);
        }
        return 0;
      });
  }, [projects, statusFilter, domainFilter, searchQuery, sortBy]);

  // Financial & Stats calculations
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const ongoingProjects = projects.filter(p => p.status === 'Ongoing');
    const completedProjects = projects.filter(p => p.status === 'Completed');
    const proposalProjects = projects.filter(p => p.status === 'Proposal Stage');

    const totalPortfolioValue = projects.reduce((acc, p) => acc + p.consultancyValue, 0);
    const ongoingValue = ongoingProjects.reduce((acc, p) => acc + p.consultancyValue, 0);
    const completedValue = completedProjects.reduce((acc, p) => acc + p.consultancyValue, 0);
    const proposalValue = proposalProjects.reduce((acc, p) => acc + p.consultancyValue, 0);

    const formatLakhs = (num: number) => {
      const lakhs = (num / 100000).toFixed(2);
      return `₹${lakhs} L`;
    };

    return {
      totalProjects,
      activeCount: ongoingProjects.length,
      ongoingValue: formatLakhs(ongoingValue),
      totalValue: formatLakhs(totalPortfolioValue),
      completedCount: completedProjects.length,
      completedValue: formatLakhs(completedValue),
      proposalCount: proposalProjects.length,
      proposalValue: formatLakhs(proposalValue),
      clientCount: new Set(projects.map(p => p.clientOrganization)).size
    };
  }, [projects]);

  // Unique domains list for filter dropdown
  const uniqueDomains = useMemo(() => {
    const domains = new Set(projects.map(p => p.domain));
    return Array.from(domains);
  }, [projects]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      projectTitle: '',
      clientOrganization: '',
      domain: 'Industrial IoT & Anomaly Detection',
      facultyLead: 'Dr. Arvind K. Sharma (PI)',
      coInvestigators: ['Dr. Meenakshi Sundaram (Co-PI)'],
      duration: '6 Months (Oct 2026 – Mar 2027)',
      startDate: '2026-10-01',
      endDate: '2027-03-31',
      engagementType: 'Industrial R&D & Software Delivery',
      status: 'Ongoing',
      consultancyValue: 750000,
      consultancyValueFormatted: '₹7,50,000',
      description: '',
      deliverables: [],
      contractRefNumber: `MJPRU/IND-CONS/2026/${Math.floor(100 + Math.random() * 900)}`
    });
    setDeliverablesInput('');
    setCoInvestigatorsInput('Dr. Meenakshi Sundaram (Co-PI)');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: ConsultancyProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setFormData({ ...p });
    setDeliverablesInput(p.deliverables ? p.deliverables.join('\n') : '');
    setCoInvestigatorsInput(p.coInvestigators ? p.coInvestigators.join(', ') : '');
    setIsAddModalOpen(true);
  };

  // Save Form (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectTitle?.trim()) {
      onShowToast('Please provide a consultancy project title.', 'error');
      return;
    }
    if (!formData.clientOrganization?.trim()) {
      onShowToast('Please specify the client organization.', 'error');
      return;
    }

    const val = Number(formData.consultancyValue) || 500000;
    const formattedVal = `₹${val.toLocaleString('en-IN')}`;

    const deliverablesList = deliverablesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const coInvestigatorsList = coInvestigatorsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingProject) {
      // Update
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            ...formData,
            consultancyValue: val,
            consultancyValueFormatted: formattedVal,
            deliverables: deliverablesList.length > 0 ? deliverablesList : p.deliverables,
            coInvestigators: coInvestigatorsList.length > 0 ? coInvestigatorsList : p.coInvestigators
          } as ConsultancyProject;
        }
        return p;
      });
      syncProjects(updated);
      onShowToast(`Updated consultancy project: "${formData.projectTitle}"`, 'success');
    } else {
      // Create new
      const newProject: ConsultancyProject = {
        id: `cons-${Date.now()}`,
        projectTitle: formData.projectTitle || 'Untitled Industry Consultancy',
        clientOrganization: formData.clientOrganization || 'Industry Client Partner',
        domain: formData.domain || 'Applied Software Engineering',
        facultyLead: formData.facultyLead || 'Dr. Arvind K. Sharma (PI)',
        coInvestigators: coInvestigatorsList.length > 0 ? coInvestigatorsList : ['Dr. Meenakshi Sundaram (Co-PI)'],
        duration: formData.duration || '6 Months',
        startDate: formData.startDate || '2026-10-01',
        endDate: formData.endDate || '2027-03-31',
        engagementType: formData.engagementType || 'Industrial R&D & Delivery',
        status: (formData.status as any) || 'Ongoing',
        consultancyValue: val,
        consultancyValueFormatted: formattedVal,
        description: formData.description || 'Custom corporate consultancy and software delivery engagement with verified institutional deliverables.',
        deliverables: deliverablesList.length > 0 ? deliverablesList : [
          'High-performance system architecture blueprint',
          'Production telemetry pipeline & API integration',
          'Field benchmark validation & technology transfer documentation'
        ],
        milestones: [
          { id: 'm1', title: 'Phase 1: Architecture Review & Benchmark Specification', dueDate: formData.startDate || '2026-10-30', completed: true, valueShare: `₹${Math.round(val * 0.3).toLocaleString('en-IN')}` },
          { id: 'm2', title: 'Phase 2: Prototype Development & Live Telemetry Trials', dueDate: '2026-12-31', completed: false, valueShare: `₹${Math.round(val * 0.4).toLocaleString('en-IN')}` },
          { id: 'm3', title: 'Phase 3: Final Handover, IP Licensing & Training', dueDate: formData.endDate || '2027-03-31', completed: false, valueShare: `₹${Math.round(val * 0.3).toLocaleString('en-IN')}` }
        ],
        contractRefNumber: formData.contractRefNumber || `MJPRU/IND-CONS/2026/${Math.floor(100 + Math.random() * 900)}`
      };
      syncProjects([newProject, ...projects]);
      onShowToast(`Created new consultancy project: "${newProject.projectTitle}" (Value: ${formattedVal})`, 'success');
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
    onShowToast(`Removed consultancy project: "${deletingProject.projectTitle}"`, 'info');
    setDeletingProject(null);
  };

  // Toggle milestone completion in detail modal
  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId && p.milestones) {
        const newMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextCompleted = !m.completed;
            onShowToast(
              nextCompleted ? `Milestone "${m.title}" marked as Completed!` : `Milestone marked as Pending`,
              'success'
            );
            return { ...m, completed: nextCompleted };
          }
          return m;
        });

        // Check if all are complete
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
      {/* Header Banner & Summary Widget */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <BriefcaseBusiness className="w-3.5 h-3.5 text-emerald-400" />
              <span>Industry Consultancy & Sponsored R&D</span>
            </div>
            <h2 className="text-2xl font-black text-white">Corporate Collaborations & Revenue Generation</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              High-impact industrial research, architecture audits, and technical advisory projects led by CSIT faculty with top enterprises and public sector undertakings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all border border-emerald-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Consultancy</span>
            </button>
          </div>
        </div>

        {/* 4 Rich Summary Metric Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {/* Active Consultancies */}
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Projects</span>
              <ActivityIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.activeCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">{stats.ongoingValue} active pipeline</div>
          </div>

          {/* Cumulative Portfolio Value */}
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Value</span>
              <IndianRupee className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.totalValue}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stats.totalProjects} engagements signed</div>
          </div>

          {/* Completed Value */}
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed / Realized</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{stats.completedValue}</div>
            <div className="text-[10px] text-indigo-300/80 mt-0.5">{stats.completedCount} deliverables handed over</div>
          </div>

          {/* Corporate Clients */}
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Client Partners</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">{stats.clientCount}</div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5">BPCL, Schneider, UPPCL...</div>
          </div>
        </div>
      </div>

      {/* Filter, Search & Sorting Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Ongoing', 'Completed', 'Proposal Stage'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search, Domain Filter & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search project, client, domain..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          <select
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-400 max-w-[150px]"
          >
            <option value="All">All Domains</option>
            {uniqueDomains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
          >
            <option value="value-desc">Highest Value (₹)</option>
            <option value="value-asc">Lowest Value (₹)</option>
            <option value="date-desc">Newest Project</option>
            <option value="title">Project Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <BriefcaseBusiness className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Consultancy Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or register a new industry consultancy contract.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setDomainFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-emerald-300 font-bold"
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
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#2B3B8A] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-emerald-950/20"
              >
                <div>
                  {/* Client Badge & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-emerald-400" />
                        <span>{project.clientOrganization}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
                        {project.domain}
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 ${
                        project.status === 'Ongoing'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : project.status === 'Completed'
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          project.status === 'Ongoing' ? 'bg-emerald-400 animate-pulse' :
                          project.status === 'Completed' ? 'bg-blue-400' : 'bg-amber-400'
                        }`} />
                        {project.status}
                      </span>

                      {/* HOD Quick Actions */}
                      <button
                        onClick={(e) => handleOpenEditModal(project, e)}
                        title="Edit Consultancy"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProject(project);
                        }}
                        title="Delete Consultancy"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                    {project.projectTitle}
                  </h3>

                  {/* Value & Engagement Type Highlight */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Consultancy Value
                      </div>
                      <div className="text-lg font-black text-emerald-300 flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-emerald-400" />
                        <span>{project.consultancyValue.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Engagement Type
                      </div>
                      <div className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                        {project.engagementType}
                      </div>
                    </div>
                  </div>

                  {/* Faculty Lead & Meta Info */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        <strong className="text-white">Principal Investigator:</strong> {project.facultyLead}
                      </span>
                    </div>
                    {project.coInvestigators && project.coInvestigators.length > 0 && (
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">Team: {project.coInvestigators.join(', ')}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        <span className="truncate">{project.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{project.contractRefNumber || 'Ref: MJPRU/IND-CONS'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Milestones & Details Trigger */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] space-y-2.5">
                  {/* Milestones Progress */}
                  {totalMilestones > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Milestone Attainment
                        </span>
                        <span className="font-bold text-slate-200">
                          {completedMilestones} of {totalMilestones} Completed ({milestonePercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#141C48] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${milestonePercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Trigger Detail View */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="text-xs text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Scope & Milestones</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Generated Official Project Brief & NAAC Criterion 3 Report for "${project.projectTitle}" (Ref: ${project.contractRefNumber})`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Project Brief</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL ON CARD CLICK */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                  {selectedProject.clientOrganization}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                  {selectedProject.domain}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  selectedProject.status === 'Ongoing' ? 'bg-emerald-900/50 text-emerald-300' :
                  selectedProject.status === 'Completed' ? 'bg-blue-900/50 text-blue-300' : 'bg-amber-900/50 text-amber-300'
                }`}>
                  {selectedProject.status}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedProject.projectTitle}
              </h2>
              <p className="text-xs text-emerald-300 font-semibold mt-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Contract Reference: {selectedProject.contractRefNumber || 'MJPRU/IND-CONS/2026/044'}</span>
              </p>
            </div>

            {/* Financial & Logistics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contract Value</span>
                <span className="text-base font-black text-emerald-300 flex items-center gap-0.5 mt-0.5">
                  <IndianRupee className="w-4 h-4" />
                  {selectedProject.consultancyValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {selectedProject.duration}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Engagement Type</span>
                <span className="font-bold text-slate-200 mt-0.5 block truncate">
                  {selectedProject.engagementType}
                </span>
              </div>
            </div>

            {/* Principal Investigators Team */}
            <div className="p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] space-y-2">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Investigator Team & Department Leadership
              </span>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                  PI
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{selectedProject.facultyLead}</div>
                  <div className="text-[10px] text-slate-400">Head of Department · CSIT</div>
                </div>
              </div>
              {selectedProject.coInvestigators && selectedProject.coInvestigators.length > 0 && (
                <div className="text-[11px] text-slate-300 pt-1 border-t border-white/5 flex items-center gap-1.5">
                  <span className="text-slate-400 font-semibold">Co-Investigators:</span>
                  <span>{selectedProject.coInvestigators.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Executive Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Project Scope & Executive Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Deliverables List */}
            {selectedProject.deliverables && selectedProject.deliverables.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Key Contract Deliverables</h4>
                <div className="space-y-1.5">
                  {selectedProject.deliverables.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-[#090E2C] border border-[#1E2964] flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Milestones Tracker */}
            {selectedProject.milestones && selectedProject.milestones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Milestone Schedule & Fund Release
                  </h4>
                  <span className="text-[10px] text-slate-400 italic">Click checkbox to update milestone status</span>
                </div>
                <div className="space-y-2">
                  {selectedProject.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(selectedProject.id, m.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        m.completed
                          ? 'bg-emerald-950/30 border-emerald-600/50 hover:bg-emerald-950/40'
                          : 'bg-[#090E2C] border-[#1E2964] hover:border-[#2B3B8A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <div className={`text-xs font-bold ${m.completed ? 'text-emerald-200 line-through' : 'text-white'}`}>
                            {m.title}
                          </div>
                          <div className="text-[10px] text-slate-400">Target Date: {m.dueDate}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded bg-[#141C48] text-emerald-300 text-[10px] font-bold border border-[#233175]">
                          {m.valueShare}
                        </span>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {m.completed ? 'Fund Released' : 'Pending Signoff'}
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
                  onShowToast(`Exported formal Consultancy MoU & Invoice Summary for ${selectedProject.clientOrganization}`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Invoice & MoU</span>
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

      {/* ADD / EDIT CONSULTANCY FORM MODAL */}
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
                <BriefcaseBusiness className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">
                  {editingProject ? 'Edit Consultancy Project' : 'Register New Industry Consultancy'}
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
              {/* Project Title */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated SCADA Telemetry & Anomaly Detection Pipeline"
                  value={formData.projectTitle}
                  onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Client & Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Client Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bharat Petroleum Corporation Ltd. (BPCL)"
                    value={formData.clientOrganization}
                    onChange={e => setFormData({ ...formData, clientOrganization: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Technical Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Industrial IoT & Anomaly Detection"
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Consultancy Value & Status & Contract Ref */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Consultancy Value (₹) *</label>
                  <input
                    type="number"
                    required
                    min="50000"
                    step="10000"
                    placeholder="850000"
                    value={formData.consultancyValue}
                    onChange={e => setFormData({ ...formData, consultancyValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Project Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposal Stage">Proposal Stage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Contract Ref No.</label>
                  <input
                    type="text"
                    placeholder="MJPRU/IND-CONS/2026/044"
                    value={formData.contractRefNumber}
                    onChange={e => setFormData({ ...formData, contractRefNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Faculty Lead & Co-Investigators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Principal Investigator (PI)</label>
                  <input
                    type="text"
                    value={formData.facultyLead}
                    onChange={e => setFormData({ ...formData, facultyLead: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Co-Investigators (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Dr. Meenakshi Sundaram (Co-PI), Prof. R. K. Gupta"
                    value={coInvestigatorsInput}
                    onChange={e => setCoInvestigatorsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Engagement Type & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Engagement Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Industrial R&D & Software Delivery"
                    value={formData.engagementType}
                    onChange={e => setFormData({ ...formData, engagementType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Duration & Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Months (Oct 2026 – Mar 2027)"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Project Scope & Summary</label>
                <textarea
                  rows={3}
                  placeholder="Problem statement, technical approach, industrial impact, and client specifications..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Deliverables */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Deliverables (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Edge IoT telemetry parsing firmware&#10;Kafka-backed ingestion pipeline&#10;Final technical signoff and handover documentation"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-bold shadow-lg"
                >
                  {editingProject ? 'Update Consultancy' : 'Register Consultancy Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onClick={() => setDeletingProject(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0E1538] border border-rose-900/50 rounded-2xl p-6 space-y-4 text-white shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-black text-white">Delete Consultancy Project</h3>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete <strong className="text-white">"{deletingProject.projectTitle}"</strong> ({deletingProject.clientOrganization})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeletingProject(null)}
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

const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
