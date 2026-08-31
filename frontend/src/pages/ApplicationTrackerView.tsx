import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Building2, 
  MapPin, 
  ChevronRight, 
  ExternalLink,
  Trash2, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { ApplicationItem } from '../types';
import { INITIAL_APPLICATIONS } from '../data/portalData';

interface ApplicationTrackerViewProps {
  applications?: ApplicationItem[];
  onNavigateToJobs?: () => void;
  onWithdrawApplication?: (appId: string) => void;
}

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications: propApps,
  onNavigateToJobs,
  onWithdrawApplication
}) => {
  const [apps, setApps] = useState<ApplicationItem[]>(propApps || INITIAL_APPLICATIONS);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'interview' | 'offer'>('all');
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(apps[0] || null);
  const [newNote, setNewNote] = useState('');

  const filteredApps = apps.filter(a => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return ['Applied', 'Under Review', 'Shortlisted'].includes(a.status);
    if (statusFilter === 'interview') return a.status === 'Interview Scheduled';
    if (statusFilter === 'offer') return a.status === 'Selected';
    return true;
  });

  const handleAddNote = (appId: string) => {
    if (!newNote.trim()) return;
    setApps(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          notes: a.notes ? `${a.notes}\n• ${newNote}` : `• ${newNote}`
        };
      }
      return a;
    }));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? {
        ...prev,
        notes: prev.notes ? `${prev.notes}\n• ${newNote}` : `• ${newNote}`
      } : null);
    }
    setNewNote('');
  };

  const handleWithdraw = (appId: string) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: 'Withdrawn' } : a));
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: 'Withdrawn' } : null);
      }
      if (onWithdrawApplication) {
        onWithdrawApplication(appId);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Interview Scheduled':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Shortlisted':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Under Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Withdrawn':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Placement & Internship Application Tracker</h1>
          </div>
          <p className="text-xs text-slate-300">
            Real-time status updates, round interview dates, recruiter feedback, and verified proof attachments.
          </p>
        </div>

        {onNavigateToJobs && (
          <button
            onClick={onNavigateToJobs}
            className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer self-start md:self-auto"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Browse More Jobs</span>
          </button>
        )}
      </div>

      {/* 2. Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'all' ? 'bg-[#7C5CFC] text-white' : 'bg-[#0B1033] text-slate-400 hover:text-white border border-[#1C265E]'
          }`}
        >
          All Applications ({apps.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'active' ? 'bg-[#7C5CFC] text-white' : 'bg-[#0B1033] text-slate-400 hover:text-white border border-[#1C265E]'
          }`}
        >
          In Review
        </button>
        <button
          onClick={() => setStatusFilter('interview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'interview' ? 'bg-[#7C5CFC] text-white' : 'bg-[#0B1033] text-slate-400 hover:text-white border border-[#1C265E]'
          }`}
        >
          Interview Scheduled
        </button>
        <button
          onClick={() => setStatusFilter('offer')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'offer' ? 'bg-[#7C5CFC] text-white' : 'bg-[#0B1033] text-slate-400 hover:text-white border border-[#1C265E]'
          }`}
        >
          Selected / Offers
        </button>
      </div>

      {/* 3. Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredApps.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#0B1033] border border-[#1C265E] text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400 font-medium">No applications found in this filter.</p>
              {onNavigateToJobs && (
                <button
                  onClick={onNavigateToJobs}
                  className="px-4 py-1.5 rounded-lg bg-[#7C5CFC] text-white text-xs font-bold cursor-pointer"
                >
                  Explore Openings
                </button>
              )}
            </div>
          ) : (
            filteredApps.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected 
                      ? 'bg-[#141C48] border-[#7C5CFC] shadow-lg' 
                      : 'bg-[#0B1033] border-[#1C265E] hover:border-slate-500'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 truncate">
                        {app.company}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-snug">{app.jobTitle}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {app.location} · {app.stipendOrSalary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5">
                    <span>Applied on {app.appliedDate}</span>
                    <span className="text-emerald-400 font-bold">{app.matchScore}% Match</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-7">
          {selectedApp ? (
            <div className="p-6 rounded-2xl bg-[#0B1033] border border-[#1E2B68] space-y-6 shadow-2xl animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#182352]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {selectedApp.company}
                  </span>
                  <h2 className="text-base font-black text-white">{selectedApp.jobTitle}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedApp.location} · {selectedApp.workMode} · Package: <strong className="text-emerald-400">{selectedApp.stipendOrSalary}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-lg border ${getStatusColor(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
              </div>

              {/* Status Timeline Workflow */}
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">
                  Application Progress Stage
                </h3>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E2B68]">
                  {selectedApp.timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#7C5CFC] border-2 border-[#0B1033] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white">{item.stage}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Proof & Attached Assets */}
              <div className="p-3.5 rounded-xl bg-[#0E1538] border border-[#1E2964] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Attached Verification Credentials
                </span>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Ladder DNA Passport (Attached)
                  </span>
                  <span className="text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20 font-semibold">
                    ATS Resume v4.2 (Score 92%)
                  </span>
                </div>
              </div>

              {/* Personal Notes / Candidate Log */}
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2">
                  Personal Preparation & Recruiter Notes
                </h3>
                {selectedApp.notes && (
                  <div className="p-3 rounded-xl bg-[#070B1E] border border-white/10 text-xs text-slate-300 leading-relaxed mb-3 whitespace-pre-line font-mono">
                    {selectedApp.notes}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add interview prep note (e.g. reviewed AWS indexing)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#7C5CFC]"
                  />
                  <button
                    onClick={() => handleAddNote(selectedApp.id)}
                    className="px-4 py-2 rounded-xl bg-[#141C48] hover:bg-[#1D296C] text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Add Note
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#182352]">
                {selectedApp.status !== 'Withdrawn' ? (
                  <button
                    onClick={() => handleWithdraw(selectedApp.id)}
                    className="px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Withdraw Application</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Application Withdrawn</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Interview preparation pack loaded for ${selectedApp.jobTitle}.`)}
                    className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow transition-all cursor-pointer"
                  >
                    View Interview Prep Pack
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-[#0B1033] border border-[#1C265E] text-center text-slate-400 text-xs">
              Select an application from the left to view full progress details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
