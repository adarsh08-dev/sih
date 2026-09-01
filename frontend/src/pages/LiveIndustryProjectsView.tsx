import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Building2, 
  Users, 
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
  Code2, 
  ChevronRight, 
  ExternalLink,
  Award, 
  Sparkles, 
  GitBranch, 
  CheckSquare, 
  Square,
  Briefcase,
  Terminal,
  Cpu
} from 'lucide-react';
import { LiveIndustryProject } from '../types';
import { 
  getStoredLiveProjects, 
  saveStoredLiveProjects 
} from '../data/facultyCollaborationData';

interface LiveIndustryProjectsViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const LiveIndustryProjectsView: React.FC<LiveIndustryProjectsViewProps> = ({ 
  onShowToast = () => {} 
}) => {
  const [projects, setProjects] = useState<LiveIndustryProject[]>(getStoredLiveProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'team-desc' | 'date-desc' | 'title'>('date-desc');

  // Modals
  const [selectedProject, setSelectedProject] = useState<LiveIndustryProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<LiveIndustryProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<LiveIndustryProject | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<LiveIndustryProject>>({
    title: '',
    clientCompany: '',
    facultyMentor: 'Dr. Arvind K. Sharma (Lead Mentor)',
    coMentor: 'Er. Industry Advisor',
    teamSize: 4,
    teamSizeFormatted: '4 Students + 1 Faculty Mentor',
    studentTeam: [],
    techStack: ['Python', 'Docker', 'FastAPI', 'React'],
    domain: 'Industrial IoT & Predictive Analytics',
    duration: '4 Months (Aug 2026 – Nov 2026)',
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    status: 'Active/Ongoing',
    description: '',
    githubOrJiraRef: 'github.com/mjpru-csit/industry-capstone-poc',
    stipendOrBounty: '₹15,000/month per student + PPI',
    deliverables: [],
    industrySupervisor: {
      name: 'Er. Industrial Supervisor',
      designation: 'Staff Principal Engineer',
      email: 'lead@enterprise.com'
    }
  });

  const [techStackInput, setTechStackInput] = useState('Python, Docker, FastAPI, React');
  const [deliverablesInput, setDeliverablesInput] = useState('');
  const [studentsInput, setStudentsInput] = useState('Aarav Sharma (230104011), Pooja Verma (230104056)');

  const syncProjects = (updated: LiveIndustryProject[]) => {
    setProjects(updated);
    saveStoredLiveProjects(updated);
  };

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesDomain = domainFilter === 'All' || p.domain.toLowerCase().includes(domainFilter.toLowerCase());
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || 
          p.title.toLowerCase().includes(q) ||
          p.clientCompany.toLowerCase().includes(q) ||
          p.facultyMentor.toLowerCase().includes(q) ||
          p.techStack.some(t => t.toLowerCase().includes(q)) ||
          p.studentTeam.some(s => s.name.toLowerCase().includes(q));

        return matchesStatus && matchesDomain && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'team-desc') return b.teamSize - a.teamSize;
        if (sortBy === 'date-desc') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [projects, statusFilter, domainFilter, searchQuery, sortBy]);

  // Overall Statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active/Ongoing');
    const completedProjects = projects.filter(p => p.status === 'Completed');
    const totalStudentsEnrolled = projects.reduce((acc, p) => acc + (p.studentTeam?.length || p.teamSize), 0);
    const corporatePartners = new Set(projects.map(p => p.clientCompany)).size;

    return {
      totalProjects,
      activeCount: activeProjects.length,
      completedCount: completedProjects.length,
      totalStudents: totalStudentsEnrolled,
      corporatePartners
    };
  }, [projects]);

  // Unique domains
  const uniqueDomains = useMemo(() => {
    const domains = new Set(projects.map(p => p.domain));
    return Array.from(domains);
  }, [projects]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      clientCompany: '',
      facultyMentor: 'Dr. Arvind K. Sharma (Lead Mentor)',
      coMentor: 'Er. Industry Co-Mentor',
      teamSize: 4,
      teamSizeFormatted: '4 Students + 1 Faculty Mentor',
      studentTeam: [],
      techStack: ['Python', 'Docker', 'FastAPI', 'React'],
      domain: 'Industrial IoT & Cloud Systems',
      duration: '4 Months (Aug 2026 – Nov 2026)',
      startDate: '2026-08-01',
      endDate: '2026-11-30',
      status: 'Active/Ongoing',
      description: '',
      githubOrJiraRef: 'github.com/mjpru-csit/industry-capstone',
      stipendOrBounty: '₹15,000/month per student',
      deliverables: [],
      industrySupervisor: {
        name: 'Er. Technical Director',
        designation: 'Head of Engineering Innovation',
        email: 'supervisor@industry.com'
      }
    });
    setTechStackInput('Python, Docker, FastAPI, React');
    setDeliverablesInput('');
    setStudentsInput('Aarav Sharma (230104011), Pooja Verma (230104056), Tanmay Saxena (230104078)');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (p: LiveIndustryProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setFormData({ ...p });
    setTechStackInput(p.techStack.join(', '));
    setDeliverablesInput(p.deliverables ? p.deliverables.join('\n') : '');
    setStudentsInput(p.studentTeam ? p.studentTeam.map(s => `${s.name} (${s.rollNo})`).join(', ') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      onShowToast('Please provide a live project title.', 'error');
      return;
    }
    if (!formData.clientCompany?.trim()) {
      onShowToast('Please specify the corporate client company.', 'error');
      return;
    }

    const techList = techStackInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const deliverablesList = deliverablesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // Parse student roster
    const studentRoster = studentsInput
      .split(',')
      .map(item => {
        const trimmed = item.trim();
        const match = trimmed.match(/^([^(]+)(?:\(([^)]+)\))?/);
        const name = match ? match[1].trim() : trimmed;
        const rollNo = match && match[2] ? match[2].trim() : `230104${Math.floor(100 + Math.random() * 900)}`;
        return {
          name,
          rollNo,
          role: 'Full-Stack Software Engineer',
          program: 'B.Tech CSE VII'
        };
      })
      .filter(s => s.name);

    const size = studentRoster.length || Number(formData.teamSize) || 4;

    if (editingProject) {
      const updated = projects.map(p => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            ...formData,
            techStack: techList.length > 0 ? techList : p.techStack,
            deliverables: deliverablesList.length > 0 ? deliverablesList : p.deliverables,
            studentTeam: studentRoster.length > 0 ? studentRoster : p.studentTeam,
            teamSize: size,
            teamSizeFormatted: `${size} Students + 1 Faculty Mentor`
          } as LiveIndustryProject;
        }
        return p;
      });
      syncProjects(updated);
      onShowToast(`Updated live project: "${formData.title}"`, 'success');
    } else {
      const newProject: LiveIndustryProject = {
        id: `live-proj-${Date.now()}`,
        title: formData.title || 'Untitled Live Industry Project',
        clientCompany: formData.clientCompany || 'Corporate Partner',
        facultyMentor: formData.facultyMentor || 'Dr. Arvind K. Sharma (Lead Mentor)',
        coMentor: formData.coMentor,
        teamSize: size,
        teamSizeFormatted: `${size} Students + 1 Faculty Mentor`,
        studentTeam: studentRoster.length > 0 ? studentRoster : [
          { name: 'Aarav Sharma', rollNo: '230104011', role: 'Team Lead', program: 'B.Tech CSE VII' },
          { name: 'Pooja Verma', rollNo: '230104056', role: 'Backend Engineer', program: 'B.Tech CSE VII' }
        ],
        techStack: techList.length > 0 ? techList : ['Python', 'React', 'Docker'],
        domain: formData.domain || 'Applied Software Engineering',
        duration: formData.duration || '4 Months',
        startDate: formData.startDate || '2026-08-01',
        endDate: formData.endDate || '2026-11-30',
        status: (formData.status as any) || 'Active/Ongoing',
        description: formData.description || 'Production-grade live industry project solving mission-critical enterprise engineering challenges.',
        githubOrJiraRef: formData.githubOrJiraRef || 'github.com/mjpru-csit/live-industry-capstone',
        stipendOrBounty: formData.stipendOrBounty || '₹15,000/month per student',
        deliverables: deliverablesList.length > 0 ? deliverablesList : [
          'High-throughput microservices architecture implementation',
          'Automated CI/CD deployment pipeline and integration tests',
          'Production telemetry dashboard and client handover documentation'
        ],
        keyMilestones: [
          { id: 'lm1', title: 'Architecture Review & Baseline Prototype', dueDate: formData.startDate || '2026-08-30', completed: true },
          { id: 'lm2', title: 'Core Feature Implementation & Staging Deployment', dueDate: '2026-10-15', completed: false },
          { id: 'lm3', title: 'Production Load Testing & Client Handover', dueDate: formData.endDate || '2026-11-30', completed: false }
        ],
        industrySupervisor: formData.industrySupervisor
      };
      syncProjects([newProject, ...projects]);
      onShowToast(`Registered live industry project: "${newProject.title}" (${newProject.clientCompany})`, 'success');
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
    onShowToast(`Removed live project: "${deletingProject.title}"`, 'info');
    setDeletingProject(null);
  };

  // Toggle milestone
  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId && p.keyMilestones) {
        const newMilestones = p.keyMilestones.map(m => {
          if (m.id === milestoneId) {
            const next = !m.completed;
            onShowToast(
              next ? `Milestone "${m.title}" marked as Complete!` : `Milestone marked as Pending`,
              'success'
            );
            return { ...m, completed: next };
          }
          return m;
        });

        const allDone = newMilestones.every(m => m.completed);
        return {
          ...p,
          keyMilestones: newMilestones,
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
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Industry Projects & Student Capstones</span>
            </div>
            <h2 className="text-2xl font-black text-white">Real-World Enterprise Software Engagements</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Faculty-mentored undergraduate and postgraduate student squads solving live production engineering challenges with Siemens, Cisco, HDFC, and Mahindra.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0284C7] hover:from-[#22D3EE] hover:to-[#06B6D4] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/50 transition-all border border-cyan-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Live Project</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Capstones</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.activeCount}</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Live sprints running</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Students Enrolled</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">{stats.totalStudents}</div>
            <div className="text-[10px] text-cyan-400/80 mt-0.5">Mentored by CSIT faculty</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed Projects</span>
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300">{stats.completedCount}</div>
            <div className="text-[10px] text-indigo-300/80 mt-0.5">Delivered to corporate partners</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Industry Clients</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.corporatePartners}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Siemens, Cisco, HDFC...</div>
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
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search, Domain & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search project, company, tech..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <select
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400 max-w-[150px]"
          >
            <option value="All">All Domains</option>
            {uniqueDomains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="date-desc">Newest Projects</option>
            <option value="team-desc">Largest Team Size</option>
            <option value="title">Project Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Projects Cards Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <Layers className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Live Industry Projects Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your filters or register a new live student capstone project.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setDomainFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-cyan-300 font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map(project => {
            const completedMilestones = project.keyMilestones?.filter(m => m.completed).length || 0;
            const totalMilestones = project.keyMilestones?.length || 0;
            const milestonePercentage = totalMilestones > 0 
              ? Math.round((completedMilestones / totalMilestones) * 100) 
              : 0;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#1E4E7A] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-cyan-950/20"
              >
                <div>
                  {/* Company Badge & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/60 text-cyan-300 border border-cyan-700/50 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-cyan-400" />
                        <span>{project.clientCompany}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
                        {project.domain}
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

                      {/* Quick Actions */}
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
                  <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Tech Stack Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#090E2C] border border-[#1E2964] text-[10px] font-mono font-bold text-cyan-300">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Mentorship & Team Banner */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Faculty Mentor
                      </div>
                      <div className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{project.facultyMentor}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Squad Size
                      </div>
                      <div className="text-xs font-bold text-cyan-300 flex items-center justify-end gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{project.teamSizeFormatted || `${project.teamSize} Students`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Team Teaser & Duration */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    {project.studentTeam && project.studentTeam.length > 0 && (
                      <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                        <span className="text-slate-400 font-semibold">Student Squad:</span>
                        <span className="truncate text-slate-200">
                          {project.studentTeam.map(s => s.name).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        <span className="truncate">{project.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <GitBranch className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{project.githubOrJiraRef || 'github.com/mjpru-csit'}</span>
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
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          Sprint Milestone Progress
                        </span>
                        <span className="font-bold text-slate-200">
                          {completedMilestones} of {totalMilestones} Completed ({milestonePercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#141C48] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
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
                      className="text-xs text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>View Squad & Sprints</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Exported Live Capstone Evaluation Report for "${project.title}" (${project.clientCompany})`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Sprint Dossier</span>
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-900/50 text-cyan-300 border border-cyan-700/50">
                  {selectedProject.clientCompany}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                  {selectedProject.domain}
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
              <p className="text-xs text-cyan-300 font-semibold mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Industry Partner: {selectedProject.clientCompany}</span>
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Squad</span>
                <span className="font-bold text-cyan-300 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" />
                  {selectedProject.teamSizeFormatted || `${selectedProject.teamSize} Students`}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedProject.duration}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stipend / Incentive</span>
                <span className="font-bold text-emerald-300 mt-0.5 block truncate">
                  {selectedProject.stipendOrBounty || 'Funded by Partner'}
                </span>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block mb-1.5">
                Engineering Stack & Architecture
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#141C48] border border-[#233175] text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Mentors & Industry Supervisor */}
            <div className="p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] space-y-2">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                Mentorship & Industry Advisory
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
                    FM
                  </div>
                  <div>
                    <div className="font-bold text-white">{selectedProject.facultyMentor}</div>
                    <div className="text-[10px] text-slate-400">Head of Department · CSIT</div>
                  </div>
                </div>

                {selectedProject.industrySupervisor && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500 flex items-center justify-center text-emerald-300 font-bold text-xs shrink-0">
                      IS
                    </div>
                    <div>
                      <div className="font-bold text-white">{selectedProject.industrySupervisor.name}</div>
                      <div className="text-[10px] text-slate-400">{selectedProject.industrySupervisor.designation}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Student Roster */}
            {selectedProject.studentTeam && selectedProject.studentTeam.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Assigned Student Engineers ({selectedProject.studentTeam.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.studentTeam.map((member, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#090E2C] border border-[#1E2964] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{member.name}</div>
                        <div className="text-[10px] text-slate-400">Roll: {member.rollNo} · {member.program || 'B.Tech CSE'}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#141C48] text-cyan-300 text-[10px] font-bold border border-[#233175]">
                        {member.role || 'Developer'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Problem Statement & Scope</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>
            </div>

            {/* Milestones Tracker */}
            {selectedProject.keyMilestones && selectedProject.keyMilestones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Sprint Milestones & Client Signoffs
                  </h4>
                  <span className="text-[10px] text-slate-400 italic">Click checkbox to update sprint status</span>
                </div>
                <div className="space-y-2">
                  {selectedProject.keyMilestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(selectedProject.id, m.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        m.completed
                          ? 'bg-cyan-950/30 border-cyan-600/50 hover:bg-cyan-950/40'
                          : 'bg-[#090E2C] border-[#1E2964] hover:border-[#2B3B8A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.completed ? (
                          <CheckSquare className="w-5 h-5 text-cyan-400 shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <div className={`text-xs font-bold ${m.completed ? 'text-cyan-200 line-through' : 'text-white'}`}>
                            {m.title}
                          </div>
                          <div className="text-[10px] text-slate-400">Due Date: {m.dueDate}</div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.completed ? 'bg-emerald-900/60 text-emerald-300' : 'bg-[#141C48] text-slate-400'
                      }`}>
                        {m.completed ? 'Approved' : 'In Sprint'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <button
                onClick={() => {
                  onShowToast(`Exported Student Capstone Certificate & Evaluation Sheet for ${selectedProject.clientCompany}`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Evaluation Sheet</span>
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
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-black text-white">
                  {editingProject ? 'Edit Live Industry Project' : 'Register New Live Industry Project'}
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
                  placeholder="e.g. Real-Time Telemetry & Predictive Anomaly Engine"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Client Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siemens Industrial India Ltd."
                    value={formData.clientCompany}
                    onChange={e => setFormData({ ...formData, clientCompany: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Technical Domain</label>
                  <input
                    type="text"
                    placeholder="e.g. Industrial IoT & Predictive Maintenance"
                    value={formData.domain}
                    onChange={e => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Faculty Mentor</label>
                  <input
                    type="text"
                    value={formData.facultyMentor}
                    onChange={e => setFormData({ ...formData, facultyMentor: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Project Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Active/Ongoing">Active/Ongoing</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposal Stage">Proposal Stage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Duration & Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 4 Months (Aug–Nov 2026)"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Tech Stack (Comma-separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="Python, Apache Kafka, TimescaleDB, Docker, React, FastAPI"
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Assigned Student Squad (Comma-separated with Roll No)</label>
                <input
                  type="text"
                  placeholder="Aarav Sharma (230104011), Pooja Verma (230104056), Tanmay Saxena (230104078)"
                  value={studentsInput}
                  onChange={e => setStudentsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">GitHub / Jira Repository Link</label>
                  <input
                    type="text"
                    placeholder="github.com/mjpru-csit/project-repo"
                    value={formData.githubOrJiraRef}
                    onChange={e => setFormData({ ...formData, githubOrJiraRef: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Stipend / Incentive</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹15,000/month per student + PPI"
                    value={formData.stipendOrBounty}
                    onChange={e => setFormData({ ...formData, stipendOrBounty: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Project Description & Objectives</label>
                <textarea
                  rows={3}
                  placeholder="Problem description, technical challenges, enterprise expectations, and student learning outcomes..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-cyan-400"
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0284C7] hover:from-[#22D3EE] hover:to-[#06B6D4] text-white font-bold shadow-lg"
                >
                  {editingProject ? 'Update Live Project' : 'Register Live Project'}
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
              <h3 className="text-base font-bold text-white">Delete Live Project?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deletingProject.title}"</strong> for {deletingProject.clientCompany}? This will unassign the student squad and remove sprint records.
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
