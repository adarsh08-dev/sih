import React, { useState, useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  BookOpen,
  Award,
  Sparkles,
  DollarSign,
  Users,
  Handshake,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Lightbulb,
  ExternalLink,
  Target,
  FileSpreadsheet
} from 'lucide-react';
import {
  getAcademicIntelligenceMetrics,
  getStoredResearchCollaborations,
  getStoredFacultyCollaborations
} from '../data/facultyCollaborationData';
import { AcademicRecommendation } from '../types';

interface AcademicIntelligenceViewProps {
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateTab?: (tab: string) => void;
}

export const AcademicIntelligenceView: React.FC<AcademicIntelligenceViewProps> = ({
  onShowToast = () => {},
  onNavigateTab = () => {}
}) => {
  const metrics = useMemo(() => getAcademicIntelligenceMetrics(), []);
  const [activeTrendMetric, setActiveTrendMetric] = useState<'count' | 'citations' | 'impactFactorAvg'>('count');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const [dismissedRecs, setDismissedRecs] = useState<string[]>([]);

  // Filter recommendations
  const activeRecommendations = useMemo(() => {
    return metrics.recommendations.filter(r => !dismissedRecs.includes(r.id));
  }, [metrics.recommendations, dismissedRecs]);

  // Max value calculation for 5-year trend chart
  const maxTrendVal = useMemo(() => {
    const vals = metrics.publicationTrend.map(item => item[activeTrendMetric]);
    return Math.max(...vals, 1);
  }, [metrics.publicationTrend, activeTrendMetric]);

  // Handle recommendation action
  const handleRecAction = (rec: AcademicRecommendation) => {
    onShowToast(`Triggered action: "${rec.actionLabel}" for "${rec.title}"!`, 'success');
  };

  // Dismiss recommendation
  const handleDismissRec = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedRecs(prev => [...prev, id]);
    onShowToast('Insight recommendation acknowledged and archived.', 'info');
  };

  // Export full Intelligence Dossier
  const handleExportDossier = () => {
    onShowToast('Generated NAAC & NIRF Criterion 3 Academic Intelligence Report (PDF)!', 'success');
  };

  // Donut chart stroke calculations
  const donutRadius = 40;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedPercent = 0;

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[11px] font-bold tracking-wide uppercase mb-2">
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              <span>Intelligence · Faculty Performance & Research Analytics</span>
            </div>
            <h2 className="text-2xl font-black text-white">Academic Intelligence Engine</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Real-time analytics on Scopus/IEEE publications, citation trajectories, h-index benchmarks, sponsored research grants, and AI-driven growth pathways.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportDossier}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#818CF8] hover:to-[#6366F1] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export NAAC Intelligence Report</span>
            </button>
          </div>
        </div>

        {/* 6 Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Publications</span>
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-xl font-black text-white">{metrics.totalPublications}</div>
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+11 in 2026</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">h-index / i10</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-black text-amber-300">
              {metrics.hIndex} <span className="text-xs text-slate-400 font-normal">/ {metrics.i10Index}</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Top 5% Faculty Tier</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Citations</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-black text-cyan-300">{metrics.totalCitations.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Scopus & Google Scholar</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Grants</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-black text-emerald-300">{metrics.activeGrants}</div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">{metrics.grantValueFormatted}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Students Supervised</span>
              <Users className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-xl font-black text-purple-300">{metrics.studentsSupervised}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{metrics.phdScholarsCount} Ph.D. Scholars</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090E2C]/80 border border-[#1E2B68]">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Collaborations</span>
              <Handshake className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-black text-blue-300">{metrics.ongoingCollaborations}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{metrics.patentsPublished} Patents Filed</div>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid: 5-Year Trend Chart + Domain Distribution Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 5-Year Publication & Citation Trend Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">5-Year Publication & Impact Trajectory</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Annual peer-reviewed Scopus/SCI indexing performance (2022 – 2026)
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#090E2C] border border-[#233175] text-xs">
              <button
                onClick={() => setActiveTrendMetric('count')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTrendMetric === 'count'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Papers
              </button>
              <button
                onClick={() => setActiveTrendMetric('citations')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTrendMetric === 'citations'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Citations
              </button>
              <button
                onClick={() => setActiveTrendMetric('impactFactorAvg')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activeTrendMetric === 'impactFactorAvg'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Avg Impact Factor
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="h-60 pt-6 pb-2 px-2 flex items-end justify-between gap-3 relative border-b border-[#1E2B68]">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-indigo-400 w-full" />
              <div className="border-b border-indigo-400 w-full" />
              <div className="border-b border-indigo-400 w-full" />
              <div className="border-b border-indigo-400 w-full" />
            </div>

            {metrics.publicationTrend.map((item) => {
              const val = item[activeTrendMetric];
              const heightPercent = Math.max(15, Math.round((val / maxTrendVal) * 100));
              const isHovered = hoveredYear === item.year;

              return (
                <div
                  key={item.year}
                  onMouseEnter={() => setHoveredYear(item.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                >
                  {/* Floating Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-14 z-20 px-3 py-1.5 rounded-xl bg-[#090E2C] border border-indigo-400 text-[11px] text-white shadow-xl whitespace-nowrap animate-fade-in pointer-events-none">
                      <div className="font-extrabold text-indigo-300">{item.year} Summary</div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span>{item.count} Papers</span>
                        <span>•</span>
                        <span>{item.citations} Citations</span>
                        <span>•</span>
                        <span>IF: {item.impactFactorAvg}</span>
                      </div>
                    </div>
                  )}

                  {/* Value Label above bar */}
                  <span className={`text-[11px] font-extrabold mb-1.5 transition-colors ${
                    isHovered ? 'text-indigo-300 scale-110' : 'text-slate-400'
                  }`}>
                    {activeTrendMetric === 'impactFactorAvg' ? `${val} IF` : val}
                  </span>

                  {/* Bar Element */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[56px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${
                      isHovered
                        ? 'bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-lg shadow-indigo-600/40'
                        : 'bg-gradient-to-t from-[#1C2760] via-[#2A3B8C] to-[#4F46E5]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* X-axis Year Label */}
                  <span className="text-xs font-bold text-slate-300 mt-2">
                    {item.year}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footnote Details */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                <span>Indexed Journals (SCI / Scopus Q1 & Q2)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" />
                <span>IEEE Transactions & Conferences</span>
              </span>
            </div>
            <div className="text-indigo-300 font-semibold">
              Average Citation Growth: +24% YoY
            </div>
          </div>
        </div>

        {/* Right Col: Research Domain Distribution (Interactive Donut) */}
        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Research Domain Distribution</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Portfolio split across academic disciplines
            </p>
          </div>

          {/* Donut Chart Display */}
          <div className="flex flex-col items-center justify-center my-auto py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={donutRadius}
                  stroke="#141C48"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* Slices */}
                {metrics.domainDistribution.map((item) => {
                  const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * donutCircumference);
                  accumulatedPercent += item.percentage;
                  const isHovered = hoveredDomain === item.domain;

                  return (
                    <circle
                      key={item.domain}
                      cx="50"
                      cy="50"
                      r={donutRadius}
                      stroke={item.color}
                      strokeWidth={isHovered ? '15' : '12'}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      fill="transparent"
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredDomain(item.domain)}
                      onMouseLeave={() => setHoveredDomain(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Stat */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">46</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Publications</span>
              </div>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2">
            {metrics.domainDistribution.map((item) => {
              const isHovered = hoveredDomain === item.domain;

              return (
                <div
                  key={item.domain}
                  onMouseEnter={() => setHoveredDomain(item.domain)}
                  onMouseLeave={() => setHoveredDomain(null)}
                  className={`p-2 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer ${
                    isHovered ? 'bg-[#141C48] border border-indigo-500/40' : 'bg-[#090E2C] border border-[#1E2964]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-slate-200">{item.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{item.count} papers</span>
                    <span className="font-extrabold text-white">{item.percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10173F] to-[#0A0F2E] border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
              <Lightbulb className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>AI Strategic Academic Recommendations</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Adaptive
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Actionable interventions generated based on your citations, ongoing grants, and research domain trajectory.
              </p>
            </div>
          </div>
        </div>

        {/* List of Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {activeRecommendations.map(rec => {
            const isHigh = rec.urgency === 'High';
            const isMedium = rec.urgency === 'Medium';

            return (
              <div
                key={rec.id}
                className="p-4 rounded-xl bg-[#090E2C]/90 border border-[#1E2B68] hover:border-[#37459C] transition-all flex flex-col justify-between space-y-3 relative group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-950/60 text-indigo-300 border border-indigo-700/40">
                      {rec.category}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      isHigh ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      isMedium ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {rec.urgency} Impact
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1C2760] space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Projected Impact: {rec.metricImpact}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleRecAction(rec)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-colors"
                    >
                      <span>{rec.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDismissRec(rec.id, e)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
