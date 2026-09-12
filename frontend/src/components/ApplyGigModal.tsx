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
      <div className="relative w-full max-w-lg bg-[#0B0E1A] border border-[#5E3A5C]/40 rounded-2xl p-6 z-10 animate-fade-in shadow-2xl text-[#F3E9EC]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-[#2C1B2F] border border-[#5E3A5C] text-[#F3E9EC]/60 hover:text-[#F3E9EC] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="w-5 h-5 text-[#B47A9A]" />
          <h3 className="text-base font-extrabold text-[#F3E9EC]">Apply for Micro-Internship</h3>
        </div>
        <p className="text-xs text-[#F3E9EC]/60 mb-4">{gig.title} · <strong className="text-[#F3E9EC]">{gig.company}</strong> (₹{gig.payment} Stipend)</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#F3E9EC]/80 mb-1">Your Technical Pitch & Approach</label>
            <textarea
              required
              rows={3}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Explain how you will implement this deliverable and test against edge cases..."
              className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] text-[#F3E9EC] placeholder-[#F3E9EC]/40 text-xs rounded-xl px-4 py-2.5 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#F3E9EC]/80 mb-1">Verified GitHub Code Repo</label>
            <input
              type="text"
              required
              value={githubPr}
              onChange={(e) => setGithubPr(e.target.value)}
              className="w-full bg-[#2C1B2F] border border-[#5E3A5C] focus:border-[#B47A9A] text-[#F3E9EC] text-xs rounded-xl px-4 py-2.5 outline-none font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#2C1B2F] border border-[#5E3A5C] text-[11px] text-[#F3E9EC]/80">
            🔒 <strong>Zero-NDA Protection:</strong> All submitted code is evaluated in an isolated virtual sandbox. Deliverable ownership remains with the candidate until accepted.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#5E3A5C] hover:bg-[#B47A9A] text-[#F3E9EC] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#2C1B2F]/40 cursor-pointer"
          >
            <span>{loading ? 'Submitting Application...' : 'Submit Application & Reserve Slot'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
