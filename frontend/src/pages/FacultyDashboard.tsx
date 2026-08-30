import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  Download,
  Share2,
  BookOpen,
  Calendar,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { COLLEGES_LIST } from '../data/colleges';

interface FacultyDashboardProps {
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'mou' | 'curriculum' | 'facultyswap'>('analytics');
  
  // MoU Generator State
  const [selectedPartner, setSelectedPartner] = useState('Tata Consultancy Services');
  const [selectedCollege, setSelectedCollege] = useState('Mahatma Jyotiba Phule Rohilkhand University, Bareilly');
  const [mouCohortSize, setMouCohortSize] = useState('120 Candidates');
  const [mouGenerated, setMouGenerated] = useState(false);

  // Curriculum Copilot State
  const [syllabusCourse, setSyllabusCourse] = useState('CSIT 602: Database Management Systems');
  const [curriculumRecommendations, setCurriculumRecommendations] = useState([
    {
      currentTopic: 'Traditional SQL Normalization (3NF/BCNF)',
      industryDeficit: 'Cloud Multi-region Postgres Sharding & Vector Indexing',
      recommendedFix: 'Inject 2-week pgvector & Read-Replica sandbox module',
      impactScore: '+24% Placement Alignment'
    },
    {
      currentTopic: 'Monolithic Client-Server Architecture',
      industryDeficit: 'gRPC & Event-Driven Microservices with Kafka',
      recommendedFix: 'Add micro-internship task on distributed event bus',
      impactScore: '+31% Placement Alignment'
    }
  ]);

  const handleGenerateMoU = () => {
    setMouGenerated(true);
    onShowToast(`Smart MoU Draft generated for ${selectedPartner}!`, 'success');
  };

  const handleExportNaac = () => {
    onShowToast('NAAC Criterion 1 & 2 Institutional Skill Passport Report exported (PDF/JSON)!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141C48] via-[#10173F] to-[#0A0F2E] border border-[#1E2B68] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wide uppercase mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Institutional Governance Console · HOD / Dean</span>
          </div>
          <h1 className="text-2xl font-black text-white">Dr. Arvind K. Sharma</h1>
          <p className="text-xs text-slate-300">
            Head of Department · Computer Science & Information Technology · MJPRU Bareilly
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportNaac}
            className="px-4 py-2 rounded-xl bg-[#182358] hover:bg-[#202E72] border border-[#2B3B8A] text-slate-100 text-xs font-bold flex items-center gap-2 transition-all shadow"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>NAAC Accreditation Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#18214D] pb-3 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Cohort Placement AI Diagnostics' },
          { id: 'mou', label: 'Automated Industry MoU Generator' },
          { id: 'curriculum', label: 'Curriculum AI Gap Copilot' },
          { id: 'facultyswap', label: 'Faculty & Mentor Swap Program' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#7C5CFC] text-white shadow-md'
                : 'bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. COHORT ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">Total Enrolled Batch</span>
              <div className="text-2xl font-black text-white mt-1">240 Students</div>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Onboarded on Portal</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">Verified Ready Candidates</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">68% (163 Students)</div>
              <span className="text-[10px] text-slate-400 font-semibold">Passport Score ≥ 70</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1538] border border-rose-500/40 bg-rose-950/10">
              <span className="text-[10.5px] font-bold text-rose-300 uppercase">At-Risk Cohort Cluster</span>
              <div className="text-2xl font-black text-rose-400 mt-1">32% (77 Students)</div>
              <span className="text-[10px] text-rose-300 font-semibold">Deficit: Backend & Systems</span>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase">Average PPO Offer Trajectory</span>
              <div className="text-2xl font-black text-[#A78BFA] mt-1">₹11.8 LPA</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+34% vs Previous Year</span>
            </div>
          </div>

          {/* At-Risk Isolation Plan */}
          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">32% Unplaced Student Cluster Remediation</h3>
                  <p className="text-xs text-slate-300">Targeted micro-internship assignments to close the systems design gap before campus drives.</p>
                </div>
              </div>
              <button
                onClick={() => onShowToast('Automated remedial micro-tasks dispatched to 77 at-risk students!', 'success')}
                className="px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow"
              >
                Dispatch Remediation Sprint
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0B1033] border border-[#1A2352]">
                <p className="text-xs font-bold text-white mb-1">Intervention 1: Zero-NDA Sandbox</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Assign 3 Express & SQL unit test simulators to boost foundational test-driven code skills.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1033] border border-[#1A2352]">
                <p className="text-xs font-bold text-white mb-1">Intervention 2: Mandatory Mentor Capsules</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Book two 15-minute 1-on-1 sprint reviews with senior industry architects per candidate.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1033] border border-[#1A2352]">
                <p className="text-xs font-bold text-white mb-1">Intervention 3: Micro-Gig Fast-Track</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">Reserve 50 partner micro-internships exclusively for students under 60 readiness score.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MOU GENERATOR TAB */}
      {activeTab === 'mou' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-extrabold text-white">Smart Memorandum of Understanding (MoU) Generator</h3>
            </div>
            <p className="text-xs text-slate-300 mb-6">
              Generate AI-drafted legal MoUs with partner enterprises, specifying micro-internship quotas, stipend guarantees, and faculty exchange clauses.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Corporate Partner</label>
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full bg-[#0B1033] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                >
                  <option value="Tata Consultancy Services">Tata Consultancy Services</option>
                  <option value="Infosys Springboard">Infosys Springboard</option>
                  <option value="CloudSphere Systems">CloudSphere Systems</option>
                  <option value="Wipro Digital Next">Wipro Digital Next</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Institution</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="w-full bg-[#0B1033] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                >
                  {COLLEGES_LIST.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Cohort Allocation</label>
                <input
                  type="text"
                  value={mouCohortSize}
                  onChange={(e) => setMouCohortSize(e.target.value)}
                  className="w-full bg-[#0B1033] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2.5 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateMoU}
              className="px-5 py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Smart MoU Agreement</span>
            </button>

            {mouGenerated && (
              <div className="mt-6 p-5 rounded-xl bg-[#090E2A] border border-[#1E2964] space-y-3 font-mono text-xs text-slate-300 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#18214D] pb-2 font-sans">
                  <span className="font-bold text-emerald-400">✓ DRAFT MOU AGREEMENT READY FOR DIGITAL SIGNATURE</span>
                  <button
                    onClick={() => onShowToast('MoU Contract downloaded as PDF!', 'success')}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[11px] font-bold"
                  >
                    Download PDF
                  </button>
                </div>
                <p><strong>PARTIES:</strong> {selectedCollege} & {selectedPartner}</p>
                <p><strong>PURPOSE:</strong> Institutional deployment of SkillBridge AI micro-internships & 15-minute mentor capsules for {mouCohortSize}.</p>
                <p><strong>PROVISIONS:</strong> Zero-NDA ghost task simulations, cryptographic experience passport accreditation, and pre-placement recruitment fast-track.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CURRICULUM COPILOT TAB */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-extrabold text-white">Curriculum AI Real-Time Industry Sync</h3>
            </div>
            <p className="text-xs text-slate-300 mb-6">
              AI compares syllabus units against 10,000+ live 2026 tech job postings to generate actionable syllabus upgrade recommendations.
            </p>

            <div className="space-y-4">
              {curriculumRecommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rec.currentTopic}</span>
                      <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">Gap Isolated</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Industry Reality: <strong className="text-cyan-300">{rec.industryDeficit}</strong></p>
                    <p className="text-xs text-emerald-300">💡 <strong>Remediation:</strong> {rec.recommendedFix}</p>
                  </div>

                  <span className="text-xs font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl whitespace-nowrap">
                    {rec.impactScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. FACULTY SWAP TAB */}
      {activeTab === 'facultyswap' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <h3 className="text-sm font-bold text-white mb-2">Inbound Industry Guest Chairs</h3>
            <p className="text-xs text-slate-300 mb-4">Senior tech leads available to teach weekend specialized modules at MJPRU Bareilly.</p>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-[#0B1033] border border-[#1A2352] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Amit Verma (TCS)</p>
                  <p className="text-[11px] text-slate-400">Topic: Distributed Cloud Architectures</p>
                </div>
                <button 
                  onClick={() => onShowToast('Guest Lecture scheduled for Oct 12!', 'success')}
                  className="px-2.5 py-1 rounded bg-[#7C5CFC] text-white text-[11px] font-bold"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <h3 className="text-sm font-bold text-white mb-2">Faculty Sabbatical & Immersion</h3>
            <p className="text-xs text-slate-300 mb-4">Short 2-week industry immersion tracks for university professors at partner labs.</p>
            <div className="p-3 rounded-lg bg-[#0B1033] border border-[#1A2352]">
              <p className="text-xs font-bold text-white">Infosys Springboard AI Lab Immersion</p>
              <p className="text-[11px] text-slate-400 mt-1">2 seats reserved for Bareilly CSIT faculty · Q4 2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
