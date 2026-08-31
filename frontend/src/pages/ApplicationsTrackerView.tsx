import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { ApplicationItem, ApplicationStatus } from '../types';
import { getApplications, withdrawApplication } from '../services/studentCareerService';

interface ApplicationsTrackerViewProps {
  onNavigateTab: (tab: string) => void;
}

export const ApplicationsTrackerView: React.FC<ApplicationsTrackerViewProps> = ({
  onNavigateTab
}) => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    setApplications(getApplications());
  }, []);

  const handleWithdraw = (appId: string) => {
    if (window.confirm('Are you sure you wish to withdraw this application? This action cannot be reversed.')) {
      withdrawApplication(appId);
      setApplications(getApplications());
    }
  };

  const filteredApps = applications.filter(app => {
    if (filterType !== 'all' && app.opportunityType !== filterType) return false;
    if (filterStatus !== 'all' && app.status !== filterStatus) return false;
    return true;
  });

  const countApplied = applications.length;
  const countShortlisted = applications.filter(a => a.status === 'Shortlisted').length;
  const countUnderReview = applications.filter(a => a.status === 'Under Review').length;
  const countInterview = applications.filter(a => a.status === 'Interview').length;

  const STATUS_STEPS: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

  const getStepIndex = (status: ApplicationStatus) => {
    if (status === 'Withdrawn' || status === 'Rejected') return -1;
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div id="application-tracker-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-[#8B7CF8] text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5" />
            REAL-TIME HIRING LEDGER
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            My Applications & Placement Tracker
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Monitor the live status, recruiter feedback, and stage-by-stage progression of your active campus placement applications, corporate internships, and micro-gigs.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5">
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Total Submitted</span>
            <span className="text-xl font-bold text-white">{countApplied}</span>
          </div>
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Under Review</span>
            <span className="text-xl font-bold text-cyan-400">{countUnderReview}</span>
          </div>
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Shortlisted</span>
            <span className="text-xl font-bold text-[#8B7CF8]">{countShortlisted}</span>
          </div>
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Interviews</span>
            <span className="text-xl font-bold text-emerald-400">{countInterview}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'Internship', 'Job', 'Micro-Gig'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterType === type
                  ? 'bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] text-white shadow-md'
                  : 'bg-[#12162E] border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Applications' : `${type}s`}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateTab('jobs')}
          className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
        >
          Explore More Opportunities
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.map(app => {
          const currentStepIdx = getStepIndex(app.status);
          const isWithdrawn = app.status === 'Withdrawn';
          const isSelected = app.status === 'Selected';

          return (
            <div
              key={app.id}
              className="bg-[#12162E] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#7C5CFC]/30 transition-all space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B0F2A] border border-white/10 flex items-center justify-center font-bold text-sm text-[#8B7CF8] shrink-0">
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {app.opportunityTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/60 mt-0.5">
                      <span>{app.company}</span>
                      <span>•</span>
                      <span>{app.location}</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-semibold">{app.stipendOrSalary}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : isWithdrawn
                        ? 'bg-white/5 text-white/40 border border-white/10'
                        : app.status === 'Shortlisted'
                          ? 'bg-[#7C5CFC]/20 text-[#8B7CF8] border border-[#7C5CFC]/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {app.status}
                  </span>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {app.matchScore}% Match
                  </span>
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              {!isWithdrawn && (
                <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-4">
                  <span className="text-[11px] text-white/40 font-medium block mb-3">
                    Application Hiring Progress:
                  </span>
                  
                  <div className="grid grid-cols-5 gap-2 relative">
                    {STATUS_STEPS.map((step, idx) => {
                      const isPast = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;

                      return (
                        <div key={step} className="text-center space-y-1.5 relative">
                          <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isPast 
                              ? 'bg-[#7C5CFC] text-white ring-2 ring-[#00D9FF]/40' 
                              : 'bg-white/5 text-white/40 border border-white/10'
                          }`}>
                            {isPast ? <Check className="w-3 h-3" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] sm:text-xs block font-medium ${
                            isCurrent ? 'text-cyan-300 font-bold' : isPast ? 'text-white/80' : 'text-white/30'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes / Last update */}
              {app.notes && (
                <div className="bg-[#1A1F3D]/50 border border-white/5 rounded-xl p-3 text-xs text-white/70 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B7CF8] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white/40 text-[10px] block">Latest Recruiter Update:</span>
                    {app.notes}
                  </div>
                </div>
              )}

              {/* Footer row */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-white/40">
                <span>Applied: {app.appliedDate} • Updated: {app.lastUpdated}</span>

                {!isWithdrawn && !isSelected && (
                  <button
                    onClick={() => handleWithdraw(app.id)}
                    className="text-red-400/70 hover:text-red-400 font-medium transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredApps.length === 0 && (
          <div className="bg-[#12162E] border border-white/10 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No applications found in this category</h3>
            <p className="text-xs text-white/50 mb-4">Start applying to recommended opportunities to track your status here.</p>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] text-white font-semibold text-xs"
            >
              Browse Jobs & Placements
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
