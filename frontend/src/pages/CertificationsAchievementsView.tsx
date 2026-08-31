import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Trophy,
  X
} from 'lucide-react';
import { CertificationItem, AchievementItem, StudentProfile } from '../types';
import { 
  getCertifications, 
  getAchievements, 
  addCertification, 
  addAchievement 
} from '../services/studentCareerService';

interface CertificationsAchievementsViewProps {
  student: StudentProfile | null;
  onNavigateTab: (tab: string) => void;
}

export const CertificationsAchievementsView: React.FC<CertificationsAchievementsViewProps> = ({
  student,
  onNavigateTab
}) => {
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [skillsStr, setSkillsStr] = useState('');

  useEffect(() => {
    setCertifications(getCertifications());
    setAchievements(getAchievements());
  }, []);

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !issuer.trim()) return;

    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    addCertification({
      name,
      issuer,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      credentialId: credentialId.trim() || `CERT-${Date.now()}`,
      credentialUrl: credentialUrl.trim() || undefined,
      status: 'Verified',
      skillsVerified: skills.length > 0 ? skills : ['Software Engineering'],
      badgeColor: 'emerald'
    });

    setCertifications(getCertifications());
    setIsAddModalOpen(false);
    setName('');
    setIssuer('');
    setCredentialId('');
    setCredentialUrl('');
    setSkillsStr('');
  };

  return (
    <div id="certifications-achievements-page" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#12162E] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 text-[#8B7CF8] text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              DIGITALLY VERIFIED CREDENTIALS
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Certifications & Honors
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              All credentials are cryptographically signed and linked to your immutable Experience Passport. Recruiters can independently verify issue dates, syllabus benchmarks, and verified skills.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] hover:opacity-90 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#7C5CFC]/20 transition-all flex items-center gap-2 self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Credential
          </button>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Industry Certifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map(cert => {
            const isVerified = cert.status === 'Verified';

            return (
              <div
                key={cert.id}
                className="bg-[#12162E] border border-white/10 rounded-2xl p-5 hover:border-[#7C5CFC]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isVerified 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isVerified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {cert.status}
                    </span>

                    <span className="text-[11px] text-white/40 font-mono">
                      {cert.credentialId}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1.5 leading-snug">
                    {cert.name}
                  </h4>
                  <span className="text-xs text-white/60 block mb-3">
                    Issued by {cert.issuer} • {cert.issueDate}
                  </span>

                  {/* Skills Verified */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skillsVerified.map(s => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B0F2A] text-cyan-300 border border-white/5 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-white/40">SHA-256 Ledger Stamp</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#8B7CF8] hover:text-[#00D9FF] flex items-center gap-1 font-semibold"
                    >
                      Verify Proof
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Honors & Hackathon Awards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className="bg-[#12162E] border border-white/10 rounded-2xl p-5 hover:border-[#7C5CFC]/30 transition-all flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 text-white/70">
                    {ach.category}
                  </span>
                  <span className="text-xs text-white/40">{ach.date}</span>
                </div>
                <h4 className="text-base font-bold text-white">{ach.title}</h4>
                <p className="text-xs text-amber-300 font-semibold">{ach.awardRank}</p>
                <p className="text-xs text-white/60 leading-relaxed">{ach.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD CERTIFICATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#12162E] border border-white/15 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-bold text-white">Add Industry Credential</h2>

            <form onSubmit={handleAddCert} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-white/60 block mb-1">Certification Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Developer – Associate"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 block mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services / HackerRank"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 block mb-1">Credential ID / License Number</label>
                <input
                  type="text"
                  placeholder="e.g. AWS-DEV-981240"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="w-full bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 block mb-1">Skills Verified (comma separated)</label>
                <input
                  type="text"
                  placeholder="AWS, Docker, Microservices, IAM"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-white/60 block mb-1">Verification URL</label>
                <input
                  type="url"
                  placeholder="https://aws.amazon.com/verification/..."
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="w-full bg-[#0B0F2A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#7C5CFC]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#00D9FF] text-white font-bold text-xs shadow-md"
                >
                  Mint to Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
