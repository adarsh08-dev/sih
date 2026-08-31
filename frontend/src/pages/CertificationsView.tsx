import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Building2,
  FileCheck,
  QrCode,
  Share2
} from 'lucide-react';
import { INITIAL_CERTIFICATIONS } from '../data/portalData';
import { CertificationItem } from '../types';

export const CertificationsView: React.FC = () => {
  const [certs, setCerts] = useState<CertificationItem[]>(INITIAL_CERTIFICATIONS);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [credId, setCredId] = useState('');

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: CertificationItem = {
      id: `cert_${Date.now()}`,
      title,
      issuer,
      issueDate: date || 'Aug 2026',
      credentialId: credId || `AWS-PRO-${Math.floor(Math.random() * 89999 + 10000)}`,
      verificationUrl: 'https://skillbridge.verify.network/proof',
      verificationHash: `0x${Math.random().toString(16).substr(2, 32)}`,
      isVerified: true
    };
    setCerts(prev => [newCert, ...prev]);
    setIsAdding(false);
    setTitle('');
    setIssuer('');
    setDate('');
    setCredId('');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-extrabold text-white">Verified Industry Certifications & Credentials</h1>
          </div>
          <p className="text-xs text-slate-300">
            Immutable credentials cryptographically anchored to your Ladder Digital Passport ledger.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload Credential</span>
        </button>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl bg-[#0B1033] border border-[#1C265E] hover:border-[#7C5CFC] transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Ledger
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-[#C4B5FD] transition-colors mb-1">
                {cert.title}
              </h3>
              <p className="text-xs text-slate-300 font-semibold mb-2">
                Issuer: <strong className="text-white">{cert.issuer}</strong>
              </p>

              <div className="p-2.5 rounded-xl bg-[#070B1E] border border-white/5 space-y-1 text-[11px] text-slate-300 font-mono mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Credential ID:</span>
                  <span className="text-white font-bold">{cert.credentialId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Issued:</span>
                  <span className="text-slate-300">{cert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                  <span className="text-slate-400">Hash:</span>
                  <span className="text-emerald-400">{cert.verificationHash.slice(0, 16)}...</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={cert.verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-xl bg-[#141C48] hover:bg-[#1D296C] text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <span>Verify Proof</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => alert(`Shareable verification link copied for ${cert.title}`)}
                className="p-2 rounded-xl bg-[#141C48] hover:bg-[#1D296C] text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Share Certificate"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0B1033] border border-[#1E2B68] rounded-2xl p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#182352]">
              <h2 className="text-base font-black text-white">Add Verified Certificate</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1.5 rounded-lg bg-[#141C48] text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCert} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-white block mb-1">Certificate / Credential Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white block mb-1">Issuing Authority / Organization</label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, Oracle, Linux Foundation"
                  className="w-full px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Issue Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Aug 2026"
                    className="w-full px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white block mb-1">Credential ID</label>
                  <input
                    type="text"
                    value={credId}
                    onChange={(e) => setCredId(e.target.value)}
                    placeholder="e.g. AWS-994821"
                    className="w-full px-3 py-2 rounded-xl bg-[#070B1E] border border-white/10 text-white text-xs focus:outline-none focus:border-[#7C5CFC]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#182352]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C48] text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold shadow cursor-pointer"
                >
                  Save & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
