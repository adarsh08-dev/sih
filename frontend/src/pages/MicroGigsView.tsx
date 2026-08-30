import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  X,
  FileText
} from 'lucide-react';
import { Gig } from '../types';

interface MicroGigsProps {
  gigs: Gig[];
  onApplyGig: (gig: Gig) => void;
  onCreateGig: (newGig: { title: string; requiredSkill: string; hours: number; payment: number; description: string }) => void;
}

export const MicroGigsView: React.FC<MicroGigsProps> = ({ gigs, onApplyGig, onCreateGig }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // New Gig Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSkill, setNewSkill] = useState('Web Development');
  const [newHours, setNewHours] = useState(3);
  const [newPayment, setNewPayment] = useState(2000);
  const [newDescription, setNewDescription] = useState('');

  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.skill.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = selectedSkill === 'all' || gig.skill.toLowerCase().includes(selectedSkill.toLowerCase());
    return matchesSearch && matchesSkill;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    onCreateGig({
      title: newTitle,
      requiredSkill: newSkill,
      hours: Number(newHours),
      payment: Number(newPayment),
      description: newDescription || 'Industry sponsored micro-internship task.'
    });
    setIsPostModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-extrabold text-white">Micro-Internship Gig Board</h1>
          </div>
          <p className="text-xs text-slate-300">
            Real short-term industry deliverables with paid stipends & direct blockchain credential verification.
          </p>
        </div>

        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Micro-Task</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, company, or tech stack..."
            className="w-full bg-[#0E1538] border border-[#1E2964] focus:border-[#7C5CFC] text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Web Development', 'Backend', 'SQL', 'Cybersecurity'].map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedSkill === skill
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'bg-[#0E1538] border border-[#1E2964] text-slate-300 hover:text-white'
              }`}
            >
              {skill === 'all' ? 'All Skills' : skill}
            </button>
          ))}
        </div>
      </div>

      {/* Gigs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGigs.map((gig) => (
          <div
            key={gig.id}
            className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-[#A78BFA] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  <span>{gig.company}</span>
                </span>
                <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  Zero NDA · Verified
                </span>
              </div>

              <h2 className="text-sm font-bold text-white mb-1.5">{gig.title}</h2>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {gig.description || 'Develop and test real production component meeting corporate coding specifications.'}
              </p>

              <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-[#18214D]">
                <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1A2352]">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Stipend</span>
                  <span className="text-xs font-black text-emerald-400">₹{gig.payment}</span>
                </div>

                <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1A2352]">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Duration</span>
                  <span className="text-xs font-bold text-white">{gig.hours} Hours</span>
                </div>

                <div className="p-2 rounded-lg bg-[#0B1033] border border-[#1A2352]">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Required Stack</span>
                  <span className="text-xs font-bold text-[#C4B5FD] truncate block">{gig.skill}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                {gig.applicantCount || 12} candidates applied
              </span>

              <button
                onClick={() => onApplyGig(gig)}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all"
              >
                <span>Apply with Pitch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Gig Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            onClick={() => setIsPostModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-[#0A0F2E] border border-[#1E2964] rounded-2xl shadow-2xl overflow-hidden p-6 z-10 animate-fade-in">
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-[#0E1538] text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-[#A78BFA]" />
              <h3 className="text-base font-extrabold text-white">Create Industry Micro-Task</h3>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Dockerized Express Gateway"
                  className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Hours Est.</label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Stipend (₹)</label>
                  <input
                    type="number"
                    value={newPayment}
                    onChange={(e) => setNewPayment(Number(e.target.value))}
                    className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Task Deliverables & Specs</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the required code deliverable, acceptance criteria, and edge cases."
                  className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <span>Publish Micro-Task to Gig Board</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
