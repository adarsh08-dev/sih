import React, { useState } from 'react';
import { 
  Code, 
  Trophy, 
  Users, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2, 
  Github, 
  Layers, 
  Building2, 
  DollarSign,
  Send,
  Plus
} from 'lucide-react';
import { ProjectChallenge, StudentProfile } from '../types';
import { INITIAL_PROJECTS } from '../data/portalData';

interface ProjectsChallengesViewProps {
  student?: StudentProfile | null;
  onNavigateTab?: (tab: string) => void;
  onChallengeSubmitted?: (challengeId: string) => void;
}

export const ProjectsChallengesView: React.FC<ProjectsChallengesViewProps> = ({
  student,
  onNavigateTab,
  onChallengeSubmitted
}) => {
  const [projects, setProjects] = useState<any[]>(() => {
    return (INITIAL_PROJECTS || []).map((p: any) => ({
      ...p,
      sponsorCompany: p.sponsorCompany || p.company || 'Industry Partner',
      bountyReward: p.bountyReward || p.bountyOrReward || '₹15,000 Bounty',
      techStack: Array.isArray(p.techStack) ? p.techStack : (Array.isArray(p.requiredSkills) ? p.requiredSkills : ['Engineering']),
      experienceScore: p.experienceScore || 250,
      teamSize: p.teamSize || '1-3 Members',
      deadline: p.deadline || 'Sep 30, 2026',
      isCompleted: p.isCompleted || p.status === 'Completed'
    }));
  });
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [submittingProject, setSubmittingProject] = useState<any | null>(null);
  
  // Submission Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [architectureNote, setArchitectureNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState<string | null>(null);

  const handleSubmitMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingProject) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setProjects(prev => prev.map(p => p.id === submittingProject.id ? { ...p, isCompleted: true } : p));
      setIsSubmitting(false);
      setSuccessSubmitted(submittingProject.title);
      setSubmittingProject(null);
      if (onChallengeSubmitted) {
        onChallengeSubmitted(submittingProject.id);
      }
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">Live Industry Projects & Bounties</h1>
          </div>
          <p className="text-xs text-slate-300">
            Solve real production engineering challenges sponsored by tier-1 enterprise partners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            🏆 Total Available Bounties: ₹80,000
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] hover:border-[#7C5CFC] transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{proj.sponsorCompany}</span>
                </div>
                <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  {proj.bountyReward}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-[#C4B5FD] transition-colors mb-1.5">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                {proj.description}
              </p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {proj.techStack.map((tech, tIdx) => (
                  <span key={tIdx} className="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded font-mono">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#070B1E] border border-white/5 text-[11px] text-slate-300 text-center mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 block">Experience</span>
                  <span className="font-bold text-purple-400">+{proj.experienceScore} XP</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Team Size</span>
                  <span className="font-bold text-white">{proj.teamSize}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Due Date</span>
                  <span className="font-bold text-slate-300">{proj.deadline}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedProject(proj)}
                className="flex-1 py-2 rounded-xl bg-[#141C48] hover:bg-[#1D296C] text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                View Specs
              </button>

              {proj.isCompleted ? (
                <button
                  disabled
                  className="flex-1 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold cursor-not-allowed text-center"
                >
                  Submitted ✓
                </button>
              ) : (
                <button
                  onClick={() => setSubmittingProject(proj)}
                  className="flex-1 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow transition-all cursor-pointer text-center"
                >
                  Submit Solution
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Specs Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0B1033] border border-[#1E2B68] rounded-2xl p-6 space-y-5 shadow-2xl animate-scale-in">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#182352]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Sponsored by {selectedProject.sponsorCompany}
                </span>
                <h2 className="text-base font-black text-white">{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">Challenge Brief</h3>
                <p className="leading-relaxed bg-[#070B1E] p-3 rounded-xl border border-white/5">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1.5">Required Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.techStack.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-[#141C48] text-cyan-300 border border-[#232F6E] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                <span className="font-bold text-purple-300 block mb-1">Blockchain Passport Verification:</span>
                <p className="text-slate-300">
                  Submitting and passing the review ledger awards +{selectedProject.experienceScore} Experience Score verified directly by {selectedProject.sponsorCompany}.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182352]">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-xl bg-[#141C48] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const p = selectedProject;
                  setSelectedProject(null);
                  setSubmittingProject(p);
                }}
                className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow cursor-pointer"
              >
                Submit Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {submittingProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1033] border border-[#1E2B68] rounded-2xl p-6 space-y-5 shadow-2xl animate-scale-in">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#182352]">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Milestone Submission</span>
                <h2 className="text-base font-black text-white">{submittingProject.title}</h2>
              </div>
              <button
                onClick={() => setSubmittingProject(null)}
                className="p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitMilestone} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white block mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">Live Demo / Deployed URL (Optional)</label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  placeholder="https://project-demo.run.app"
                  className="w-full px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">Architecture & Key Implementation Highlights</label>
                <textarea
                  rows={3}
                  value={architectureNote}
                  onChange={(e) => setArchitectureNote(e.target.value)}
                  placeholder="Describe your design choices, test cases, and benchmarks..."
                  className="w-full p-3 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182352]">
                <button
                  type="button"
                  onClick={() => setSubmittingProject(null)}
                  className="px-4 py-2 rounded-xl bg-[#141C48] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Verifying Code...' : 'Submit to Sponsor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {successSubmitted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Milestone Submitted Successfully!</p>
              <p className="text-[11px] text-emerald-300">Your solution for "{successSubmitted}" is now queued for sponsor code review and bounty payout.</p>
            </div>
          </div>
          <button
            onClick={() => setSuccessSubmitted(null)}
            className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
