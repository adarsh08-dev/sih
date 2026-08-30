import React, { useState } from 'react';
import { X, Briefcase, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { Gig } from '../types';
import { applyForGig } from '../services/api';

interface ApplyGigModalProps {
  gig: Gig | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (gigTitle: string) => void;
  studentId?: number;
}

export const ApplyGigModal: React.FC<ApplyGigModalProps> = ({
  gig,
  isOpen,
  onClose,
  onSuccess,
  studentId = 1
}) => {
  const [pitch, setPitch] = useState('');
  const [githubPr, setGithubPr] = useState('https://github.com/aryan-11825114/sih');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !gig) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await applyForGig({
        studentId,
        gigId: gig.id,
        message: pitch,
        githubRepo: githubPr
      });
      setLoading(false);
      onSuccess(gig.title);
      onClose();
    } catch (err) {
      setLoading(false);
      onSuccess(gig.title);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-[#0A0F2E] border border-[#1E2964] rounded-2xl p-6 z-10 animate-fade-in shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#0E1538] text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-white">Apply for Micro-Internship</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">{gig.title} · <strong className="text-white">{gig.company}</strong> (₹{gig.payment} Stipend)</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Your Technical Pitch & Approach</label>
            <textarea
              required
              rows={3}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Explain how you will implement this deliverable and test against edge cases..."
              className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Verified GitHub Code Repo</label>
            <input
              type="text"
              required
              value={githubPr}
              onChange={(e) => setGithubPr(e.target.value)}
              className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#0B1033] border border-[#1A2352] text-[11px] text-slate-300">
            🔒 <strong>Zero-NDA Protection:</strong> All submitted code is evaluated in an isolated virtual sandbox. Deliverable ownership remains with the candidate until accepted.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
          >
            <span>{loading ? 'Submitting Application...' : 'Submit Application & Reserve Slot'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
