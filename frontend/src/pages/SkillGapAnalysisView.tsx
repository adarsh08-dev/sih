import React, { useState } from 'react';
import { 
  BarChart2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Award, 
  Users, 
  Code, 
  Sparkles, 
  Filter,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { StudentProfile, SkillGapItem } from '../types';
import { getSkillGaps } from '../services/studentCareerService';

interface SkillGapAnalysisViewProps {
  student: StudentProfile | null;
  onNavigateTab: (tab: string) => void;
  onBookMentor?: (topic: string) => void;
}

export const SkillGapAnalysisView: React.FC<SkillGapAnalysisViewProps> = ({
  student,
  onNavigateTab,
  onBookMentor
}) => {
  const skillGaps = getSkillGaps();
  const [selectedRole, setSelectedRole] = useState<string>('Full-Stack Software Engineer');
  const [filterCategory, setFilterCategory] = useState<'all' | 'critical' | 'technical' | 'soft'>('all');

  const filteredGaps = skillGaps.filter(item => {
    if (filterCategory === 'critical') return item.gapStatus === 'Critical Gap' || item.gapStatus === 'Moderate Gap';
    if (filterCategory === 'technical') return item.category === 'technical';
    if (filterCategory === 'soft') return item.category === 'soft';
    return true;
  });

  const criticalGapsCount = skillGaps.filter(s => s.gapStatus === 'Critical Gap').length;
  const moderateGapsCount = skillGaps.filter(s => s.gapStatus === 'Moderate Gap').length;
  const masteredCount = skillGaps.filter(s => s.gapStatus === 'Mastered').length;

  return (
    <div id="skill-gap-analysis-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-[#8B7CF8] text-xs font-semibold mb-3">
              <BarChart2 className="w-3.5 h-3.5" />
              INDUSTRY BENCHMARK MATRICES
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Skill Gap & Industry Readiness Analysis
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Comparison of your current verified skill proficiencies against real-world Tier-1 company hiring benchmarks for top tech roles. Follow the customized remediation pathways to bridge critical gaps before campus recruitment drives.
            </p>
          </div>

          {/* Role selector card */}
          <div className="bg-[#0B0F2A] border border-white/10 rounded-xl p-4 shrink-0 min-w-[240px]">
            <label className="text-xs text-white/50 block font-medium mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#8B7CF8]" />
              Target Benchmark Role:
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#12162E] border border-white/15 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#7C5CFC]"
            >
              <option value="Full-Stack Software Engineer">Full-Stack Software Engineer (14.5 LPA)</option>
              <option value="Cloud Backend & DevOps Engineer">Cloud Backend & DevOps (16.0 LPA)</option>
              <option value="AI / Machine Learning Engineer">AI / ML Engineer (18.0 LPA)</option>
              <option value="Associate Systems Trainee">Enterprise Systems Trainee (9.5 LPA)</option>
            </select>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5">
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Mastered Skills</span>
            <span className="text-xl font-bold text-emerald-400">{masteredCount}</span>
          </div>
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Moderate Gaps</span>
            <span className="text-xl font-bold text-amber-400">{moderateGapsCount}</span>
          </div>
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Critical Gaps</span>
            <span className="text-xl font-bold text-red-400">{criticalGapsCount}</span>
          </div>
          <div className="bg-[#0B0F2A] border border-white/5 rounded-xl p-3 text-center">
            <span className="text-xs text-white/40 block">Career Velocity</span>
            <span className="text-xl font-bold text-cyan-400">+14% / mo</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Skill Benchmarks' },
            { id: 'critical', label: 'Priority Action Gaps' },
            { id: 'technical', label: 'Technical Gaps' },
            { id: 'soft', label: 'Soft Skill Gaps' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id as any)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === tab.id
                  ? 'bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] text-white shadow-md'
                  : 'bg-[#12162E] border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onNavigateTab('assessment')}
          className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-[#8B7CF8]" />
          Take Assessment to Recalculate Gaps
        </button>
      </div>

      {/* Side-by-side Benchmark Matrix */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#8B7CF8]" />
          Skill Proficiency vs. Industry Benchmark Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 text-white/50 uppercase tracking-wider">
              <tr>
                <th className="pb-3 font-semibold">Skill Name</th>
                <th className="pb-3 font-semibold">Domain</th>
                <th className="pb-3 font-semibold">Your Level</th>
                <th className="pb-3 font-semibold">Required Industry Level</th>
                <th className="pb-3 font-semibold">Gap Status</th>
                <th className="pb-3 font-semibold">Placement Impact</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredGaps.map(item => {
                const isCritical = item.gapStatus === 'Critical Gap';
                const isModerate = item.gapStatus === 'Moderate Gap';
                const isMastered = item.gapStatus === 'Mastered';

                return (
                  <tr key={item.skill} className="text-white/80 hover:bg-white/[0.02]">
                    <td className="py-3.5 font-bold text-white flex items-center gap-2">
                      {isMastered ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCritical ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      {item.skill}
                    </td>
                    <td className="py-3.5 capitalize text-white/60">{item.category}</td>
                    <td className="py-3.5">
                      <span className="font-semibold text-cyan-300">Level {item.currentLevel}</span>
                      <span className="text-white/40 text-[10px] ml-1">({item.currentScore}%)</span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-semibold text-white">Level {item.requiredLevel}</span>
                      <span className="text-white/40 text-[10px] ml-1">({item.requiredScore}%)</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                        isMastered
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isCritical
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {item.gapStatus}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`font-semibold ${
                        item.impactOnPlacement === 'High' ? 'text-red-400' : 'text-white/60'
                      }`}>
                        {item.impactOnPlacement}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {isMastered ? (
                        <span className="text-xs text-emerald-400 font-semibold">Aligned ✓</span>
                      ) : (
                        <button
                          onClick={() => onNavigateTab('learning')}
                          className="px-3 py-1 rounded-lg bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/30 text-[#8B7CF8] font-semibold text-xs transition-all inline-flex items-center gap-1"
                        >
                          Bridge Gap
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* "Improve Your Skills" Action Plan Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            Targeted Skill Improvement Action Plans
          </h3>
          <span className="text-xs text-white/50">
            Personalized based on {student?.name || 'your'} profile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillGaps.filter(g => g.gapStatus !== 'Mastered').map(gap => (
            <div 
              key={gap.skill}
              className="bg-[#12162E] border border-white/10 rounded-2xl p-5 hover:border-[#7C5CFC]/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5 ${
                      gap.gapStatus === 'Critical Gap' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {gap.gapStatus} • Impact: {gap.impactOnPlacement}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {gap.skill}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-white/50 block">Target Gap</span>
                    <span className="text-sm font-bold text-cyan-400">
                      L{gap.currentLevel} → L{gap.requiredLevel}
                    </span>
                  </div>
                </div>

                {/* Recommendations checklist */}
                <div className="space-y-2.5 text-xs text-white/80 mb-4 bg-[#0B0F2A] border border-white/5 rounded-xl p-3.5">
                  {gap.recommendedCourses.length > 0 && (
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-[#8B7CF8] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/40 block text-[10px]">Recommended Course:</span>
                        <span className="font-semibold text-white">{gap.recommendedCourses[0].title}</span>
                        <span className="text-white/50 text-[10px] ml-1">({gap.recommendedCourses[0].duration})</span>
                      </div>
                    </div>
                  )}

                  {gap.recommendedMentorTopic && (
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/40 block text-[10px]">15-Min Mentor Capsule Topic:</span>
                        <span className="font-semibold text-white">{gap.recommendedMentorTopic}</span>
                      </div>
                    </div>
                  )}

                  {gap.recommendedProject && (
                    <div className="flex items-start gap-2">
                      <Code className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-white/40 block text-[10px]">Practice Micro-Project:</span>
                        <span className="font-semibold text-white">{gap.recommendedProject}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => onNavigateTab('learning')}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] hover:opacity-90 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Start Learning Course
                </button>
                <button
                  onClick={() => {
                    if (onBookMentor) onBookMentor(gap.recommendedMentorTopic);
                    else onNavigateTab('mentors');
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  Book Mentor
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
