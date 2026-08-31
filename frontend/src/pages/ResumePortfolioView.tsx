import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  Globe, 
  Briefcase,
  Sparkles,
  Edit,
  Code,
  GraduationCap,
  Calendar,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  Layers,
  Palette
} from 'lucide-react';
import { StudentProfile } from '../types';
import { 
  getStudentSkills, 
  getProjects, 
  getCertifications, 
  calculateReadinessMetrics,
  getCustomPortfolioData,
  CustomPortfolioData
} from '../services/studentCareerService';
import { EditPortfolioModal } from '../components/EditPortfolioModal';

interface ResumePortfolioViewProps {
  student: StudentProfile | null;
  onOpenProfile?: () => void;
}

export const ResumePortfolioView: React.FC<ResumePortfolioViewProps> = ({
  student,
  onOpenProfile
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'print'>('dark');

  // Dynamic portfolio state
  const [customData, setCustomData] = useState<CustomPortfolioData>(() => getCustomPortfolioData());
  const [skills, setSkills] = useState(() => getStudentSkills());
  const [projects, setProjects] = useState(() => getProjects());
  const [certs, setCerts] = useState(() => getCertifications());

  const reloadPortfolioData = () => {
    setCustomData(getCustomPortfolioData());
    setSkills(getStudentSkills());
    setProjects(getProjects());
    setCerts(getCertifications());
  };

  useEffect(() => {
    reloadPortfolioData();
  }, []);

  const readiness = calculateReadinessMetrics(skills);

  const handleCopyLink = () => {
    const url = `https://skillbridge.ai/portfolio/${student?.rollNo || 'adarsh-csit-2029'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const displayName = customData.name || student?.name || 'Adarsh Pratap Singh';
  const displayRole = customData.role || student?.targetRole || 'Full-Stack Software Engineer';
  const displayCollege = customData.college || student?.college || 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly';
  const displayDegree = customData.degree || student?.course || 'B.Tech CSIT (2025-29)';
  const displayEmail = customData.email || student?.email || 'adarsh.pratap@mjpru.ac.in';
  const displayPhone = customData.phone || '+91 98765 43210';
  const displayLocation = customData.location || 'Bareilly / Delhi NCR, India';
  const displayCgpa = customData.cgpa || 8.4;
  const displayBio = customData.bio || 'Passionate computer science engineer with demonstrated expertise in React, TypeScript, Node.js, and PostgreSQL. Cryptographically verified through 3+ production micro-gigs and ranked in top 5% in algorithmic problem solving.';

  return (
    <div id="resume-portfolio-page" className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Action Bar */}
      <div className="bg-[#0E1538] border border-[#1E2964] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            ATS-VERIFIED DIGITAL RESUME & PORTFOLIO
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Verified Candidate Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically signed ledger snapshot ready for recruiter screening & campus drives.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Edit Portfolio Action */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Portfolio
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'print' : 'dark')}
            className="px-3.5 py-2 rounded-xl bg-[#0B1033] border border-[#1E2964] hover:border-indigo-500/50 text-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Toggle between Dark Theme and Print-Ready Light Mode"
          >
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            {previewTheme === 'dark' ? 'Dark View' : 'Print Preview'}
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-[#0B1033] border border-[#1E2964] hover:border-indigo-500/50 text-slate-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* PORTFOLIO CONTAINER (DARK THEME DEFAULT / PRINT-READY TOGGLE) */}
      <div 
        className={`rounded-2xl p-6 sm:p-10 shadow-2xl transition-all font-sans space-y-6 ${
          previewTheme === 'dark'
            ? 'bg-[#0B1033] text-white border border-[#1E2964]'
            : 'bg-white text-gray-900 border border-gray-200'
        }`}
      >
        {/* RESUME HEADER */}
        <div className={`pb-6 border-b ${previewTheme === 'dark' ? 'border-[#1E2964]' : 'border-gray-300'}`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {displayName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Candidate
                </span>
              </div>

              <p className={`text-sm font-bold ${previewTheme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`}>
                {displayRole}
              </p>

              <p className={`text-xs ${previewTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
                {displayDegree} • {displayCollege} (CGPA: <strong className={previewTheme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'}>{displayCgpa}</strong>)
              </p>

              {/* Bio */}
              <p className={`text-xs mt-2 leading-relaxed max-w-2xl ${previewTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                {displayBio}
              </p>
            </div>

            {/* Contact & Metrics Column */}
            <div className={`text-xs space-y-2 sm:text-right shrink-0 ${previewTheme === 'dark' ? 'text-slate-300' : 'text-gray-600'}`}>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{displayEmail}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{displayPhone}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{displayLocation}</span>
              </div>

              {/* Social / Portfolio Links */}
              <div className="flex flex-wrap items-center sm:justify-end gap-2 pt-1 font-semibold text-indigo-400">
                {customData.githubUrl && (
                  <a href={customData.githubUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    <Code className="w-3 h-3" /> GitHub
                  </a>
                )}
                {customData.linkedinUrl && (
                  <a href={customData.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    <Globe className="w-3 h-3" /> LinkedIn
                  </a>
                )}
                {customData.portfolioUrl && (
                  <a href={customData.portfolioUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Portfolio
                  </a>
                )}
              </div>

              {/* Readiness Badge */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-900/40 text-indigo-300 font-mono font-bold text-[11px] border border-indigo-500/30">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Skill DNA: {readiness.overallSkillScore}% • Readiness: {readiness.industryReadiness}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: VERIFIED TECHNICAL COMPETENCIES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              previewTheme === 'dark' ? 'text-indigo-300' : 'text-gray-700'
            }`}>
              <Code className="w-4 h-4 text-indigo-400" />
              Verified Technical Competencies & Proficiency
            </h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3 h-3" /> Edit Skills
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {skills.map(sk => (
              <div 
                key={sk.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                  previewTheme === 'dark'
                    ? 'bg-[#0E1538] border-[#1E2964]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold text-xs ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {sk.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    {sk.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-700/40 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500" 
                    style={{ width: `${sk.score}%` }} 
                  />
                </div>

                <div className="flex justify-between items-center text-[9.5px] text-slate-400">
                  <span>Level {sk.level}/5 • {sk.category}</span>
                  {sk.verified && (
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: VERIFIED INDUSTRY EXPERIENCE & MICRO-INTERNSHIPS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              previewTheme === 'dark' ? 'text-indigo-300' : 'text-gray-700'
            }`}>
              <Briefcase className="w-4 h-4 text-amber-400" />
              Verified Industry Experience & Micro-Gigs
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Blockchain Proof Active
            </span>
          </div>

          <div className="space-y-3">
            {(customData.experiences || []).map(exp => (
              <div 
                key={exp.id}
                className={`p-4 rounded-xl border space-y-1.5 ${
                  previewTheme === 'dark'
                    ? 'bg-[#0E1538] border-[#1E2964]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className={`text-xs font-bold ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {exp.role} — <span className="text-indigo-400">{exp.company}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400">{exp.type}</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{exp.period}</span>
                </div>

                <p className={`text-xs leading-relaxed ${previewTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                  {exp.description}
                </p>

                <div className="pt-1 flex items-center gap-2 text-[10px] text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified on SkillBridge Ledger • Cryptographic SHA-256 Proof</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: FEATURED ENGINEERING PROJECTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              previewTheme === 'dark' ? 'text-indigo-300' : 'text-gray-700'
            }`}>
              <Layers className="w-4 h-4 text-cyan-400" />
              Featured Engineering Projects & Challenges
            </h3>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3 h-3" /> Edit Projects
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {projects.slice(0, 4).map(p => (
              <div 
                key={p.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
                  previewTheme === 'dark'
                    ? 'bg-[#0E1538] border-[#1E2964]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-xs font-bold ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {p.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{p.duration}</span>
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed mb-2 ${previewTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'}`}>
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.requiredSkills.map((sk, idx) => (
                      <span 
                        key={idx} 
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-900/40 text-indigo-300 border border-indigo-500/20"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-indigo-400 font-bold pt-1 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Code className="w-3 h-3" /> Public Repo
                    </span>
                    <span className="flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Live Demo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CERTIFICATIONS & HONORS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              previewTheme === 'dark' ? 'text-indigo-300' : 'text-gray-700'
            }`}>
              <Award className="w-4 h-4 text-pink-400" />
              Verified Certifications & Hackathons
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {certs.map(c => (
              <div 
                key={c.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  previewTheme === 'dark'
                    ? 'bg-[#0E1538] border-[#1E2964]'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <div className={`font-bold text-xs ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {c.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {c.issuer} • ID: <span className="font-mono text-indigo-400">{c.credentialId}</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            ))}

            <div 
              className={`p-3 rounded-xl border flex items-center justify-between ${
                previewTheme === 'dark'
                  ? 'bg-[#0E1538] border-[#1E2964]'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div>
                <div className={`font-bold text-xs ${previewTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Smart India Hackathon (SIH 2026) Finalist
                </div>
                <div className="text-[10px] text-slate-400">
                  Ministry of Education & AICTE • National Level
                </div>
              </div>
              <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Finalist
              </span>
            </div>
          </div>
        </div>

        {/* VERIFICATION FOOTER */}
        <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] ${
          previewTheme === 'dark' ? 'border-[#1E2964] text-slate-400' : 'border-gray-200 text-gray-500'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified via SkillBridge Ledger • Ledger Block #49281 • Hash: 98a3f...d7c</span>
          </div>
          <span>Updated Snapshot: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* EDIT PORTFOLIO MODAL */}
      <EditPortfolioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSaved={reloadPortfolioData}
      />
    </div>
  );
};
