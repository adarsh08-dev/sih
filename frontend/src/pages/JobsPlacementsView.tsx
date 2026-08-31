import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Building2, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  Filter,
  X,
  Check,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobOpportunity, StudentProfile, ApplicationItem } from '../types';
import { 
  getOpportunities, 
  fetchLiveOpportunities,
  calculateOpportunityMatch, 
  applyToOpportunity, 
  getApplications 
} from '../services/studentCareerService';

interface JobsPlacementsViewProps {
  student: StudentProfile | null;
  onNavigateTab: (tab: string) => void;
  onApplicationCreated?: () => void;
}

export const JobsPlacementsView: React.FC<JobsPlacementsViewProps> = ({
  student,
  onNavigateTab,
  onApplicationCreated
}) => {
  const [opportunities, setOpportunities] = useState<JobOpportunity[]>(() => getOpportunities());
  const [applications, setApplications] = useState<ApplicationItem[]>(() => getApplications());
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const live = await fetchLiveOpportunities();
      if (live && live.length > 0) {
        setOpportunities(live);
      }
      setApplications(getApplications());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Full-Time' | 'Internship'>('all');
  const [filterWorkMode, setFilterWorkMode] = useState<'all' | 'Remote' | 'Hybrid' | 'On-site'>('all');
  
  // Selected job for detailed modal
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [justAppliedId, setJustAppliedId] = useState<string | null>(null);

  const filteredOpportunities = opportunities.filter(opp => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCompany = opp.company.toLowerCase().includes(q);
      const matchSkills = opp.requiredSkills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }

    // Type filter
    if (filterType !== 'all' && opp.opportunityType !== filterType) {
      return false;
    }

    // Work mode filter
    if (filterWorkMode !== 'all' && opp.workMode !== filterWorkMode) {
      return false;
    }

    return true;
  });

  const handleApply = (job: JobOpportunity) => {
    if (!student) return;

    applyToOpportunity(
      job, 
      student, 
      job.opportunityType === 'Full-Time' ? 'Job' : 'Internship'
    );
    
    setJustAppliedId(job.id);
    
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }

    if (onApplicationCreated) {
      onApplicationCreated();
    }
  };

  const isJobApplied = (jobId: string) => {
    return applications.some(a => a.opportunityId === jobId);
  };

  return (
    <div id="jobs-placements-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-[#8B7CF8] text-xs font-semibold mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            DIRECT CORPORATE HIRING PIPELINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Jobs & Campus Placements
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            Verified full-time software engineering roles and high-stipend corporate internships. SkillBridge’s deterministic match engine compares your live Skill DNA against required tech stacks so you apply where your odds are highest.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role title, company, or skill (e.g. React, Python, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F2A] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#7C5CFC]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Type selector */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#7C5CFC]"
            >
              <option value="all">All Role Types</option>
              <option value="Full-Time">Full-Time Jobs</option>
              <option value="Internship">Internships</option>
            </select>

            {/* Work Mode selector */}
            <select
              value={filterWorkMode}
              onChange={(e) => setFilterWorkMode(e.target.value as any)}
              className="bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#7C5CFC]"
            >
              <option value="all">All Work Modes</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <button
              onClick={() => onNavigateTab('applications')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
            >
              Track Applications ({applications.length})
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOpportunities.map(job => {
          const matchData = calculateOpportunityMatch(job.requiredSkills);
          const applied = isJobApplied(job.id);

          return (
            <div
              key={job.id}
              className="bg-[#12162E] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-[#7C5CFC]/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Company, Type, Match % */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B0F2A] border border-white/10 flex items-center justify-center font-bold text-sm text-[#8B7CF8] shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {job.title}
                      </h3>
                      <span className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-white/40" />
                        {job.company} • {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Match Percentage Pill */}
                  <div className="text-right shrink-0">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      matchData.matchPercentage >= 85
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : matchData.matchPercentage >= 70
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      {matchData.matchPercentage}% Match
                    </div>
                  </div>
                </div>

                {/* Tags Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/70 mb-4">
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {job.opportunityType}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 font-medium">
                    {job.workMode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    {job.stipendOrSalary}
                  </span>
                  {job.duration && (
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                      {job.duration}
                    </span>
                  )}
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                  {job.description}
                </p>

                {/* Required Skills breakdown */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] text-white/40 block font-medium">
                    Required Tech Stack & Match Analysis:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map(req => {
                      const isMatched = matchData.matchedSkills.includes(req);
                      return (
                        <span
                          key={req}
                          className={`text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1 border ${
                            isMatched
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {isMatched ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {req}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <span className="text-[11px] text-white/40 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Deadline: {job.applicationDeadline}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-all"
                  >
                    Details
                  </button>

                  {applied ? (
                    <span className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-xs inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied ✓
                    </span>
                  ) : (
                    <button
                      id={`apply-job-${job.id}`}
                      onClick={() => handleApply(job)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] hover:opacity-90 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1"
                    >
                      Apply Now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="bg-[#12162E] border border-white/10 rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-white/30 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No matching opportunities found</h3>
          <p className="text-xs text-white/50 mb-4">Try clearing your filters or changing search keywords.</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterType('all'); setFilterWorkMode('all'); }}
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* DETAILED JOB MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#12162E] border border-white/15 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-5 top-5 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-[#0B0F2A] border border-white/10 flex items-center justify-center font-bold text-lg text-[#8B7CF8]">
                  {selectedJob.company.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedJob.title}</h2>
                  <p className="text-xs text-white/60">{selectedJob.company} • {selectedJob.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs mt-3">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium">
                  {selectedJob.opportunityType}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 font-medium">
                  {selectedJob.workMode}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {selectedJob.stipendOrSalary}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60">
                  Openings: {selectedJob.openingsCount}
                </span>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-[#0B0F2A] border border-white/10 rounded-xl p-4">
              <span className="text-xs font-semibold text-[#8B7CF8] uppercase tracking-wider block mb-1">
                Candidate Eligibility
              </span>
              <p className="text-xs text-white/80">{selectedJob.eligibility}</p>
            </div>

            {/* Description & Responsibilities */}
            <div className="space-y-3 text-xs text-white/80 leading-relaxed">
              <h4 className="text-sm font-bold text-white">About the Opportunity</h4>
              <p>{selectedJob.description}</p>

              <h4 className="text-sm font-bold text-white pt-2">Key Responsibilities</h4>
              <ul className="list-disc list-inside space-y-1.5 text-white/70">
                {selectedJob.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-white/50">
                Deadline: {selectedJob.applicationDeadline}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:text-white font-medium text-xs"
                >
                  Close
                </button>

                {isJobApplied(selectedJob.id) ? (
                  <span className="px-5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Already Applied
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      handleApply(selectedJob);
                      setSelectedJob(null);
                    }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all"
                  >
                    Confirm & Submit Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
