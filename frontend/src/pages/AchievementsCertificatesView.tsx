import React, { useState, useMemo } from 'react';
import {
  Award,
  ShieldCheck,
  Download,
  Filter,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  FileCheck,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  UploadCloud,
  FileText,
  BadgeCheck,
  Layers,
  Star
} from 'lucide-react';
import { FacultyAchievementCertificate, AchievementCategory } from '../types';
import {
  getStoredFacultyAchievements,
  saveStoredFacultyAchievements
} from '../data/facultyCollaborationData';

interface AchievementsCertificatesViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AchievementsCertificatesView: React.FC<AchievementsCertificatesViewProps> = ({
  onShowToast = () => {}
}) => {
  const [achievements, setAchievements] = useState<FacultyAchievementCertificate[]>(getStoredFacultyAchievements);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');

  // Modals
  const [selectedItem, setSelectedItem] = useState<FacultyAchievementCertificate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FacultyAchievementCertificate | null>(null);
  const [deletingItem, setDeletingItem] = useState<FacultyAchievementCertificate | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<FacultyAchievementCertificate>>({
    title: '',
    issuingBody: '',
    category: 'Award',
    dateReceived: '2026-06-15',
    credentialId: '',
    downloadUrl: '',
    isPendingUpload: false,
    description: '',
    verificationBadge: 'Verified Academic Credential',
    citationOrScore: ''
  });
  const [skillsInput, setSkillsInput] = useState('');

  const syncAchievements = (updated: FacultyAchievementCertificate[]) => {
    setAchievements(updated);
    saveStoredFacultyAchievements(updated);
  };

  const categories: AchievementCategory[] = [
    'Award',
    'Certification',
    'FDP Contribution',
    'Research Excellence'
  ];

  // Filter & Sort
  const filteredItems = useMemo(() => {
    return achievements
      .filter(item => {
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
          item.title.toLowerCase().includes(q) ||
          item.issuingBody.toLowerCase().includes(q) ||
          (item.credentialId && item.credentialId.toLowerCase().includes(q)) ||
          item.skillsOrDomain.some(s => s.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime();
        if (sortBy === 'date-asc') return new Date(a.dateReceived).getTime() - new Date(b.dateReceived).getTime();
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [achievements, categoryFilter, searchQuery, sortBy]);

  // Aggregate stats
  const stats = useMemo(() => {
    const total = achievements.length;
    const awards = achievements.filter(a => a.category === 'Award').length;
    const certifications = achievements.filter(a => a.category === 'Certification').length;
    const fdp = achievements.filter(a => a.category === 'FDP Contribution').length;
    const research = achievements.filter(a => a.category === 'Research Excellence').length;

    return { total, awards, certifications, fdp, research };
  }, [achievements]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      issuingBody: '',
      category: 'Award',
      dateReceived: new Date().toISOString().split('T')[0],
      credentialId: `CRED-MJPRU-${Date.now().toString().slice(-4)}`,
      downloadUrl: 'portal.mjpru.ac.in/certs/verified-doc.pdf',
      isPendingUpload: false,
      description: '',
      verificationBadge: 'Verified by University Academic Council',
      citationOrScore: ''
    });
    setSkillsInput('Artificial Intelligence, Academic Excellence');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: FacultyAchievementCertificate, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormData({ ...item });
    setSkillsInput(item.skillsOrDomain ? item.skillsOrDomain.join(', ') : '');
    setIsAddModalOpen(true);
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.issuingBody?.trim()) {
      onShowToast('Please specify the Certificate/Award Title and Issuing Organization.', 'error');
      return;
    }

    const skillsList = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingItem) {
      const updated = achievements.map(item => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            ...formData,
            skillsOrDomain: skillsList.length > 0 ? skillsList : item.skillsOrDomain
          } as FacultyAchievementCertificate;
        }
        return item;
      });
      syncAchievements(updated);
      onShowToast(`Updated credential: "${formData.title}"`, 'success');
    } else {
      const newItem: FacultyAchievementCertificate = {
        id: `achieve-${Date.now()}`,
        title: formData.title || 'Untitled Achievement',
        issuingBody: formData.issuingBody || 'Accreditation Body',
        category: (formData.category as AchievementCategory) || 'Award',
        dateReceived: formData.dateReceived || new Date().toISOString().split('T')[0],
        credentialId: formData.credentialId || `CERT-${Date.now().toString().slice(-5)}`,
        downloadUrl: formData.isPendingUpload ? undefined : (formData.downloadUrl || 'portal.mjpru.ac.in/certs/cert.pdf'),
        isPendingUpload: formData.isPendingUpload || false,
        description: formData.description || 'Recognized faculty accomplishment in academic leadership and technical domain expertise.',
        skillsOrDomain: skillsList.length > 0 ? skillsList : ['Academic Leadership'],
        verificationBadge: formData.verificationBadge || 'Verified Academic Credential',
        citationOrScore: formData.citationOrScore || undefined
      };
      syncAchievements([newItem, ...achievements]);
      onShowToast(`Added new credential: "${newItem.title}"`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  // Delete Action
  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    const updated = achievements.filter(a => a.id !== deletingItem.id);
    syncAchievements(updated);
    if (selectedItem?.id === deletingItem.id) {
      setSelectedItem(null);
    }
    onShowToast(`Deleted: "${deletingItem.title}"`, 'info');
    setDeletingItem(null);
  };

  // Upload placeholder fulfiller
  const handleUploadCertificate = (item: FacultyAchievementCertificate, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = achievements.map(a => {
      if (a.id === item.id) {
        return {
          ...a,
          isPendingUpload: false,
          downloadUrl: `portal.mjpru.ac.in/certs/${item.id}-verified.pdf`,
          verificationBadge: 'Verified & Digitally Stamped'
        };
      }
      return a;
    });
    syncAchievements(updated);
    onShowToast(`Digitally minted and attached certificate for "${item.title}"!`, 'success');
  };

  // Category Badge Helper
  const getCategoryBadge = (cat: AchievementCategory) => {
    switch (cat) {
      case 'Award':
        return {
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: Award,
          color: 'text-amber-400'
        };
      case 'Certification':
        return {
          badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
          icon: ShieldCheck,
          color: 'text-cyan-400'
        };
      case 'FDP Contribution':
        return {
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: Star,
          color: 'text-purple-400'
        };
      case 'Research Excellence':
        return {
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: FileCheck,
          color: 'text-emerald-400'
        };
      default:
        return {
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          icon: Award,
          color: 'text-indigo-400'
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
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Activity · Verified Academic Honors & Credentials</span>
            </div>
            <h2 className="text-2xl font-black text-white">Achievements & Certificates</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Digitally verified faculty awards, professional cloud certifications, ATAL FDP pedagogical honors, and IEEE research citations for NAAC / NIRF audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Credential / Award</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">National Awards</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300">{stats.awards}</div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">ISTE & AICTE Honors</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Industry Certs</span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-cyan-300">{stats.certifications}</div>
            <div className="text-[10px] text-cyan-300/80 mt-0.5">AWS & NVIDIA DLI</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">FDP Leadership</span>
              <Star className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">{stats.fdp}</div>
            <div className="text-[10px] text-purple-300/80 mt-0.5">Course Director Roles</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Research Citations</span>
              <FileCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-300">{stats.research}</div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">IEEE Outstanding Reviewer</div>
          </div>
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="p-4 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                  : 'bg-[#141C48]/60 text-slate-300 hover:bg-[#1A255C] hover:text-white border border-[#233175]'
              }`}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, issuing body, skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-[#090E2C] border border-[#233175] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
          >
            <option value="date-desc">Newest Received</option>
            <option value="date-asc">Oldest Received</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid Layout of Achievements */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-3">
          <Award className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Credentials Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No achievement records match your selected filter criteria. Upload a new certificate to verify it on your institutional profile.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#1C2760] hover:bg-[#253480] text-xs text-indigo-300 font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const catInfo = getCategoryBadge(item.category);
            const CatIcon = catInfo.icon;
            const hasDownload = Boolean(item.downloadUrl && !item.isPendingUpload);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#37459C] transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-indigo-950/20"
              >
                <div>
                  {/* Top Bar: Category Badge & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${catInfo.badge}`}>
                      <CatIcon className="w-3 h-3" />
                      <span>{item.category}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleOpenEditModal(item, e)}
                        title="Edit Record"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-[#202D72] text-slate-300 hover:text-white border border-[#253578] transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingItem(item);
                        }}
                        title="Delete Record"
                        className="p-1.5 rounded-lg bg-[#141C48] hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-[#253578] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Issuing Organization & Date */}
                  <div className="mt-2.5 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{item.issuingBody}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>Issued: {item.dateReceived}</span>
                      </span>

                      {item.credentialId && (
                        <span className="font-mono text-[10px] text-indigo-300">
                          {item.credentialId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Skills / Domain Chips */}
                  {item.skillsOrDomain && item.skillsOrDomain.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.skillsOrDomain.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#090E2C] border border-[#1E2964] text-[10px] font-medium text-cyan-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {item.skillsOrDomain.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#090E2C] text-[10px] text-slate-400">
                          +{item.skillsOrDomain.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Action / Download */}
                <div className="mt-4 pt-3 border-t border-[#1C2760] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <BadgeCheck className={`w-3.5 h-3.5 ${item.isPendingUpload ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <span className="truncate max-w-[130px]">
                      {item.isPendingUpload ? 'Pending Upload' : 'Verified'}
                    </span>
                  </div>

                  {hasDownload ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowToast(`Downloading Certificate for "${item.title}" (Ref: ${item.credentialId})`, 'success');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  ) : item.isPendingUpload ? (
                    <button
                      onClick={(e) => handleUploadCertificate(item, e)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload Doc</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">No Doc Attached</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white hover:bg-[#1E2964]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryBadge(selectedItem.category).badge}`}>
                  {selectedItem.category}
                </span>
                {selectedItem.credentialId && (
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedItem.credentialId}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-black text-white leading-tight pr-6">
                {selectedItem.title}
              </h2>
            </div>

            {/* Overview Box */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#090E2C] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issuing Authority</span>
                <span className="font-bold text-white mt-0.5 block">{selectedItem.issuingBody}</span>
                {selectedItem.citationOrScore && (
                  <span className="text-amber-400 text-[11px] block mt-0.5 font-bold">
                    {selectedItem.citationOrScore}
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date Conferred</span>
                <span className="font-bold text-indigo-300 mt-0.5 block">{selectedItem.dateReceived}</span>
                <span className="text-emerald-400 text-[10px] block mt-0.5">{selectedItem.verificationBadge}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-xl bg-[#141C48]/60 border border-[#233175] space-y-1 text-xs">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                Accomplishment Overview & Citation
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {/* Competency & Skill Tags */}
            {selectedItem.skillsOrDomain && selectedItem.skillsOrDomain.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Endorsed Technical & Pedagogical Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.skillsOrDomain.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#090E2C] border border-[#233175] text-xs font-semibold text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1E2964]">
              {selectedItem.downloadUrl && !selectedItem.isPendingUpload ? (
                <button
                  onClick={() => {
                    onShowToast(`Downloading Certificate for "${selectedItem.title}"`, 'success');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Certificate (PDF)</span>
                </button>
              ) : selectedItem.isPendingUpload ? (
                <button
                  onClick={(e) => {
                    handleUploadCertificate(selectedItem, e);
                    setSelectedItem({
                      ...selectedItem,
                      isPendingUpload: false,
                      downloadUrl: `portal.mjpru.ac.in/certs/${selectedItem.id}-verified.pdf`
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload & Mint Certificate Document</span>
                </button>
              ) : null}

              <button
                onClick={() => setSelectedItem(null)}
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
            className="w-full max-w-xl bg-[#0E1538] border border-[#2B3B8A] rounded-2xl p-6 space-y-5 my-auto text-white shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2964]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-black text-white">
                  {editingItem ? 'Edit Credential Record' : 'Add Achievement / Certificate'}
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
                <label className="font-bold text-slate-300 block mb-1">Title of Honor / Certificate *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect – Professional (SAP-C02)"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Date Received / Conferred *</label>
                  <input
                    type="date"
                    required
                    value={formData.dateReceived}
                    onChange={e => setFormData({ ...formData, dateReceived: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Issuing Body / Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services / IEEE Computer Society / ISTE"
                    value={formData.issuingBody}
                    onChange={e => setFormData({ ...formData, issuingBody: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Credential ID / License Number</label>
                  <input
                    type="text"
                    placeholder="e.g. AWS-PSA-990421-2026"
                    value={formData.credentialId}
                    onChange={e => setFormData({ ...formData, credentialId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Skills & Domain Focus (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Cloud, Deep Learning, Zero-Knowledge Proofs"
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Accomplishment Description</label>
                <textarea
                  rows={2}
                  placeholder="Details of recognition, score percentile, or pedagogical leadership impact..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090E2C] border border-[#233175] rounded-xl text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#090E2C] border border-[#233175] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Pending Document Upload</div>
                  <div className="text-[10px] text-slate-400">Enable if the physical certificate scan will be uploaded later</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPendingUpload}
                  onChange={e => setFormData({ ...formData, isPendingUpload: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-[#141C48] border-slate-600 cursor-pointer"
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
                  {editingItem ? 'Update Credential' : 'Save Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeletingItem(null)}
        >
          <div
            className="w-full max-w-md bg-[#0E1538] border border-rose-600/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Credential Record?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{deletingItem.title}"</strong> ({deletingItem.issuingBody})?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
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
