import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Share2, 
  Download, 
  Sparkles,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { PassportRecord } from '../types';

interface ExperiencePassportProps {
  records: PassportRecord[];
}

export const ExperiencePassportView: React.FC<ExperiencePassportProps> = ({ records }) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<PassportRecord | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Experience Passport · Cryptographic Ledger</h1>
          </div>
          <p className="text-xs text-slate-300">
            Immutable proof-of-work verified by university faculty and corporate partner nodes on the Ladder protocol.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Smart Contract: 0x992fa1...</span>
          </span>
        </div>
      </div>

      {/* Passport Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-emerald-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#A78BFA]">{record.company}</span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Score {record.score}/100</span>
                </span>
              </div>

              <h2 className="text-sm font-bold text-white mb-1">{record.title}</h2>
              <p className="text-xs text-slate-300 mb-3">{record.experience_type}</p>

              {/* Verified Stack */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Verified Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(record.skillsVerified || ['Node.js', 'Express', 'JWT Auth', 'PostgreSQL']).map((skill, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Proof Hash */}
              <div className="p-2.5 rounded-xl bg-[#090E2A] border border-[#1A2352] font-mono text-[10.5px] text-slate-400 flex items-center justify-between">
                <span className="truncate pr-2">Tx: {record.hash || '0x7f4b8921e90a8813bc49df290bca238e9184204d'}</span>
                <button
                  onClick={() => handleCopy(record.hash || '0x7f4b8921e90a8813bc49df290bca238e9184204d')}
                  className="text-slate-400 hover:text-white shrink-0 p-1"
                  title="Copy SHA256 Hash"
                >
                  {copiedHash === (record.hash || '0x7f4b8921e90a8813bc49df290bca238e9184204d') ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#18214D] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{record.issueDate || 'August 2026'}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRecord(record)}
                  className="px-3 py-1.5 rounded-lg bg-[#141D4E] hover:bg-[#1D296C] border border-[#243378] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify QR</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Verification Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedRecord(null)} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-[#0A0F2E] border border-[#1E2964] rounded-2xl p-6 text-center z-10 animate-fade-in shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1">Verifiable Credential Audit</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedRecord.title}</p>
            
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center mb-4">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://skillbridge.ai/verify/${selectedRecord.hash || '0x7f4b89'}`)}`} 
                alt="Verification QR" 
                className="w-full h-full"
              />
            </div>

            <p className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 break-all mb-4">
              {selectedRecord.hash || '0x7f4b8921e90a8813bc49df290bca238e9184204d'}
            </p>

            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full py-2 rounded-xl bg-[#7C5CFC] text-white text-xs font-bold shadow"
            >
              Close Verification View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
