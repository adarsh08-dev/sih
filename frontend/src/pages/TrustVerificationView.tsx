import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  Award, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Layers,
  Database,
  Cpu
} from 'lucide-react';

export const TrustVerificationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pillars' | 'explorer' | 'recruiters'>('pillars');
  const [searchTx, setSearchTx] = useState('');

  const sampleLedgerTxs = [
    {
      txHash: '0x7f4b8921e90a8813bc49df290bca238e9184204d',
      candidate: 'Adarsh Pratap Singh (MJPRU)',
      partner: 'CloudSphere Systems',
      action: 'Backend API Micro-Internship Proof Minted',
      timestamp: '2 mins ago',
      status: 'Block Confirmed #198234'
    },
    {
      txHash: '0x3a91cd8823fe492a8019b8820c85741982b8492c',
      candidate: 'Rohan Joshi (IET Lucknow)',
      partner: 'Infosys Springboard',
      action: 'Zero-Leak JWT Sandbox 100% Passed',
      timestamp: '14 mins ago',
      status: 'Block Confirmed #198230'
    },
    {
      txHash: '0x12a89bf9920194857bca710928340129a884210f',
      candidate: 'Pooja Verma (Invertis)',
      partner: 'Tata Consultancy Services',
      action: '15-Min Capsule Code Review Verified',
      timestamp: '1 hour ago',
      status: 'Block Confirmed #198218'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Trust & Verification Portal</h1>
          </div>
          <p className="text-xs text-slate-300">
            Cryptographic governance guaranteeing zero resume fraud, tamper-proof work artifacts, and direct employer verification.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pillars' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            4 Pillars of Trust
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'explorer' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            Blockchain Explorer
          </button>
          <button
            onClick={() => setActiveTab('recruiters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'recruiters' ? 'bg-[#7C5CFC] text-white' : 'bg-[#141C48] text-slate-300 hover:text-white'
            }`}
          >
            Vetted Recruiters
          </button>
        </div>
      </div>

      {/* 1. 4 PILLARS OF TRUST */}
      {activeTab === 'pillars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1.5">1. Cryptographic Proof-of-Work</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every completed micro-internship, pull request, and ghost simulation is hashed and digitally signed by partner company engineering leads.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1.5">2. Institutional University Governance</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              College HODs and TPO heads cross-audit student candidate profiles, aligning curriculum milestones with NAAC and NBA accreditation standards.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1.5">3. Industry Mentor Endorsement</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              15-minute capsule sessions require senior mentors to rate candidate system architecture skills, logging verifiable feedback directly to the candidate's passport.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1.5">4. Zero Fake Experience Claims</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recruiters query the public verification node via QR code or SHA256 transaction hash to instantly validate candidate milestones with zero third-party delay.
            </p>
          </div>
        </div>
      )}

      {/* 2. BLOCKCHAIN EXPLORER */}
      {activeTab === 'explorer' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTx}
                onChange={(e) => setSearchTx(e.target.value)}
                placeholder="Search transaction hash, student candidate, or partner block..."
                className="w-full bg-[#0A0F2E] border border-[#1E2964] text-white text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-3">
            {sampleLedgerTxs.map((tx, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-emerald-400 font-bold">{tx.action}</span>
                    <span className="text-[10px] text-slate-400 font-sans">({tx.timestamp})</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">Candidate: <strong>{tx.candidate}</strong> · Partner: <strong className="text-[#A78BFA]">{tx.partner}</strong></p>
                  <p className="text-[10.5px] text-slate-400 mt-1 truncate max-w-md">Hash: {tx.txHash}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-1 rounded">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. VETTED RECRUITERS */}
      {activeTab === 'recruiters' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {[
            { name: 'Tata Consultancy Services', sector: 'Enterprise IT & Cloud', openings: '50+ Cohort Seats', status: 'Direct PPO Node Active' },
            { name: 'Infosys Springboard', sector: 'AI & Full Stack Services', openings: '35+ Cohort Seats', status: 'Zero-NDA Ghost Partner' },
            { name: 'CloudSphere Systems', sector: 'DevOps & Distributed Systems', openings: '15+ Micro-Gig Stipends', status: 'Verified Payout Partner' },
            { name: 'Wipro Digital Next', sector: 'Web & Mobile Systems', openings: '25+ Cohort Seats', status: 'MoU Signed' }
          ].map((rec, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
              <h2 className="text-sm font-bold text-white">{rec.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{rec.sector}</p>
              <div className="my-3 py-2 border-y border-[#18214D] flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Campus Pipeline</span>
                <span className="text-emerald-400 font-black">{rec.openings}</span>
              </div>
              <span className="text-[10px] text-[#C4B5FD] bg-[#1A1E4E] px-2 py-0.5 rounded font-bold block text-center">
                ✓ {rec.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
