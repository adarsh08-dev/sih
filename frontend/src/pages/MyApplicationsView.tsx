import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash2,
  X,
  ChevronRight,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Award,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { FacultyMyApplication, FacultyAppStatus, FacultyAppType } from '../types';
import {
  getStoredFacultyApplications,
  saveStoredFacultyApplications
} from '../data/facultyCollaborationData';

interface MyApplicationsViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const MyApplicationsView: React.FC<MyApplicationsViewProps> = ({
  onShowToast = () => {}
}) => {
  const [applications, setApplications] = useState<FacultyMyApplication[]>(getStoredFacultyApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');

  // Modals
  const [selectedApp, setSelectedApp] = useState<FacultyMyApplication | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<FacultyMyApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<FacultyMyApplication | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<FacultyMyApplication>>({
    title: '',
    applicationType: 'Research Grant',
    dateApplied: '2026-09-01',
    status: 'Under Review',
    hostOrGrantBody: '',
    sanctionAmountFormatted: '',
    reviewer: 'Academic Advisory Board',
    reviewerDesignation: 'Reviewer Panel',
    remarks: 'Application under formal committee evaluation.',
    duration: '24 Months',
    submissionRefNo: `MJPRU/APP/${Date.now().toString().slice(-4)}`,
    department: 'Computer Science & Information Technology',
    documentsAttached: []
  });

  const [docsInput, setDocsInput] = useState('');

  const syncApplications = (updated: FacultyMyApplication[]) => {
    setApplications(updated);
    saveStoredFacultyApplications(updated);
  };

  // Filter and Sort
  const filteredApps = useMemo(() => {
    return applications
      .filter(app => {
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        const matchesType = typeFilter === 'All' || app.applicationType === typeFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
          app.title.toLowerCase().includes(q) ||
          app.hostOrGrantBody.toLowerCase().includes(q) ||
          app.submissionRefNo.toLowerCase().includes(q) ||
          app.reviewer.toLowerCase().includes(q) ||
          app.applicationType.toLowerCase().includes(q);

        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
        if (sortBy === 'date-asc') return new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [applications, statusFilter, typeFilter, searchQuery, sortBy]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = applications.length;
    const underReview = applications.filter(a => a.status === 'Under Review').length;
    const approved = applications.filter(a => a.status === 'Approved').length;
    const rejected = applications.filter(a => a.status === 'Rejected').length;

    return { total, underReview, approved, rejected };
  }, [applications]);

  // Types list
  const uniqueTypes: FacultyAppType[] = [
    'Research Grant',
    'Industry Fellowship',
    'FDP Participation',
    'Consultancy Bid',
    'Faculty Exchange',
    'Lab Modernization'
  ];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingApp(null);
    setFormData({
      title: '',
      applicationType: 'Research Grant',
      dateApplied: new Date().toISOString().split('T')[0],
      status: 'Under Review',
      hostOrGrantBody: '',
      sanctionAmountFormatted: '₹25,00,000',
      reviewer: 'Expert Technical Review Committee',
      reviewerDesignation: 'Reviewer Panel, Ministry/Grant Body',
      remarks: 'Application submitted successfully and queued for preliminary screening.',
      duration: '24 Months',
      submissionRefNo: `MJPRU/APP/2026/${Math.floor(1000 + Math.random() * 9000)}`,
      department: 'Computer Science & Information Technology',
      documentsAttached: []
    });
    setDocsInput('Proposal_Dossier_2026.pdf\nInstitutional_Endorsement.pdf');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (app: FacultyMyApplication, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingApp(app);
    setFormData({ ...app });
    setDocsInput(app.documentsAttached ? app.documentsAttached.join('\n') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      onShowToast('Please specify the application title.', 'error');
      return;
    }
    if (!formData.hostOrGrantBody?.trim()) {
      onShowToast('Please specify the host organization or funding body.', 'error');
      return;
    }

    const docsList = docsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingApp) {
      const updated = applications.map(app => {
        if (app.id === editingApp.id) {
          return {
            ...app,
            ...formData,
            documentsAttached: docsList.length > 0 ? docsList : app.documentsAttached
          } as FacultyMyApplication;
        }
        return app;
      });
      syncApplications(updated);
      onShowToast(`Updated application: "${formData.title}"`, 'success');
    } else {
      const newApp: FacultyMyApplication = {
        id: `app-${Date.now()}`,
        title: formData.title || 'Untitled Application',
        applicationType: (formData.applicationType as FacultyAppType) || 'Research Grant',
        dateApplied: formData.dateApplied || new Date().toISOString().split('T')[0],
        status: (formData.status as FacultyAppStatus) || 'Under Review',
        hostOrGrantBody: formData.hostOrGrantBody || 'Grant Agency',
        sanctionAmountFormatted: formData.sanctionAmountFormatted || undefined,
        reviewer: formData.reviewer || 'Peer Review Board',
        reviewerDesignation: formData.reviewerDesignation || 'Panel Lead',
        remarks: formData.remarks || 'Dossier received and active under formal evaluation.',
        duration: formData.duration || '24 Months',
        submissionRefNo: formData.submissionRefNo || `APP-${Date.now().toString().slice(-5)}`,
        department: 'Computer Science & Information Technology',
        documentsAttached: docsList.length > 0 ? docsList : ['Proposal_Doc.pdf'],
        timeline: [
          {
            id: 't1',
            title: 'Application Dossier Submitted',
            date: formData.dateApplied || '2026-09-01',
            actor: 'Dr. Arvind K. Sharma (HOD)',
            status: 'Completed',
            notes: 'Successfully submitted with institutional NOC.'
          },
          {
            id: 't2',
            title: 'Committee Review & Evaluation',
            date: 'Pending Schedule',
            actor: formData.reviewer || 'Review Committee',
            status: formData.status === 'Approved' ? 'Completed' : formData.status === 'Rejected' ? 'Rejected' : 'Current',
            notes: formData.remarks || 'Review in progress.'
          }
        ]
      };
      syncApplications([newApp, ...applications]);
      onShowToast(`Submitted application: "${newApp.title}"`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingApp(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingApp) return;
    const updated = applications.filter(a => a.id !== deletingApp.id);
    syncApplications(updated);
    if (selectedApp?.id === deletingApp.id) {
      setSelectedApp(null);
    }
    onShowToast(`Deleted application: "${deletingApp.title}"`, 'info');
    setDeletingApp(null);
  };

  // Helper status color & icon
  const getStatusBadge = (status: FacultyAppStatus) => {
    switch (status) {
      case 'Approved':
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          icon: CheckCircle2
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400 animate-pulse',
          icon: Clock
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          icon: XCircle
        };
      default:
        return {
          bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400',
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Activity · Institutional & Grant Applications</span>
            </div>
            <h2 className="text-2xl font-black text-white">My Academic Applications</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Track sponsored research proposals, industry fellowships, faculty exchange applications, consultancy tenders, and lab modernization grants.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Application</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Submitted</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Proposals & Bids</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Under Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.underReview}</div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">Active Committee Review</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Approved / Sanctioned</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.approved}</div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">Awarded & Active</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Not Selected</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-300">{stats.rejected}</div>
            <div className="text-[10px] text-rose-300/80 mt-0.5">Cycle Resubmission Available</div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Under Review', 'Approved', 'Rejected'].map(status => (
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

        {/* Search, Type & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, agency, ref no..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400 max-w-[170px]"
          >
            <option value="All">All Application Types</option>
            {uniqueTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="date-desc">Newest Applied Date</option>
            <option value="date-asc">Oldest Applied Date</option>
            <option value="title">Application Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Applications Cards List */}
      {filteredApps.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <FileText className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or submit a new proposal to track its evaluation progress.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setTypeFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-indigo-300 font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredApps.map(app => {
            const badge = getStatusBadge(app.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#37459C] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-indigo-950/20"
              >
                <div>
                  {/* Top Bar: Type, Ref & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        <span>{app.applicationType}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Ref: {app.submissionRefNo}
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 border ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{app.status}</span>
                      </span>

                      <button
                        onClick={(e) => handleOpenEditModal(app, e)}
                        title="Edit Application"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingApp(app);
                        }}
                        title="Delete Application"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                    {app.title}
                  </h3>

                  {/* Organization & Grant Info */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Host / Grant Agency
                      </div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{app.hostOrGrantBody}</span>
                      </div>
                      {app.sanctionAmountFormatted && (
                        <div className="text-[11px] text-emerald-400 font-extrabold mt-0.5">
                          Grant / Value: {app.sanctionAmountFormatted}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Date Applied
                      </div>
                      <div className="text-xs font-bold text-indigo-300 mt-0.5">
                        {app.dateApplied}
                      </div>
                      {app.approvalDate && (
                        <div className="text-[10px] text-emerald-400 font-bold">
                          Approved: {app.approvalDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviewer & Remarks */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-start gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-200">Reviewer:</strong> {app.reviewer}
                        {app.reviewerDesignation && <span className="text-slate-400"> ({app.reviewerDesignation})</span>}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#141C48]/50 border border-[#1E2B68] text-[11px] text-slate-300 italic line-clamp-2">
                      "{app.remarks}"
                    </div>
                  </div>
                </div>

                {/* Bottom Timeline Trigger & Action */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApp(app);
                    }}
                    className="text-xs text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Application History & Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowToast(`Exported Official Proposal Dossier for "${app.title}" (Ref: ${app.submissionRefNo})`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL WITH FULL TIMELINE */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                  {selectedApp.applicationType}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(selectedApp.status).bg}`}>
                  {selectedApp.status}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Ref: {selectedApp.submissionRefNo}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedApp.title}
              </h2>
            </div>

            {/* Metadata Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grant / Host Body</span>
                <span className="font-bold text-white mt-0.5 block">{selectedApp.hostOrGrantBody}</span>
                {selectedApp.sanctionAmountFormatted && (
                  <span className="text-emerald-400 font-extrabold text-[11px] block mt-0.5">
                    {selectedApp.sanctionAmountFormatted}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applied Date</span>
                <span className="font-bold text-indigo-300 mt-0.5 block">{selectedApp.dateApplied}</span>
                {selectedApp.approvalDate && (
                  <span className="text-emerald-400 text-[10px] block mt-0.5">Approved on {selectedApp.approvalDate}</span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reviewer Panel</span>
                <span className="font-bold text-white mt-0.5 block truncate">{selectedApp.reviewer}</span>
                <span className="text-[10px] text-slate-400 block">{selectedApp.reviewerDesignation}</span>
              </div>
            </div>

            {/* Remarks Box */}
            <div className="p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] space-y-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Official Reviewer Remarks & Decisions
              </span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{selectedApp.remarks}"
              </p>
              {selectedApp.rejectionReason && (
                <div className="text-xs text-rose-300 font-bold mt-1">
                  Rejection Reason: {selectedApp.rejectionReason}
                </div>
              )}
            </div>

            {/* Application Timeline & Audit Trail */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Application Lifecycle & Evaluation Timeline</span>
              </h4>

              <div className="space-y-3 relative pl-4 border-l-2 border-indigo-900/60 ml-2">
                {selectedApp.timeline && selectedApp.timeline.map((step, idx) => {
                  const isCompleted = step.status === 'Completed';
                  const isCurrent = step.status === 'Current';
                  const isRejected = step.status === 'Rejected';

                  return (
                    <div key={step.id || idx} className="relative group">
                      {/* Timeline Node Icon */}
                      <div className={`absolute -left-[23px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-500 text-white ring-4 ring-[#0E1538]' :
                        isCurrent ? 'bg-amber-500 text-white ring-4 ring-[#0E1538] animate-pulse' :
                        isRejected ? 'bg-rose-500 text-white ring-4 ring-[#0E1538]' :
                        'bg-slate-700 text-slate-400 ring-4 ring-[#0E1538]'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-2.5 h-2.5" /> :
                         isRejected ? <XCircle className="w-2.5 h-2.5" /> :
                         <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>

                      <div className="p-3 rounded-xl bg-[#090E2C] border border-[#1E2964] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{step.title}</span>
                          <span className="text-[10px] text-slate-400">{step.date}</span>
                        </div>
                        <div className="text-[11px] text-indigo-300 font-medium">Actor: {step.actor}</div>
                        {step.notes && (
                          <div className="text-[11px] text-slate-300">{step.notes}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attached Documents */}
            {selectedApp.documentsAttached && selectedApp.documentsAttached.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Attached Dossiers & Verification Docs
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.documentsAttached.map((doc, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-[#141C48] border border-[#233175] text-xs text-slate-200 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <button
                onClick={() => {
                  onShowToast(`Exported Official Grant Sanction Dossier for "${selectedApp.title}"`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Dossier (PDF)</span>
              </button>

              <button
                onClick={() => setSelectedApp(null)}
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
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-black text-white">
                  {editingApp ? 'Edit Application Record' : 'Submit New Academic Application'}
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
                <label className="font-bold text-slate-300 block mb-1">Application Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DST-SERB High Performance Compute Cluster Modernization Grant"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Application Type *</label>
                  <select
                    value={formData.applicationType}
                    onChange={e => setFormData({ ...formData, applicationType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    {uniqueTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Shortlisted">Shortlisted</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Date Applied *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateApplied}
                    onChange={e => setFormData({ ...formData, dateApplied: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Host / Funding Agency *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DST-SERB, Microsoft Research, MeitY"
                    value={formData.hostOrGrantBody}
                    onChange={e => setFormData({ ...formData, hostOrGrantBody: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Sanction Value / Funding (INR)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹38,50,000"
                    value={formData.sanctionAmountFormatted}
                    onChange={e => setFormData({ ...formData, sanctionAmountFormatted: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Reviewer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. S. K. Bhattacharya (SERB Advisory Board)"
                    value={formData.reviewer}
                    onChange={e => setFormData({ ...formData, reviewer: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Submission Reference No.</label>
                  <input
                    type="text"
                    placeholder="e.g. SERB/FIST/2026/CSIT-084"
                    value={formData.submissionRefNo}
                    onChange={e => setFormData({ ...formData, submissionRefNo: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Reviewer Remarks / Feedback</label>
                <textarea
                  rows={2}
                  placeholder="Notes, committee feedback, approval terms or resubmission guidelines..."
                  value={formData.remarks}
                  onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Attached Documents (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Detailed_Project_Report.pdf&#10;Budget_Justification.pdf"
                  value={docsInput}
                  onChange={e => setDocsInput(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white font-bold shadow-lg"
                >
                  {editingApp ? 'Update Application' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingApp && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingApp(null)}
        >
          <div
            className="w-full max-w-md bg-[#0E1538] border border-rose-600/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Application Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete the record for <strong className="text-white">"{deletingApp.title}"</strong> (Ref: {deletingApp.submissionRefNo})? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingApp(null)}
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
