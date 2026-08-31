import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  Github, 
  Linkedin, 
  Globe, 
  Briefcase,
  Sparkles,
  Edit
} from 'lucide-react';
import { StudentProfile } from '../types';
import { 
  getStudentSkills, 
  getProjects, 
  getCertifications, 
  calculateReadinessMetrics 
} from '../services/studentCareerService';

interface ResumePortfolioViewProps {
  student: StudentProfile | null;
  onOpenProfile: () => void;
}

export const ResumePortfolioView: React.FC<ResumePortfolioViewProps> = ({
  student,
  onOpenProfile
}) => {
  const [copied, setCopied] = useState(false);
  const skills = getStudentSkills();
  const projects = getProjects();
  const certs = getCertifications();
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

  return (
    <div id="resume-portfolio-page" className="max-w-4xl mx-auto space-y-6">
      {/* Action Bar Header */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-[#8B7CF8] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            ATS-VERIFIED DIGITAL RESUME
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Digital Resume & Verified Portfolio
          </h1>
          <p className="text-xs text-white/60">
            Cryptographically signed snapshot ready for direct submission to corporate recruiters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenProfile}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-[#0B0F2A] border border-white/15 hover:border-white/30 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#00D9FF]" />}
            {copied ? 'Link Copied!' : 'Share Portfolio'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] hover:opacity-90 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Download / Print PDF
          </button>
        </div>
      </div>

      {/* ATS Printable Resume Sheet */}
      <div className="bg-white text-gray-900 rounded-2xl p-8 sm:p-10 shadow-2xl border border-gray-200 space-y-6 font-sans">
        {/* Resume Header */}
        <div className="border-b border-gray-300 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {student?.name || 'Adarsh Pratap Singh'}
              </h2>
              <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                {student?.targetRole || 'Full-Stack Software Engineer'} • {student?.course || 'B.Tech CSIT (2025-29)'}
              </p>
              <p className="text-xs text-gray-600">
                {student?.college || 'Mahatma Jyotiba Phule Rohilkhand University, Bareilly'}
              </p>
            </div>

            <div className="text-xs text-gray-600 space-y-1 sm:text-right">
              <div>{student?.email || 'adarsh.pratap@mjpru.ac.in'}</div>
              <div className="flex items-center sm:justify-end gap-2 text-indigo-600 font-medium">
                <span>github.com/adarsh-pratap</span>
                <span>•</span>
                <span>linkedin.com/in/adarsh-pratap</span>
              </div>
              <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                Skill DNA: 84/100 • Readiness: {readiness.industryReadiness}%
              </div>
            </div>
          </div>
        </div>

        {/* Technical Skills Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
            Technical Competencies & Verified Proficiency
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 text-xs">
            <div>
              <span className="font-bold text-gray-800">Core Languages: </span>
              <span className="text-gray-700">Python (Level 5, 94%), JavaScript/TypeScript, SQL, C++</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">Frameworks & Web: </span>
              <span className="text-gray-700">React 18, Node.js, Express, Tailwind CSS, REST APIs</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">Databases & Infrastructure: </span>
              <span className="text-gray-700">PostgreSQL (Level 4, 86%), Redis, Docker, Git CI/CD</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">Soft Skills: </span>
              <span className="text-gray-700">Problem Solving (88%), Team Collaboration, RFC Writing</span>
            </div>
          </div>
        </div>

        {/* Experience & Micro-Internships */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
            Industry Experience & Micro-Gigs (Verified via SkillBridge Ledger)
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>CloudSphere Systems — Micro-Internship Fellow</span>
                <span className="text-gray-500 font-normal">August 2026</span>
              </div>
              <div className="text-indigo-700 font-medium text-[11px]">
                Project: JWT Authentication & Redis Blacklisting Security Architecture
              </div>
              <ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">
                <li>Engineered zero-trust Express middleware checking revoked JWTs against Redis clusters with sub-millisecond overhead.</li>
                <li>Achieved 100% automated test coverage across authentication, authorization, and logout flows.</li>
                <li>Awarded ₹2,500 stipend and cryptographically signed SHA-256 Experience Passport credential.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
            Featured Engineering Projects & Challenges
          </h3>

          <div className="space-y-3 text-xs">
            {projects.slice(0, 2).map(p => (
              <div key={p.id}>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{p.title}</span>
                  <span className="text-gray-500 font-normal">{p.duration}</span>
                </div>
                <div className="text-gray-600 text-[11px]">
                  Technologies: {p.requiredSkills.join(', ')}
                </div>
                <p className="text-gray-700 mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Honors */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-1">
            Verified Certifications & Honors
          </h3>
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            {certs.map(c => (
              <li key={c.id}>
                <span className="font-semibold text-gray-900">{c.name}</span> — {c.issuer} ({c.credentialId})
              </li>
            ))}
            <li>
              <span className="font-semibold text-gray-900">Smart India Hackathon (SIH 2026) Finalist</span> — Ministry of Education & AICTE
            </li>
          </ul>
        </div>

        {/* Verification Footnote */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically Verified via SkillBridge Ledger • SHA-256 Hash: 98a3f...d7c</span>
          </div>
          <span>Generated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
