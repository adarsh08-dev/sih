import React from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Code,
  Dna,
  Clock,
  Award
} from 'lucide-react';
import { StudentProfile, Mentor, Gig, PassportRecord } from '../types';

interface StudentDashboardProps {
  student: StudentProfile | null;
  mentors: Mentor[];
  gigs: Gig[];
  passport: PassportRecord[];
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
  onBookMentor: (mentor: Mentor) => void;
  onApplyGig: (gig: Gig) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  mentors,
  gigs,
  passport,
  onNavigate,
  onOpenProfile,
  onBookMentor,
  onApplyGig
}) => {
  const readiness = student?.careerReadiness || 81;
  const experienceScore = student?.experienceScore || 64;

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* 1. HERO BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#121A46] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68] relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-[11px] tracking-[1.4px] text-white/35 font-medium uppercase mb-3">
              CAREER INTELLIGENCE
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Welcome back, {student?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Targeting <strong className="text-white">{student?.targetRole || 'Full Stack Software Engineer'}</strong> at tier-1 enterprise partners. You are on track for top-percentile placement readiness.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <button
                onClick={() => onNavigate('gigs')}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
              >
                <span>Browse Micro-Gigs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('mentors')}
                className="px-4 py-2 rounded-xl bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-slate-200 text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span>15-Min Capsule</span>
              </button>

              <button
                onClick={onOpenProfile}
                className="px-3.5 py-2 rounded-xl bg-[#0E1538] hover:bg-[#18214D] border border-[#1E2964] text-[#C4B5FD] text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Dna className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>View Skill DNA & Time Machine in Profile</span>
              </button>
            </div>
          </div>

          {/* READINESS GAUGES */}
          <div className="grid grid-cols-2 gap-3.5 w-full lg:w-auto lg:min-w-[280px] min-w-0">
            <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Career Readiness</span>
              <div className="text-3xl font-black text-emerald-400 my-1">{readiness}%</div>
              <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${readiness}%` }}></div>
              </div>
              <span className="text-[9.5px] text-emerald-300/80 font-medium mt-1">Top 8% in Batch</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2B68] text-center flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience Score</span>
              <div className="text-3xl font-black text-[#A78BFA] my-1">{experienceScore}</div>
              <div className="w-full bg-[#182352] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] h-full rounded-full" style={{ width: `${experienceScore}%` }}></div>
              </div>
              <span className="text-[9.5px] text-purple-300/80 font-medium mt-1">Verified Passport</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. URGENT ACTION RECOMMENDATIONS */}
      <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">AI Recommended Next Actions</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">Target Gap: Backend Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div 
            onClick={() => onNavigate('gigs')}
            className="p-3 rounded-lg bg-[#141C48] border border-[#232F6E] hover:border-[#7C5CFC] cursor-pointer transition-all flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 mt-0.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">Complete Backend Micro-Gig</p>
              <p className="text-[11px] text-slate-400 mt-0.5">+15 points to experience score on approval.</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('mentors')}
            className="p-3 rounded-lg bg-[#141C48] border border-[#232F6E] hover:border-[#7C5CFC] cursor-pointer transition-all flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300 mt-0.5">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">Schedule System Design Capsule</p>
              <p className="text-[11px] text-slate-400 mt-0.5">15-min review with TCS Lead Architect.</p>
            </div>
          </div>

          <div 
            onClick={() => onNavigate('ghost')}
            className="p-3 rounded-lg bg-[#141C48] border border-[#232F6E] hover:border-[#7C5CFC] cursor-pointer transition-all flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition-colors">Run Ghost Sandbox Simulator</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Zero-NDA live code challenge with test runner.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN SPLIT: ACTIVE GIGS & MENTOR MATCHES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Micro-Internship Gigs */}
        <div className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Featured Micro-Internships</h2>
              </div>
              <button
                onClick={() => onNavigate('gigs')}
                className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>View All ({gigs.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {gigs.slice(0, 3).map((gig) => (
                <div
                  key={gig.id}
                  className="p-3.5 rounded-xl bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-all flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400">{gig.company}</span>
                      <span className="text-[9px] bg-indigo-500/20 text-[#C4B5FD] px-1.5 py-0.5 rounded font-bold">{gig.skill}</span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">{gig.title}</p>
                    <p className="text-[11px] text-emerald-400 font-extrabold mt-1">₹{gig.payment} · {gig.hours} Hours</p>
                  </div>

                  <button
                    onClick={() => onApplyGig(gig)}
                    className="px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-[11px] font-bold shrink-0 shadow transition-all"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Mentors */}
        <div className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-pink-400" />
                <h2 className="text-sm font-bold text-white">AI Mentor Matches</h2>
              </div>
              <button
                onClick={() => onNavigate('mentors')}
                className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Browse Mentors ({mentors.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {mentors.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#EC4899] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                      {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{m.name}</p>
                        <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {m.match}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{m.role} · <strong>{m.company}</strong></p>
                      <p className="text-[10px] text-slate-400">{m.experience} years experience</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onBookMentor(m)}
                    className="px-3 py-1.5 rounded-lg bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-white text-[11px] font-bold shrink-0 transition-all"
                  >
                    Capsule
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT EXPERIENCE PASSPORT VERIFICATIONS */}
      <div className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Experience Passport · Verified Ledger</h2>
          </div>
          <button
            onClick={() => onNavigate('passport')}
            className="text-xs font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Open Passport ({passport.length} Badges)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {passport.slice(0, 2).map((item) => (
            <div key={item.id} className="p-3.5 rounded-xl bg-[#0E1538] border border-[#1E2964] flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">{item.title}</p>
                  <span className="text-[10px] font-black text-emerald-400">{item.score}/100</span>
                </div>
                <p className="text-[11px] text-slate-400">{item.company} · {item.experience_type}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Hash: {item.hash?.slice(0, 16) || '0x7f4b8921e90a88...'}</span>
                  <span className="text-emerald-400 font-bold">✓ Blockchain Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
