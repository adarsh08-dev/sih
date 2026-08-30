import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Code,
  Layers
} from 'lucide-react';

interface SkillIntelligenceProps {
  onNavigateToGigs: () => void;
}

export const SkillIntelligenceView: React.FC<SkillIntelligenceProps> = ({ onNavigateToGigs }) => {
  const [selectedDomain, setSelectedDomain] = useState<'backend' | 'cloud' | 'frontend' | 'ai'>('backend');

  const skillsData = [
    {
      name: 'Backend Architecture',
      category: 'backend',
      currentScore: 42,
      targetScore: 92,
      severity: 'Critical Gap',
      severityColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      actionTitle: 'Build Authenticated REST Microservices',
      courseRecommendation: 'Design Patterns & Distributed Systems Capsule'
    },
    {
      name: 'REST API & JWT Security',
      category: 'backend',
      currentScore: 55,
      targetScore: 86,
      severity: 'High Gap',
      severityColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      actionTitle: 'Complete Token Blacklisting Middleware',
      courseRecommendation: 'Zero-Leak JWT Middleware Sandbox'
    },
    {
      name: 'PostgreSQL Query Optimization',
      category: 'backend',
      currentScore: 61,
      targetScore: 88,
      severity: 'Medium Gap',
      severityColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      actionTitle: 'Index Optimization on Cohort Tables',
      courseRecommendation: 'Database Internals Masterclass'
    },
    {
      name: 'Containerization & Docker',
      category: 'cloud',
      currentScore: 57,
      targetScore: 78,
      severity: 'Medium Gap',
      severityColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      actionTitle: 'Multi-stage Dockerfile Packaging',
      courseRecommendation: 'Cloud Deployment Capsule'
    },
    {
      name: 'React 18 & State Virtualization',
      category: 'frontend',
      currentScore: 84,
      targetScore: 85,
      severity: 'Mastered',
      severityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      actionTitle: 'Zero-Layout Shift Data Grid',
      courseRecommendation: 'Verified Passport Badge Active'
    },
    {
      name: 'LLM & Gemini API Integration',
      category: 'ai',
      currentScore: 78,
      targetScore: 82,
      severity: 'Mastered',
      severityColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      actionTitle: 'Prompt Chaining & System Diagnostics',
      courseRecommendation: 'GenAI SDK Certification'
    }
  ];

  const filteredSkills = skillsData.filter(s => selectedDomain === 'backend' ? true : s.category === selectedDomain);

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-extrabold text-white">Skill Intelligence & Benchmark Matrix</h1>
          </div>
          <p className="text-xs text-slate-300">
            Real-time telemetry benchmarking your skills against <strong>Tier-1 Software Engineer Job Architectures (2026–27)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDomain('backend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDomain === 'backend' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            All Skills
          </button>
          <button
            onClick={() => setSelectedDomain('cloud')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDomain === 'cloud' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            Cloud / DevOps
          </button>
          <button
            onClick={() => setSelectedDomain('frontend')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDomain === 'frontend' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            Frontend
          </button>
          <button
            onClick={() => setSelectedDomain('ai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDomain === 'ai' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            AI / LLM
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill, idx) => {
          const gapPercentage = Math.max(0, skill.targetScore - skill.currentScore);
          return (
            <div key={idx} className="p-5 rounded-xl bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{skill.name}</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${skill.severityColor}`}>
                    {skill.severity}
                  </span>
                </div>

                <div className="space-y-1.5 my-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Current Score: <strong className="text-white">{skill.currentScore}%</strong></span>
                    <span>Industry Benchmark: <strong className="text-cyan-400">{skill.targetScore}%</strong></span>
                  </div>
                  <div className="w-full bg-[#18214D] h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-cyan-500 h-full rounded-full transition-all"
                      style={{ width: `${skill.currentScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Baseline</span>
                    <span>Gap: {gapPercentage}%</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0B1033] border border-[#1B255C] mt-3">
                  <p className="text-[11px] font-semibold text-slate-300">
                    🎯 <strong className="text-white">Recommended Remediation:</strong> {skill.actionTitle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    📖 {skill.courseRecommendation}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#18214D] flex items-center justify-between">
                <span className="text-[11px] text-[#A78BFA] font-semibold">Earn +{gapPercentage} Readiness Pts</span>
                <button
                  onClick={onNavigateToGigs}
                  className="px-3 py-1.5 rounded-lg bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <span>Solve in Micro-Gig</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
