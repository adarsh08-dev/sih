import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  Check, 
  X, 
  Filter, 
  Building, 
  GraduationCap, 
  FileText,
  AlertCircle,
  Globe,
  ShieldCheck,
  Download,
  Award,
  Layers,
  Lock,
  Mail,
  Phone,
  ExternalLink,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  mockCandidates, 
  mockApplications as initialMockApplications, 
  mockJobs as initialMockJobs, 
  mockInterviews, 
  mockDrives, 
  mockInternships, 
  mockCollabs, 
  mockMessages, 
  mockNotifications 
} from '../../data/recruiterMockData';
import { StatusBadge } from '../../components/recruiter/Common';
import { fetchJobs, createJob, updateJob, deleteJob } from '../../services/api';
import { Job } from '../../types/recruiter';

/* ========================================================================= */
/* CANDIDATE VERIFIED PORTFOLIO REVIEW MODAL                                 */
/* ========================================================================= */
interface CandidatePortfolioModalProps {
  candidateName: string;
  jobTitle?: string;
  appliedDate?: string;
  matchScore?: number;
  currentStage?: string;
  onStageChange?: (newStage: string) => void;
  onClose: () => void;
}

export const CandidatePortfolioModal: React.FC<CandidatePortfolioModalProps> = ({
  candidateName,
  jobTitle = 'Software Engineering Role',
  appliedDate = 'Aug 2026',
  matchScore = 92,
  currentStage = 'Applied',
  onStageChange,
  onClose
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'skills' | 'experience' | 'projects' | 'certs'>('overview');
  const [stage, setStage] = useState(currentStage);
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const candidateMeta = mockCandidates.find(c => c.name.toLowerCase() === candidateName.toLowerCase()) || {
    id: 'c-custom',
    name: candidateName,
    dept: 'B.Tech CSE',
    gradYear: 2027,
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Python'],
    cgpa: 8.6,
    readiness: 92,
    match: matchScore,
    resume: 'Verified',
    projects: 3,
    internships: 1
  };

  const handleStageSelect = (newStage: string) => {
    setStage(newStage);
    if (onStageChange) {
      onStageChange(newStage);
    }
  };

  const handleSaveNotes = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0E1538] border border-[#1E2964] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#1E2964] bg-[#0B1033] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Cryptographically Verified Candidate
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {matchScore}% Skill DNA Match
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{candidateName}</h2>
            <p className="text-xs text-slate-400">
              Applied for <strong className="text-white">{jobTitle}</strong> • {candidateMeta.dept} ({candidateMeta.gradYear}) • CGPA: <span className="text-emerald-400 font-bold">{candidateMeta.cgpa}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-semibold">Stage:</span>
              <select
                value={stage}
                onChange={e => handleStageSelect(e.target.value)}
                className="px-3 py-1.5 bg-[#141C48] border border-[#2A377C] text-indigo-300 font-bold text-xs rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Technical Interview</option>
                <option value="Selected">Selected / Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1E2964] bg-[#0A0E2A] px-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'ATS Summary & Profile', icon: FileText },
            { id: 'skills', label: 'Verified Skills & DNA', icon: Code },
            { id: 'experience', label: 'Micro-Internships & Gigs', icon: Briefcase },
            { id: 'projects', label: 'Code Projects & Repos', icon: Layers },
            { id: 'certs', label: 'Certifications & Honors', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          {/* TAB 1: OVERVIEW */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Contact and Links Header Card */}
              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate Contact</span>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {candidateName.toLowerCase().replace(' ', '.')}@university.edu</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> +91 98765 43210</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> Bareilly / Delhi NCR</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-indigo-400 font-bold">
                  <span className="flex items-center gap-1 hover:underline cursor-pointer"><Code className="w-3.5 h-3.5" /> GitHub Profile</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 hover:underline cursor-pointer"><Globe className="w-3.5 h-3.5" /> LinkedIn</span>
                </div>
              </div>

              {/* Bio & ATS Objective */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Candidate Bio & Engineering Strengths
                </h3>
                <p className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl leading-relaxed text-slate-300">
                  Proven track record in full-stack architecture, systems programming, and database optimization. Verified through {candidateMeta.internships} micro-internship and {candidateMeta.projects} open-source repositories. Ranked in the 92nd percentile in automated algorithmic benchmark assessments.
                </p>
              </div>

              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#0B1033] border border-[#1E2964] rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">CGPA Score</span>
                  <span className="text-xl font-black text-emerald-400 mt-0.5 block">{candidateMeta.cgpa} / 10.0</span>
                </div>
                <div className="p-3.5 bg-[#0B1033] border border-[#1E2964] rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Industry Readiness</span>
                  <span className="text-xl font-black text-indigo-400 mt-0.5 block">{candidateMeta.readiness}%</span>
                </div>
                <div className="p-3.5 bg-[#0B1033] border border-[#1E2964] rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Verified Projects</span>
                  <span className="text-xl font-black text-cyan-400 mt-0.5 block">{candidateMeta.projects} Active</span>
                </div>
                <div className="p-3.5 bg-[#0B1033] border border-[#1E2964] rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 font-semibold block">Ledger Proof</span>
                  <span className="text-xl font-black text-emerald-400 mt-0.5 block">100% Signed</span>
                </div>
              </div>

              {/* Recruiter Evaluation Notes */}
              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Recruiter Evaluation & Interview Notes
                  </label>
                  {noteSaved && <span className="text-[10px] text-emerald-400 font-bold">Notes saved!</span>}
                </div>
                <textarea
                  rows={2}
                  value={recruiterNotes}
                  onChange={e => setRecruiterNotes(e.target.value)}
                  placeholder="Add private evaluation notes, technical strengths, or scheduling notes for this applicant..."
                  className="w-full px-3 py-2 bg-[#0E1538] border border-[#1E2964] rounded-lg text-white resize-none focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  Save Evaluation Notes
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {selectedTab === 'skills' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidateMeta.skills.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-xs">{s}</span>
                      <span className="text-indigo-400 font-mono font-bold text-xs">{88 + (idx * 3) % 10}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" 
                        style={{ width: `${88 + (idx * 3) % 10}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Assessed Level 4/5</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Cryptographically Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXPERIENCE */}
          {selectedTab === 'experience' && (
            <div className="space-y-3">
              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-xs">CloudSphere Systems — Micro-Internship Fellow</h4>
                    <span className="text-[10px] text-slate-400">Distributed Systems & API Security • Completed Jun 2026</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Stipend ₹2,500 Issued
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Engineered zero-trust Express middleware checking revoked JWTs against Redis clusters with sub-millisecond overhead. Achieved 100% automated test coverage.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-400 font-semibold border-t border-white/5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified on Ladder Blockchain Ledger • SHA-256: 7f8a92...1c4e</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS */}
          {selectedTab === 'projects' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">Distributed SQL Query Optimizer</h4>
                  <span className="text-[10px] font-mono text-slate-400">3 Weeks</span>
                </div>
                <p className="text-xs text-slate-300">
                  PostgreSQL indexing engine that analyzes slow query plans, auto-indexes foreign keys, and provides visual flamegraphs.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-900/40 text-[9px] text-indigo-300">PostgreSQL</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-900/40 text-[9px] text-indigo-300">React 18</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-900/40 text-[9px] text-indigo-300">TypeScript</span>
                </div>
              </div>

              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-xs">Real-Time Collaborative Code Canvas</h4>
                  <span className="text-[10px] font-mono text-slate-400">4 Weeks</span>
                </div>
                <p className="text-xs text-slate-300">
                  WebSocket-backed multiplayer whiteboard for engineering system design interviews with live execution sandboxes.
                </p>
                <div className="flex gap-1.5 pt-1">
                  <span className="px-1.5 py-0.5 rounded bg-indigo-900/40 text-[9px] text-indigo-300">WebSockets</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-900/40 text-[9px] text-indigo-300">Node.js</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-900/40 text-[9px] text-indigo-300">Tailwind</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CERTS */}
          {selectedTab === 'certs' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-1">
                <h4 className="font-bold text-white text-xs">AWS Certified Solutions Architect</h4>
                <p className="text-[10px] text-slate-400">Amazon Web Services • Credential ID: AWS-892147</p>
                <span className="inline-block text-[10px] font-bold text-emerald-400">✓ Verified Credential</span>
              </div>
              <div className="p-4 bg-[#0B1033] border border-[#1E2964] rounded-xl space-y-1">
                <h4 className="font-bold text-white text-xs">Smart India Hackathon (SIH 2026) Finalist</h4>
                <p className="text-[10px] text-slate-400">Ministry of Education & AICTE • National Level</p>
                <span className="inline-block text-[10px] font-bold text-emerald-400">✓ National Recognition</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1E2964] bg-[#0B1033] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStageSelect('Shortlisted')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                stage === 'Shortlisted' ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-300'
              }`}
            >
              Shortlist Candidate
            </button>
            <button
              onClick={() => handleStageSelect('Interview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                stage === 'Interview' ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-300'
              }`}
            >
              Schedule Interview
            </button>
            <button
              onClick={() => handleStageSelect('Rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                stage === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-300'
              }`}
            >
              Reject
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-lg bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download ATS PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TalentDiscovery: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Talent Discovery & Verified Candidates</h2>
          <p className="text-xs text-slate-400">Discover top university candidates with cryptographic skill proofs.</p>
        </div>
        {onNavigate && (
          <button 
            onClick={() => onNavigate('post-job')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockCandidates.map(c => (
          <div key={c.id} className="bg-[#0E1538] p-4 rounded-xl border border-[#1E2964] space-y-3 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-bold">{c.name}</h4>
                  <p className="text-[10px] text-slate-400">{c.dept} • {c.gradYear}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-900/40 text-emerald-300 border border-emerald-500/30">
                  {c.cgpa} CGPA
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {c.skills.map(s => (
                  <span key={s} className="px-1.5 py-0.5 rounded bg-indigo-900/30 text-[9px] text-indigo-300 border border-indigo-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#1E2964]/60">
              <div className="flex justify-between items-center text-[10px] text-slate-300 mb-2">
                <span>Skill DNA Match</span>
                <span className="font-bold text-indigo-400">{c.match}%</span>
              </div>
              <button 
                onClick={() => setSelectedCandidate(c.name)}
                className="w-full text-center text-xs font-bold bg-indigo-600/80 hover:bg-indigo-600 py-1.5 rounded-lg text-white transition-colors cursor-pointer"
              >
                Review Portfolio
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCandidate && (
        <CandidatePortfolioModal
          candidateName={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};

export const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState(() => initialMockApplications);
  const [selectedApp, setSelectedApp] = useState<typeof initialMockApplications[0] | null>(null);
  const [filterStage, setFilterStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter(a => {
    if (filterStage !== 'All' && a.stage !== filterStage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return a.cand.toLowerCase().includes(q) || a.job.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStageUpdate = (appId: string, newStage: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, stage: newStage } : a));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  return (
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Student Job Applications</h2>
          <p className="text-xs text-slate-400">Review incoming candidates with automated skill-gap matching and verified digital portfolios.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-indigo-900/40 text-indigo-300 text-xs font-bold border border-indigo-500/30">
            {filteredApps.length} Applicants
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate or job..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0B1033] border border-[#1E2964] rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStage(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                filterStage === st
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-[#0B1033] text-slate-400 hover:text-slate-200 border border-[#1E2964]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-white text-xs">
          <thead>
            <tr className="text-slate-400 border-b border-[#1E2964]">
              <th className="pb-3 font-semibold">Candidate</th>
              <th className="pb-3 font-semibold">Position</th>
              <th className="pb-3 font-semibold">Applied Date</th>
              <th className="pb-3 font-semibold">DNA Match</th>
              <th className="pb-3 font-semibold">Current Stage</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(a => (
              <tr key={a.id} className="border-t border-[#1E2964]/60 hover:bg-[#131B4D] transition-colors">
                <td className="py-3 font-bold text-white">
                  <div className="flex items-center gap-1.5">
                    <span>{a.cand}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Verified Portfolio" />
                  </div>
                </td>
                <td className="py-3 text-slate-300">{a.job}</td>
                <td className="py-3 text-slate-400">{a.date}</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-900/40 text-indigo-300 border border-indigo-500/20">
                    {a.match}%
                  </span>
                </td>
                <td className="py-3"><StatusBadge status={a.stage} /></td>
                <td className="py-3 text-right">
                  <button 
                    onClick={() => setSelectedApp(a)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Review Portfolio
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <CandidatePortfolioModal
          candidateName={selectedApp.cand}
          jobTitle={selectedApp.job}
          appliedDate={selectedApp.date}
          matchScore={selectedApp.match}
          currentStage={selectedApp.stage}
          onStageChange={(newStage) => handleStageUpdate(selectedApp.id, newStage)}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};

export const ShortlistedPage: React.FC = () => {
  const [applications, setApplications] = useState(() => initialMockApplications);
  const [selectedCand, setSelectedCand] = useState<string | null>(null);

  const shortlisted = applications.filter(a => a.stage === 'Shortlisted' || a.stage === 'Interview');

  return (
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
      <div>
        <h2 className="text-xl font-black text-white">Shortlisted Candidates</h2>
        <p className="text-xs text-slate-400">High-priority profiles ready for technical interview rounds and portfolio evaluation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortlisted.map(a => (
          <div key={a.id} className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex justify-between items-start">
                <h4 className="text-white font-bold">{a.cand}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-900/40 text-indigo-300 border border-indigo-500/20">
                  {a.match}% Match
                </span>
              </div>
              <p className="text-xs text-slate-400">{a.job}</p>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
                <ShieldCheck className="w-3 h-3" /> Verified ATS Portfolio Ready
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/5">
              <button 
                onClick={() => setSelectedCand(a.cand)}
                className="flex-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 py-1.5 rounded-lg text-white transition-colors cursor-pointer"
              >
                Review Portfolio
              </button>
              <button 
                onClick={() => setSelectedCand(a.cand)}
                className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded-lg text-white transition-colors cursor-pointer"
              >
                Schedule Round
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCand && (
        <CandidatePortfolioModal
          candidateName={selectedCand}
          onClose={() => setSelectedCand(null)}
        />
      )}
    </div>
  );
};

/* ========================================================================= */
/* JOB POSTINGS PAGE (CONNECTED DIRECTLY TO DATABASE VIA /api/jobs)          */
/* ========================================================================= */
export const JobPostingsPage: React.FC<{ 
  onNavigate?: (tab: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}> = ({ onNavigate, onShowToast }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Closed'>('All');
  const [selectedJobDetail, setSelectedJobDetail] = useState<Job | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadJobsFromDatabase = async () => {
    setLoading(true);
    try {
      const fetched = await fetchJobs();
      if (fetched && fetched.length > 0) {
        setJobs(fetched);
      } else {
        // Fallback to formatted initialMockJobs
        setJobs(initialMockJobs.map(j => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          type: j.type,
          duration: '6 Months',
          stipend: j.stipend,
          applications: j.apps,
          apps: j.apps,
          openings: j.openings,
          deadline: j.deadline,
          status: j.status as any,
          requiredSkills: ['React', 'Node.js', 'PostgreSQL'],
          skills: ['React', 'Node.js', 'PostgreSQL'],
          eligibility: 'B.Tech CSE/IT 2026/2027',
          description: 'High-impact software engineering role at industry partner.'
        })));
      }
    } catch (err) {
      console.error('Failed to load jobs from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsFromDatabase();
  }, []);

  const handleToggleStatus = async (job: Job) => {
    const nextStatus: 'Active' | 'Draft' | 'Closed' = 
      job.status === 'Active' ? 'Closed' : job.status === 'Closed' ? 'Draft' : 'Active';
    
    // Optimistic UI update
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: nextStatus } : j));
    
    try {
      await updateJob(job.id, { status: nextStatus });
      if (onShowToast) {
        onShowToast(`Job status updated to "${nextStatus}" in database!`, 'success');
      }
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    setDeletingId(id);
    // Optimistically update UI immediately
    setJobs(prev => prev.filter(j => String(j.id) !== String(id)));

    try {
      await deleteJob(id);
      if (onShowToast) {
        onShowToast(`Job posting "${title}" deleted from database.`, 'info');
      }
    } catch (err) {
      console.error('Failed to delete job:', err);
      if (onShowToast) {
        onShowToast('Could not delete job from database.', 'error');
      }
      // Reload on failure
      loadJobsFromDatabase();
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchSearch = 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.requiredSkills || j.skills || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0E1538] p-5 rounded-2xl border border-[#1E2964]">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-white">Recruiter Job Postings</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-900/50 text-indigo-300 border border-indigo-500/30">
              {jobs.length} Total Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Synced with Live PostgreSQL Database
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={loadJobsFromDatabase}
            disabled={loading}
            className="p-2 rounded-xl bg-[#0B1033] hover:bg-[#131B4D] border border-[#1E2964] text-slate-300 hover:text-white transition-colors"
            title="Refresh database postings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('post-job')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Post a New Job
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, skill, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0E1538] border border-[#1E2964] rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Active', 'Draft', 'Closed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-[#0E1538] text-slate-400 hover:text-white border border-[#1E2964]'
              }`}
            >
              {tab}
              <span className="ml-1.5 text-[10px] opacity-70">
                ({tab === 'All' ? jobs.length : jobs.filter(j => j.status === tab).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 bg-[#0E1538] rounded-2xl border border-[#1E2964] animate-pulse space-y-4">
              <div className="h-4 bg-[#1E2964] rounded w-3/4"></div>
              <div className="h-3 bg-[#1E2964]/60 rounded w-1/2"></div>
              <div className="h-16 bg-[#1E2964]/40 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-[#0E1538] p-12 rounded-2xl border border-[#1E2964] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-900/30 text-indigo-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Job Postings Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'All' 
                ? 'Try adjusting your search query or status filter.' 
                : 'No job postings have been created yet. Post your first opportunity to receive candidate applications directly.'}
            </p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('post-job')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Create Job Opportunity
            </button>
          )}
        </div>
      ) : (
        /* Jobs Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map(job => {
            const skills = job.requiredSkills || job.skills || ['Engineering'];
            const applicationsCount = job.applications !== undefined ? job.applications : (job.apps || 0);

            return (
              <div 
                key={job.id} 
                className="bg-[#0E1538] hover:bg-[#0E1744] p-5 rounded-2xl border border-[#1E2964] hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 group relative"
              >
                <div className="space-y-3">
                  {/* Top Row: Title, Company & Status */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-indigo-300 transition-colors">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(job)}
                      title="Click to toggle status (Active / Closed / Draft)"
                      className="flex-shrink-0 cursor-pointer"
                    >
                      <StatusBadge status={job.status} />
                    </button>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1033] border border-[#1E2964]">
                      <MapPin className="w-3 h-3 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1033] border border-[#1E2964]">
                      <DollarSign className="w-3 h-3 text-emerald-400" /> {job.stipend || 'Competitive'}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B1033] border border-[#1E2964]">
                      <Clock className="w-3 h-3 text-indigo-400" /> {job.duration || job.type || 'Full-Time'}
                    </span>
                  </div>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skills.slice(0, 4).map((s, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-0.5 rounded bg-indigo-900/30 text-[10px] text-indigo-300 border border-indigo-500/20 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                    {skills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400">
                        +{skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Stats & Actions */}
                <div className="pt-3 border-t border-[#1E2964]/60 space-y-3">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <strong className="text-white font-bold">{applicationsCount}</strong> Applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Deadline: <strong className="text-slate-300">{job.deadline || 'Open'}</strong>
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setSelectedJobDetail(job)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-[#0B1033] hover:bg-[#131B4D] border border-[#1E2964] py-1.5 rounded-xl text-slate-200 hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      disabled={deletingId === job.id}
                      className="p-2 rounded-xl bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete job from database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1538] border border-[#1E2964] rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedJobDetail(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-indigo-900/40 text-indigo-400 border border-indigo-500/30">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedJobDetail.title}</h3>
                <p className="text-xs text-slate-400">{selectedJobDetail.company} • {selectedJobDetail.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-[#0B1033] border border-[#1E2964] text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Stipend / CTC</span>
                <span className="font-bold text-emerald-400">{selectedJobDetail.stipend || 'Competitive'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Duration / Type</span>
                <span className="font-bold text-white">{selectedJobDetail.duration || selectedJobDetail.type}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Applications</span>
                <span className="font-bold text-indigo-300">
                  {selectedJobDetail.applications !== undefined ? selectedJobDetail.applications : (selectedJobDetail.apps || 0)} candidates
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {(selectedJobDetail.requiredSkills || selectedJobDetail.skills || ['Engineering']).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-indigo-900/30 text-xs font-medium text-indigo-300 border border-indigo-500/30">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {selectedJobDetail.eligibility && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Eligibility</h4>
                <p className="text-xs text-slate-300 bg-[#0B1033] p-2.5 rounded-lg border border-[#1E2964]">
                  {selectedJobDetail.eligibility}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Job Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto bg-[#0B1033] p-3 rounded-lg border border-[#1E2964]">
                {selectedJobDetail.description || 'Full-scale development opportunity focusing on modern architectures, team collaboration and real-world delivery.'}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleStatus(selectedJobDetail);
                  setSelectedJobDetail(prev => prev ? {
                    ...prev,
                    status: prev.status === 'Active' ? 'Closed' : 'Active'
                  } : null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
              >
                Toggle Status ({selectedJobDetail.status})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* POST JOB PAGE (FORM PERSISTS INTO DATABASE VIA /api/jobs)                  */
/* ========================================================================= */
export const PostJobPage: React.FC<{
  onNavigate?: (tab: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}> = ({ onNavigate, onShowToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: 'TechNova Solutions',
    location: 'Bengaluru, India',
    type: 'Hybrid',
    jobType: 'Full-Time',
    duration: '6 Months',
    stipend: '₹25,000 / month',
    openings: 5,
    eligibility: 'B.Tech CSE / IT / ECE 2026/2027 with CGPA >= 7.0',
    description: 'We are seeking passionate engineers to build cloud microservices, optimize real-time pipelines, and develop high-performance web user interfaces.',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Draft'
  });

  const [skills, setSkills] = useState<string[]>(['React', 'Node.js', 'PostgreSQL', 'TypeScript']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const popularSkills = [
    'React', 'Node.js', 'Python', 'PostgreSQL', 'TypeScript', 
    'Docker', 'AWS', 'Spring Boot', 'Next.js', 'FastAPI', 'Figma', 'Kubernetes'
  ];

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleQuickTemplate = (templateName: string) => {
    if (templateName === 'ai_engineer') {
      setFormData(prev => ({
        ...prev,
        title: 'Generative AI & ML Engineer Intern',
        type: 'Hybrid',
        duration: '6 Months',
        stipend: '₹35,000 / month',
        openings: 4,
        eligibility: 'B.Tech / M.Tech in CSE / AI / Data Science (2026/2027)',
        description: 'Design and deploy LLM agents, optimize vector databases, fine-tune models, and integrate multi-modal AI APIs into enterprise pipelines.'
      }));
      setSkills(['Python', 'PyTorch', 'FastAPI', 'PostgreSQL', 'Docker']);
    } else if (templateName === 'fullstack') {
      setFormData(prev => ({
        ...prev,
        title: 'Full Stack Cloud Developer Intern',
        type: 'Remote',
        duration: '6 Months',
        stipend: '₹28,000 / month',
        openings: 6,
        eligibility: 'B.Tech CSE / IT 2026/2027 with verified Git repositories',
        description: 'Build end-to-end full-stack web applications, write secure RESTful APIs, design scalable database schemas, and create fluid React interfaces.'
      }));
      setSkills(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS']);
    } else if (templateName === 'devops') {
      setFormData(prev => ({
        ...prev,
        title: 'Cloud DevOps & Infrastructure Associate',
        type: 'In-Office',
        location: 'Pune, India',
        duration: 'Full-Time',
        stipend: '₹9.0 LPA',
        openings: 3,
        eligibility: 'B.Tech / MCA 2025/2026 with Linux/Networking fundamentals',
        description: 'Automate CI/CD pipelines, manage Kubernetes clusters, enforce zero-trust security postures, and monitor cloud health metrics.'
      }));
      setSkills(['Linux', 'Docker', 'Kubernetes', 'AWS', 'Terraform']);
    }

    if (onShowToast) {
      onShowToast(`Loaded ${templateName.replace('_', ' ')} template!`, 'info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      if (onShowToast) onShowToast('Please enter a job title.', 'error');
      return;
    }

    if (skills.length === 0) {
      if (onShowToast) onShowToast('Please specify at least one required skill.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        jobType: formData.jobType,
        duration: formData.duration,
        stipend: formData.stipend,
        openings: Number(formData.openings),
        requiredSkills: skills,
        skills: skills,
        eligibility: formData.eligibility,
        description: formData.description,
        deadline: formData.deadline,
        status: formData.status
      });

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setSubmitSuccess(true);

      if (onShowToast) {
        onShowToast(`Job "${formData.title}" posted and saved to database successfully!`, 'success');
      }

      // Auto redirect after short delay
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('job-postings');
        }
      }, 1200);

    } catch (err: any) {
      console.error('Error saving job to database:', err);
      if (onShowToast) {
        onShowToast(`Error saving job: ${err?.message || 'Check database connection'}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Post a New Job Opportunity
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Job postings are instantly saved into the backend database ledger and published to university candidates.
          </p>
        </div>

        {/* Quick Fill Templates */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-semibold">Quick Templates:</span>
          <button
            type="button"
            onClick={() => handleQuickTemplate('fullstack')}
            className="px-2.5 py-1 rounded-lg bg-[#0B1033] hover:bg-[#131B4D] border border-[#1E2964] text-[11px] font-bold text-indigo-300 hover:text-white transition-colors"
          >
            Full Stack
          </button>
          <button
            type="button"
            onClick={() => handleQuickTemplate('ai_engineer')}
            className="px-2.5 py-1 rounded-lg bg-[#0B1033] hover:bg-[#131B4D] border border-[#1E2964] text-[11px] font-bold text-purple-300 hover:text-white transition-colors"
          >
            AI / ML
          </button>
          <button
            type="button"
            onClick={() => handleQuickTemplate('devops')}
            className="px-2.5 py-1 rounded-lg bg-[#0B1033] hover:bg-[#131B4D] border border-[#1E2964] text-[11px] font-bold text-emerald-300 hover:text-white transition-colors"
          >
            DevOps
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Job Successfully Published to Database!</p>
              <p className="text-[11px] text-emerald-300/80">Redirecting you to the active job postings ledger...</p>
            </div>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('job-postings')}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
            >
              View Listings
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Form + Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2 Cols) */}
        <div className="lg:col-span-2 bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Job / Internship Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Cloud Engineer Intern"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Hiring Company <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TechNova Solutions"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Location, Work Mode & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Work Mode</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="In-Office">In-Office</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Opportunity Type</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>
            </div>

            {/* Stipend, Duration, Openings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Stipend / CTC</label>
                <input
                  type="text"
                  placeholder="e.g. ₹25,000 / month, ₹12 LPA"
                  value={formData.stipend}
                  onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 6 Months, Permanent"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Openings Count</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.openings}
                  onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Skills Tag Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Required Technical Skills <span className="text-red-400">*</span>
              </label>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-[#0B1033] border border-[#1E2964] rounded-xl">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  placeholder="Type skill & press Enter..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      handleAddSkill(newSkillInput);
                    }
                  }}
                  className="flex-1 min-w-[140px] bg-transparent text-white text-xs placeholder:text-slate-500 focus:outline-none px-2 py-0.5"
                />
              </div>

              {/* Popular Skill Quick Add */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400">Suggestions:</span>
                {popularSkills.filter(s => !skills.includes(s)).slice(0, 7).map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="px-2 py-0.5 rounded-md bg-[#131B4D] hover:bg-indigo-900/50 text-[10px] text-slate-300 hover:text-indigo-300 border border-[#1E2964] transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Eligibility & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Eligibility Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech CSE/IT 2026/2027 with CGPA >= 7.5"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Application Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-[#0B1033] px-3.5 py-2.5 rounded-xl border border-[#1E2964] text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Job Description & Responsibilities</label>
              <textarea
                rows={4}
                placeholder="Describe key responsibilities, team structure, tech stack, and what the candidate will achieve..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#0B1033] p-3.5 rounded-xl border border-[#1E2964] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-semibold flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Draft' : 'Active' })}
                    className="rounded border-[#1E2964] bg-[#0B1033] text-indigo-600 focus:ring-0"
                  />
                  Save as Draft (Don't publish to live board yet)
                </label>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('job-postings')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving to Database...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Publish Opportunity
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Live Preview Column (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" /> Live Student Preview
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold">Real-Time Sync</span>
          </div>

          {/* Candidate View Mockup */}
          <div className="bg-[#0E1538] p-5 rounded-2xl border border-indigo-500/40 shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="text-white font-bold text-sm">
                  {formData.title || 'Job Opportunity Title'}
                </h4>
                <p className="text-xs text-indigo-300 font-medium mt-0.5 flex items-center gap-1">
                  <Building className="w-3 h-3 text-indigo-400" />
                  {formData.company || 'TechNova Solutions'}
                </p>
              </div>
              <StatusBadge status={formData.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1E2964]">
                <span className="text-[9px] text-slate-400 block">Location</span>
                <span className="font-semibold text-white">{formData.location || 'Remote'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1E2964]">
                <span className="text-[9px] text-slate-400 block">Stipend / CTC</span>
                <span className="font-semibold text-emerald-400">{formData.stipend || 'Competitive'}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1E2964]">
                <span className="text-[9px] text-slate-400 block">Work Mode</span>
                <span className="font-semibold text-white">{formData.type}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1E2964]">
                <span className="text-[9px] text-slate-400 block">Openings</span>
                <span className="font-semibold text-white">{formData.openings} positions</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-semibold block">Required Skills:</span>
              <div className="flex flex-wrap gap-1">
                {skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-indigo-900/30 text-[10px] text-indigo-300 border border-indigo-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#0B1033] border border-[#1E2964] text-[11px] text-slate-300 leading-relaxed line-clamp-3">
              {formData.description || 'Job role overview will appear here.'}
            </div>

            <div className="pt-2 border-t border-[#1E2964] flex justify-between items-center text-[10px] text-slate-400">
              <span>Deadline: <strong className="text-slate-200">{formData.deadline}</strong></span>
              <span className="text-indigo-400 font-bold">● Live on Database</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Automated University Pipeline
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When published, this job is indexed in the PostgreSQL database and immediately recommended to matching candidates based on Skill DNA matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InterviewsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-black text-white">Interview Schedules</h2>
        <p className="text-xs text-slate-400">Manage technical rounds and hiring decisions.</p>
      </div>
      <span className="px-3 py-1 rounded-full bg-indigo-900/40 text-indigo-300 text-xs font-bold border border-indigo-500/30">
        {mockInterviews.length} Scheduled Rounds
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-white text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-[#1E2964]">
            <th className="pb-3 font-semibold">Candidate</th>
            <th className="pb-3 font-semibold">Role</th>
            <th className="pb-3 font-semibold">Date & Time</th>
            <th className="pb-3 font-semibold">Round</th>
            <th className="pb-3 font-semibold">Mode</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockInterviews.map(i => (
            <tr key={i.id} className="border-t border-[#1E2964]/60 hover:bg-[#131B4D] transition-colors">
              <td className="py-3 font-bold text-white">{i.cand}</td>
              <td className="py-3 text-slate-300">{i.job}</td>
              <td className="py-3 text-slate-400">{i.date} • {i.time}</td>
              <td className="py-3 text-indigo-300 font-semibold">{i.round}</td>
              <td className="py-3 text-slate-300">{i.mode}</td>
              <td className="py-3"><StatusBadge status={i.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const RecruiterAnalyticsPage: React.FC = () => {
  const [selectedCycle, setSelectedCycle] = useState('Campus Season 2026-27');
  const [selectedDept, setSelectedDept] = useState('All Departments');

  const apps = initialMockApplications || [];
  const interviews = mockInterviews || [];

  const funnelStages = [
    { name: 'Applied Candidates', count: 184, rate: '100%', color: 'from-blue-600 to-indigo-600', icon: Users },
    { name: 'DNA & Skill Screened', count: 126, rate: '68.5%', color: 'from-indigo-600 to-purple-600', icon: ShieldCheck },
    { name: 'Shortlisted for Round 1', count: 68, rate: '37.0%', color: 'from-purple-600 to-pink-600', icon: Award },
    { name: 'Technical Interviews', count: 32, rate: '17.4%', color: 'from-pink-600 to-rose-600', icon: Calendar },
    { name: 'Final Offers Extended', count: 18, rate: '9.8%', color: 'from-emerald-600 to-teal-600', icon: CheckCircle2 }
  ];

  const collegeBenchmarks = [
    { college: 'MJPRU Bareilly (CSIT)', applicants: 64, shortlisted: 28, avgScore: 84.6, offerRate: '18.7%' },
    { college: 'IET Lucknow', applicants: 48, shortlisted: 19, avgScore: 82.1, offerRate: '16.6%' },
    { college: 'KNIT Sultanpur', applicants: 36, shortlisted: 12, avgScore: 79.4, offerRate: '13.8%' },
    { college: 'BIET Jhansi', applicants: 36, shortlisted: 9, avgScore: 77.2, offerRate: '11.1%' }
  ];

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-1">
        <p className="text-slate-400 text-xs">Total Applications</p>
        <p className="text-2xl font-black text-white">{initialMockApplications.length}</p>
        <p className="text-[10px] text-emerald-400">+18% this campus cycle</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-1">
          <p className="text-slate-400 text-xs font-medium">Total Applications</p>
          <p className="text-2xl font-black text-white">184</p>
          <p className="text-[10px] text-emerald-400 font-semibold">+24% vs. previous cohort</p>
        </div>
        <div className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-1">
          <p className="text-slate-400 text-xs font-medium">Interviews Conducted</p>
          <p className="text-2xl font-black text-white">32</p>
          <p className="text-[10px] text-indigo-400 font-semibold">93.8% attendance rate</p>
        </div>
        <div className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-1">
          <p className="text-slate-400 text-xs font-medium">Offer Acceptance Rate</p>
          <p className="text-2xl font-black text-emerald-400">94.4%</p>
          <p className="text-[10px] text-slate-400 font-semibold">17 of 18 accepted</p>
        </div>
        <div className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-1">
          <p className="text-slate-400 text-xs font-medium">Avg. Time to Hire</p>
          <p className="text-2xl font-black text-indigo-300">11.4 Days</p>
          <p className="text-[10px] text-emerald-400 font-semibold">4.2x faster with verified DNA</p>
        </div>
      </div>

      {/* Candidate Conversion Funnel */}
      <div className="p-5 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">End-to-End Candidate Conversion Funnel</h3>
          <span className="text-[11px] font-semibold text-slate-400">Total Pipeline: 184 Candidates</span>
        </div>
        
        <div className="space-y-3">
          {funnelStages.map((stage, idx) => (
            <div key={stage.name} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <stage.icon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-white">{stage.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400">{stage.count} candidates</span>
                  <span className="font-mono font-bold text-indigo-300">{stage.rate}</span>
                </div>
              </div>
              <div className="w-full bg-[#1A1F3D] h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stage.color} rounded-full transition-all duration-500`}
                  style={{ width: stage.rate }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College-wise Performance & Skill DNA Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* College Benchmarks */}
        <div className="p-5 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-4">
          <h3 className="text-sm font-bold text-white">Campus Drive Yield by University</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-[#1E2964]">
                  <th className="pb-2 font-semibold">Institute</th>
                  <th className="pb-2 font-semibold text-center">Applied</th>
                  <th className="pb-2 font-semibold text-center">Avg DNA</th>
                  <th className="pb-2 font-semibold text-right">Offer Yield</th>
                </tr>
              </thead>
              <tbody>
                {collegeBenchmarks.map((col) => (
                  <tr key={col.college} className="border-t border-[#1E2964]/60">
                    <td className="py-2.5 font-bold text-white">{col.college}</td>
                    <td className="py-2.5 text-center text-slate-300">{col.applicants}</td>
                    <td className="py-2.5 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {col.avgScore}%
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-indigo-300">{col.offerRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Verified Skills */}
        <div className="p-5 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-4">
          <h3 className="text-sm font-bold text-white">Candidate Verified Skills Distribution</h3>
          <div className="space-y-3">
            {topSkillsInDemand.map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.skill}</span>
                  <span className="text-slate-400">{item.verifiedCount} verified candidates ({item.matchRate}% match)</span>
                </div>
                <div className="w-full bg-[#1A1F3D] h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                    style={{ width: `${item.matchRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompanyProfilePage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-6">
    <div>
      <h2 className="text-xl font-black text-white">Company Recruiter Profile</h2>
      <p className="text-xs text-slate-400">Manage organizational presence and verified recruitment branding.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2964] space-y-3">
        <h4 className="text-sm font-bold text-white">Company Identity</h4>
        <div className="space-y-2 text-xs text-slate-300">
          <p><strong className="text-slate-400">Name:</strong> TechNova Solutions Pvt. Ltd.</p>
          <p><strong className="text-slate-400">Industry:</strong> Cloud Computing & Enterprise Software</p>
          <p><strong className="text-slate-400">Headquarters:</strong> Bengaluru, Karnataka</p>
          <p><strong className="text-slate-400">Website:</strong> https://technova.example.com</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2964] space-y-3">
        <h4 className="text-sm font-bold text-white">Hiring Credentials</h4>
        <div className="space-y-2 text-xs text-slate-300">
          <p><strong className="text-slate-400">Verification:</strong> <span className="text-emerald-400">AICTE & UGC Partner Verified</span></p>
          <p><strong className="text-slate-400">Active MoUs:</strong> 12 Tier-1 Universities</p>
          <p><strong className="text-slate-400">Recruiter Lead:</strong> Rahul Mehta (Senior Campus Talent Lead)</p>
        </div>
      </div>
    </div>
  </div>
);

export const CampusDrivesPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-black text-white">University Campus Drives</h2>
        <p className="text-xs text-slate-400">Coordinated on-campus and virtual hiring drives.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockDrives.map(d => (
        <div key={d.id} className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="text-white font-bold">{d.name}</h4>
            <StatusBadge status={d.status} />
          </div>
          <p className="text-xs text-slate-400">{d.company} • Scheduled: {d.date}</p>
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded bg-[#0E1538]">
              <span className="text-[10px] text-slate-400 block">Eligible</span>
              <span className="font-bold text-white">{d.eligible}</span>
            </div>
            <div className="p-2 rounded bg-[#0E1538]">
              <span className="text-[10px] text-slate-400 block">Registered</span>
              <span className="font-bold text-indigo-300">{d.reg}</span>
            </div>
            <div className="p-2 rounded bg-[#0E1538]">
              <span className="text-[10px] text-slate-400 block">Shortlisted</span>
              <span className="font-bold text-amber-300">{d.short}</span>
            </div>
            <div className="p-2 rounded bg-[#0E1538]">
              <span className="text-[10px] text-slate-400 block">Selected</span>
              <span className="font-bold text-emerald-400">{d.sel}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const InternshipProgramsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div>
      <h2 className="text-xl font-black text-white">Structured Internship Programs</h2>
      <p className="text-xs text-slate-400">Cohort programs with structured credit transfers and mentor checkpoints.</p>
    </div>
    <div className="space-y-3">
      {mockInternships.map(i => (
        <div key={i.id} className="p-4 bg-[#0B1033] rounded-xl border border-[#1E2964] flex justify-between items-center">
          <div>
            <h4 className="text-white font-bold text-sm">{i.title}</h4>
            <p className="text-xs text-slate-400">{i.company}</p>
          </div>
          <StatusBadge status={i.status} />
        </div>
      ))}
    </div>
  </div>
);

export const UniversityCollaborationPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div>
      <h2 className="text-xl font-black text-white">University Institutional Collaborations</h2>
      <p className="text-xs text-slate-400">Automated MoUs, Faculty Swaps and Curriculum Advisory boards.</p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-white text-xs">
        <thead>
          <tr className="text-slate-400 border-b border-[#1E2964]">
            <th className="pb-3 font-semibold">Institution</th>
            <th className="pb-3 font-semibold">Collaboration Type</th>
            <th className="pb-3 font-semibold">Partnership Status</th>
          </tr>
        </thead>
        <tbody>
          {mockCollabs.map(c => (
            <tr key={c.id} className="border-t border-[#1E2964]/60">
              <td className="py-3 font-bold">{c.org}</td>
              <td className="py-3 text-slate-300">{c.type}</td>
              <td className="py-3"><StatusBadge status={c.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const LiveProjectsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div>
      <h2 className="text-xl font-black text-white">Live Industry Projects</h2>
      <p className="text-xs text-slate-400">Micro-tasks and real-world problem statements for student cohorts.</p>
    </div>
    <div className="p-8 text-center text-slate-400 bg-[#0B1033] rounded-xl border border-[#1E2964]">
      <Briefcase className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
      <p className="text-xs font-bold text-white">Micro-Gigs & Industry Problem Statements</p>
      <p className="text-[11px] text-slate-400 mt-1">Recruiter live tasks are integrated directly with student Micro-Gigs view.</p>
    </div>
  </div>
);

export const ResearchOpportunitiesPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div>
      <h2 className="text-xl font-black text-white">Joint Research Opportunities</h2>
      <p className="text-xs text-slate-400">Collaborate with university researchers and patent grants.</p>
    </div>
    <div className="p-8 text-center text-slate-400 bg-[#0B1033] rounded-xl border border-[#1E2964]">
      <GraduationCap className="w-8 h-8 text-purple-400 mx-auto mb-2" />
      <p className="text-xs font-bold text-white">R&D and Joint Whitepapers</p>
      <p className="text-[11px] text-slate-400 mt-1">Publish research grant challenges and sponsored university labs.</p>
    </div>
  </div>
);

export const MessagesPage: React.FC = () => {
  const [activeMessage, setActiveMessage] = useState(mockMessages[0]);
  return (
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] h-[550px] flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#1E2964] pr-2 space-y-2 overflow-y-auto">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Conversations</h3>
        {mockMessages.map(m => (
          <div 
            key={m.id} 
            onClick={() => setActiveMessage(m)}
            className={`p-3 rounded-xl cursor-pointer text-xs transition-colors ${
              activeMessage.id === m.id ? 'bg-indigo-600 text-white font-bold' : 'bg-[#0B1033] text-slate-300 hover:bg-[#131B4D]'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-bold">{m.from}</span>
              <span className="text-[10px] opacity-70">10:30 AM</span>
            </div>
            <p className="text-[11px] opacity-80 truncate mt-1">{m.text}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-between p-2">
        <div>
          <div className="border-b border-[#1E2964] pb-3 mb-3">
            <h4 className="text-white font-bold text-sm">{activeMessage.from}</h4>
            <p className="text-[10px] text-slate-400">Campus Placement Officer / Candidate</p>
          </div>
          <div className="space-y-3">
            <div className="bg-[#0B1033] p-3 rounded-xl border border-[#1E2964] text-xs text-slate-200 max-w-lg">
              {activeMessage.text}
            </div>
          </div>
        </div>
        <div className="pt-3 border-t border-[#1E2964] flex gap-2">
          <input
            placeholder="Type your response..."
            className="flex-1 bg-[#0B1033] border border-[#1E2964] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-black text-white">Recruiter Notifications</h2>
        <p className="text-xs text-slate-400">Live alerts regarding job applications and interview schedules.</p>
      </div>
    </div>
    <div className="space-y-2">
      {mockNotifications.map(n => (
        <div key={n.id} className="p-3.5 bg-[#0B1033] rounded-xl border border-[#1E2964] text-xs text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <span>{n.msg}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Today</span>
        </div>
      ))}
    </div>
  </div>
);

export const SettingsPage: React.FC<{
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}> = ({ onShowToast }) => {
  const [notifications, setNotifications] = useState(true);
  const [autoMatch, setAutoMatch] = useState(true);

  const handleSave = () => {
    if (onShowToast) {
      onShowToast('Recruiter preferences updated successfully!', 'success');
    }
  };

  return (
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Recruiter Settings</h2>
        <p className="text-xs text-slate-400">Configure notification preferences and talent-matching automation.</p>
      </div>

      <div className="space-y-4 max-w-lg">
        <label className="flex items-center justify-between p-3 rounded-xl bg-[#0B1033] border border-[#1E2964] text-xs text-white cursor-pointer">
          <span>Real-time Candidate Application Alerts</span>
          <input 
            type="checkbox" 
            checked={notifications} 
            onChange={(e) => setNotifications(e.target.checked)} 
            className="rounded border-[#1E2964] text-indigo-600"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-[#0B1033] border border-[#1E2964] text-xs text-white cursor-pointer">
          <span>AI-Assisted Skill DNA Match Filtering</span>
          <input 
            type="checkbox" 
            checked={autoMatch} 
            onChange={(e) => setAutoMatch(e.target.checked)} 
            className="rounded border-[#1E2964] text-indigo-600"
          />
        </label>

        <button 
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};


