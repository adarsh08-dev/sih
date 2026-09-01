import React, { useState, useMemo } from 'react';
import {
  Handshake,
  Building2,
  GraduationCap,
  Landmark,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  X,
  ChevronRight,
  Download,
  Calendar,
  Layers,
  Sparkles,
  Mail,
  User,
  FileCheck2,
  Award
} from 'lucide-react';
import { FacultyMyCollaboration, PartnerType, CollaborationStatus } from '../types';
import {
  getStoredFacultyCollaborations,
  saveStoredFacultyCollaborations
} from '../data/facultyCollaborationData';

interface MyCollaborationsViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const MyCollaborationsView: React.FC<MyCollaborationsViewProps> = ({
  onShowToast = () => {}
}) => {
  const [collaborations, setCollaborations] = useState<FacultyMyCollaboration[]>(getStoredFacultyCollaborations);
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'duration' | 'title' | 'funding'>('duration');

  // Modals
  const [selectedCollab, setSelectedCollab] = useState<FacultyMyCollaboration | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<FacultyMyCollaboration | null>(null);
  const [deletingCollab, setDeletingCollab] = useState<FacultyMyCollaboration | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<FacultyMyCollaboration>>({
    title: '',
    partnerType: 'Industry',
    partnerName: '',
    partnerLogoOrInitials: '',
    facultyRole: 'Lead Principal Investigator',
    status: 'Ongoing',
    duration: '24 Months',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    mouOrSanctionRef: '',
    department: 'Computer Science & Information Technology',
    fundingValueFormatted: '₹25,00,000',
    leadCoordinator: 'Dr. Arvind K. Sharma (HOD)',
    description: '',
    keyDeliverables: [],
    contactPerson: {
      name: '',
      designation: '',
      email: ''
    }
  });

  const [deliverablesInput, setDeliverablesInput] = useState('');

  const syncCollaborations = (updated: FacultyMyCollaboration[]) => {
    setCollaborations(updated);
    saveStoredFacultyCollaborations(updated);
  };

  // Filter and Sort
  const filteredCollabs = useMemo(() => {
    return collaborations
      .filter(collab => {
        const matchesType = partnerTypeFilter === 'All' || collab.partnerType === partnerTypeFilter;
        const matchesStatus = statusFilter === 'All' || collab.status === statusFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
          collab.title.toLowerCase().includes(q) ||
          collab.partnerName.toLowerCase().includes(q) ||
          collab.facultyRole.toLowerCase().includes(q) ||
          collab.mouOrSanctionRef.toLowerCase().includes(q) ||
          collab.leadCoordinator.toLowerCase().includes(q);

        return matchesType && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [collaborations, partnerTypeFilter, statusFilter, searchQuery, sortBy]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = collaborations.length;
    const active = collaborations.filter(c => c.status === 'Ongoing').length;
    const completed = collaborations.filter(c => c.status === 'Completed').length;
    const academic = collaborations.filter(c => c.partnerType === 'Academic').length;
    const industry = collaborations.filter(c => c.partnerType === 'Industry').length;
    const government = collaborations.filter(c => c.partnerType === 'Government').length;

    return { total, active, completed, academic, industry, government };
  }, [collaborations]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingCollab(null);
    setFormData({
      title: '',
      partnerType: 'Industry',
      partnerName: '',
      partnerLogoOrInitials: '',
      facultyRole: 'Lead Principal Investigator',
      status: 'Ongoing',
      duration: '24 Months',
      startDate: '2026-01-01',
      endDate: '2027-12-31',
      mouOrSanctionRef: `MOU-MJPRU-${Date.now().toString().slice(-4)}`,
      department: 'Computer Science & Information Technology',
      fundingValueFormatted: '₹20,00,000',
      leadCoordinator: 'Dr. Arvind K. Sharma (HOD)',
      description: '',
      contactPerson: {
        name: '',
        designation: '',
        email: ''
      }
    });
    setDeliverablesInput('Joint R&D Lab Setup\nStudent Internship & Capstone Pipeline\nSCI Research Publications');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (collab: FacultyMyCollaboration, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCollab(collab);
    setFormData({ ...collab });
    setDeliverablesInput(collab.keyDeliverables ? collab.keyDeliverables.join('\n') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.partnerName?.trim()) {
      onShowToast('Please fill out the Collaboration Title and Partner Name.', 'error');
      return;
    }

    const deliverablesList = deliverablesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingCollab) {
      const updated = collaborations.map(c => {
        if (c.id === editingCollab.id) {
          return {
            ...c,
            ...formData,
            keyDeliverables: deliverablesList.length > 0 ? deliverablesList : c.keyDeliverables
          } as FacultyMyCollaboration;
        }
        return c;
      });
      syncCollaborations(updated);
      onShowToast(`Updated collaboration: "${formData.title}"`, 'success');
    } else {
      const newCollab: FacultyMyCollaboration = {
        id: `collab-${Date.now()}`,
        title: formData.title || 'Untitled Collaboration',
        partnerType: (formData.partnerType as PartnerType) || 'Industry',
        partnerName: formData.partnerName || 'Partner Entity',
        partnerLogoOrInitials: formData.partnerLogoOrInitials || formData.partnerName?.slice(0, 4).toUpperCase() || 'COL',
        facultyRole: formData.facultyRole || 'Lead Principal Investigator',
        status: (formData.status as CollaborationStatus) || 'Ongoing',
        duration: formData.duration || '24 Months',
        startDate: formData.startDate || '2026-01-01',
        endDate: formData.endDate || '2027-12-31',
        mouOrSanctionRef: formData.mouOrSanctionRef || `MOU-${Date.now().toString().slice(-5)}`,
        department: 'Computer Science & Information Technology',
        fundingValueFormatted: formData.fundingValueFormatted || 'Sponsored Project',
        leadCoordinator: formData.leadCoordinator || 'Dr. Arvind K. Sharma (HOD)',
        description: formData.description || 'Institutional research and knowledge transfer partnership.',
        keyDeliverables: deliverablesList.length > 0 ? deliverablesList : ['Academic R&D Milestone'],
        contactPerson: {
          name: formData.contactPerson?.name || 'Authorized Coordinator',
          designation: formData.contactPerson?.designation || 'Project Director',
          email: formData.contactPerson?.email || 'liaison@partner.org'
        },
        milestones: [
          { id: 'm1', title: 'MoU Formal Execution & Launch', dueDate: '2026-03-31', completed: true },
          { id: 'm2', title: 'Mid-term Milestone Handover', dueDate: '2026-11-30', completed: false }
        ]
      };
      syncCollaborations([newCollab, ...collaborations]);
      onShowToast(`Added collaboration with "${newCollab.partnerName}"`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingCollab(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingCollab) return;
    const updated = collaborations.filter(c => c.id !== deletingCollab.id);
    syncCollaborations(updated);
    if (selectedCollab?.id === deletingCollab.id) {
      setSelectedCollab(null);
    }
    onShowToast(`Deleted collaboration: "${deletingCollab.title}"`, 'info');
    setDeletingCollab(null);
  };

  // Partner icon helper
  const getPartnerIcon = (type: PartnerType) => {
    switch (type) {
      case 'Industry':
        return Building2;
      case 'Academic':
        return GraduationCap;
      case 'Government':
        return Landmark;
      default:
        return Handshake;
    }
  };

  const getPartnerBadgeStyle = (type: PartnerType) => {
    switch (type) {
      case 'Industry':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Academic':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Government':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Handshake className="w-3.5 h-3.5 text-indigo-400" />
              <span>Activity · Institutional & Multi-Party Collaborations</span>
            </div>
            <h2 className="text-2xl font-black text-white">My Academic & Industry Collaborations</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Manage joint bilateral research initiatives, industry CoE labs, consortium nodes, and governmental advisory linkages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Collaboration</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats & Active Collaboration Widget */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Partnerships</span>
              <Handshake className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active & Historic MoUs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#101D56] to-[#0A1238] border border-indigo-500/40 shadow-inner">
            <div className="flex items-center justify-between text-indigo-300 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Active Collaborations</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-white flex items-baseline gap-2">
              <span>{stats.active}</span>
              <span className="text-xs text-emerald-400 font-bold">Ongoing Nodes</span>
            </div>
            <div className="text-[10px] text-indigo-200/80 mt-0.5">Actively driving research & labs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Industry & CoEs</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-300">{stats.industry}</div>
            <div className="text-[10px] text-blue-300/80 mt-0.5">Siemens & Enterprise R&D</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Academic & Govt Nodes</span>
              <Landmark className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.academic + stats.government}</div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">AIIMS, TIFR, CSIR Institutes</div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Partner Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Industry', 'Academic', 'Government'].map(type => (
            <button
              key={type}
              onClick={() => setPartnerTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                partnerTypeFilter === type
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {type === 'All' ? 'All Partner Types' : type}
            </button>
          ))}
        </div>

        {/* Search, Status & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search partner, title, role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="All">All Statuses</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Proposal Stage">Proposal Stage</option>
          </select>
        </div>
      </div>

      {/* Collaborations Cards List */}
      {filteredCollabs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <Handshake className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Collaborations Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query or partner filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setPartnerTypeFilter('All');
              setStatusFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-indigo-300 font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCollabs.map(collab => {
            const PartnerIcon = getPartnerIcon(collab.partnerType);
            const isOngoing = collab.status === 'Ongoing';

            return (
              <div
                key={collab.id}
                onClick={() => setSelectedCollab(collab)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#37459C] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-indigo-950/20"
              >
                <div>
                  {/* Top Bar: Partner Type, Name & Status */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getPartnerBadgeStyle(collab.partnerType)}`}>
                        <PartnerIcon className="w-3 h-3" />
                        <span>{collab.partnerType} Partner</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {collab.mouOrSanctionRef}
                      </span>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide flex items-center gap-1.5 border ${
                        isOngoing
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`} />
                        <span>{collab.status}</span>
                      </span>

                      <button
                        onClick={(e) => handleOpenEditModal(collab, e)}
                        title="Edit Collaboration"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingCollab(collab);
                        }}
                        title="Delete Collaboration"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                    {collab.title}
                  </h3>

                  {/* Partner Organization & Faculty Role Block */}
                  <div className="mt-3 p-3 rounded-xl bg-[#090E2C]/90 border border-[#1E2964] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Partner Institution / Organization
                        </div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                          <PartnerIcon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{collab.partnerName}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Duration
                        </div>
                        <div className="text-xs font-bold text-indigo-300 mt-0.5">
                          {collab.duration}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1C2760] flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-slate-400 font-medium">Faculty Role: </span>
                        <span className="font-extrabold text-indigo-300">{collab.facultyRole}</span>
                      </div>
                      {collab.fundingValueFormatted && (
                        <span className="text-[11px] text-emerald-400 font-bold">
                          {collab.fundingValueFormatted}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description / Deliverables summary */}
                  <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {collab.description}
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCollab(collab);
                    }}
                    className="text-xs text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Deliverables & Milestones</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowToast(`Exported MoU & Collaboration Dossier for "${collab.partnerName}"`, 'success');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#141C48] hover:bg-[#1E2964] border border-[#2B3B8A] text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>MoU Dossier</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedCollab && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedCollab(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCollab(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPartnerBadgeStyle(selectedCollab.partnerType)}`}>
                  {selectedCollab.partnerType} Partner
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {selectedCollab.status}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  MoU Ref: {selectedCollab.mouOrSanctionRef}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedCollab.title}
              </h2>
            </div>

            {/* Overview Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partner Name</span>
                <span className="font-bold text-white mt-0.5 block">{selectedCollab.partnerName}</span>
                <span className="text-indigo-400 text-[11px] block mt-0.5 font-bold">
                  {selectedCollab.fundingValueFormatted}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Role</span>
                <span className="font-extrabold text-indigo-300 mt-0.5 block">{selectedCollab.facultyRole}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Lead: {selectedCollab.leadCoordinator}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration & Period</span>
                <span className="font-bold text-white mt-0.5 block">{selectedCollab.duration}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{selectedCollab.startDate} to {selectedCollab.endDate}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] space-y-1 text-xs">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Collaboration Scope & Research Thrust
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedCollab.description}
              </p>
            </div>

            {/* Key Deliverables */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-indigo-400" />
                <span>Institutional Deliverables & Outcomes</span>
              </h4>
              <ul className="space-y-1.5">
                {selectedCollab.keyDeliverables.map((del, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs text-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Milestones */}
            {selectedCollab.milestones && selectedCollab.milestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Project Milestones</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCollab.milestones.map((m, idx) => (
                    <div key={m.id || idx} className="p-2.5 rounded-xl bg-[#090E2C] border border-[#1E2964] flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{m.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Due: {m.dueDate}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {m.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partner Contact Person */}
            <div className="p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-950/70 border border-indigo-700/40 text-indigo-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">{selectedCollab.contactPerson.name}</div>
                  <div className="text-[10px] text-slate-400">{selectedCollab.contactPerson.designation}</div>
                </div>
              </div>
              <div className="text-right">
                <a
                  href={`mailto:${selectedCollab.contactPerson.email}`}
                  className="text-[11px] text-indigo-300 hover:text-indigo-200 font-bold flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  <span>{selectedCollab.contactPerson.email}</span>
                </a>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              <button
                onClick={() => {
                  onShowToast(`Exported Official MoU Agreement for "${selectedCollab.partnerName}"`, 'success');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export Agreement (PDF)</span>
              </button>

              <button
                onClick={() => setSelectedCollab(null)}
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
                <Handshake className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-black text-white">
                  {editingCollab ? 'Edit Collaboration Record' : 'Register New Collaboration'}
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
                <label className="font-bold text-slate-300 block mb-1">Collaboration Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siemens Industrial Automation & High-Frequency Telemetry Lab"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Partner Type *</label>
                  <select
                    value={formData.partnerType}
                    onChange={e => setFormData({ ...formData, partnerType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Industry">Industry</option>
                    <option value="Academic">Academic</option>
                    <option value="Government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Proposal Stage">Proposal Stage</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 24 Months (2025–2027)"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Partner Entity Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siemens Industrial India Ltd. / AIIMS New Delhi"
                    value={formData.partnerName}
                    onChange={e => setFormData({ ...formData, partnerName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Faculty Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Principal Investigator / Chief Consultant"
                    value={formData.facultyRole}
                    onChange={e => setFormData({ ...formData, facultyRole: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">MoU / Sanction Order Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. SIEMENS-IND-2025-089"
                    value={formData.mouOrSanctionRef}
                    onChange={e => setFormData({ ...formData, mouOrSanctionRef: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Funding Value / Equipment</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹25,00,000 + Lab Hardware"
                    value={formData.fundingValueFormatted}
                    onChange={e => setFormData({ ...formData, fundingValueFormatted: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Scope & Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview of collaboration research targets, institutional setup, and student pipelines..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Key Deliverables (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="Joint R&D Lab Setup&#10;Student Capstone Mentorship&#10;SCI Publications"
                  value={deliverablesInput}
                  onChange={e => setDeliverablesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. Sandeep Bhasin"
                    value={formData.contactPerson?.name}
                    onChange={e => setFormData({
                      ...formData,
                      contactPerson: { ...(formData.contactPerson || { name: '', designation: '', email: '' }), name: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Contact Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Director of Digitalization"
                    value={formData.contactPerson?.designation}
                    onChange={e => setFormData({
                      ...formData,
                      contactPerson: { ...(formData.contactPerson || { name: '', designation: '', email: '' }), designation: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. liaison@partner.org"
                    value={formData.contactPerson?.email}
                    onChange={e => setFormData({
                      ...formData,
                      contactPerson: { ...(formData.contactPerson || { name: '', designation: '', email: '' }), email: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
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
                  {editingCollab ? 'Update Collaboration' : 'Register Collaboration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingCollab && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingCollab(null)}
        >
          <div
            className="w-full max-w-md bg-[#0E1538] border border-rose-600/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Collaboration Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete the collaboration entry for <strong className="text-white">"{deletingCollab.title}"</strong> ({deletingCollab.partnerName})?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCollab(null)}
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
