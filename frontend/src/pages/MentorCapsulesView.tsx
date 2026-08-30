import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Video, 
  Star, 
  Building,
  Award,
  ArrowRight
} from 'lucide-react';
import { Mentor } from '../types';

interface MentorCapsulesProps {
  mentors: Mentor[];
  onBookMentor: (mentor: Mentor) => void;
}

export const MentorCapsulesView: React.FC<MentorCapsulesProps> = ({ mentors, onBookMentor }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-pink-400" />
            <h1 className="text-xl font-extrabold text-white">AI Mentorship Matchmaker · 15-Min Capsules</h1>
          </div>
          <p className="text-xs text-slate-300">
            Sprint 1-on-1 code reviews, architecture critiques, and placement strategy with vetted industry leaders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>Top Tier-1 Tech Leads</span>
          </span>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964] hover:border-[#7C5CFC] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#EC4899] flex items-center justify-center font-extrabold text-white text-sm shadow-md">
                    {mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-white">{mentor.name}</h2>
                    <p className="text-xs text-slate-300">{mentor.role}</p>
                    <p className="text-[11px] font-bold text-[#A78BFA] flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3" />
                      <span>{mentor.company}</span>
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full shrink-0">
                  {mentor.match}% Match
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-[#0B1033] border border-[#1A2352] text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Experience</span>
                  <span className="text-white font-bold">{mentor.experience} Years in Industry</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Availability</span>
                  <span className="text-emerald-400 font-bold">Open for Bookings</span>
                </div>
              </div>

              {/* Slot previews */}
              <div className="mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Available 15-Minute Capsule Slots
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(mentor.capsuleSlots || ['Today 4:00 PM', 'Tomorrow 11:30 AM', 'Friday 5:15 PM']).map((slot, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-[#141D4E] text-[#C4B5FD] px-2 py-0.5 rounded border border-[#232F6E]">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#18214D] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Zero fee for university cohort</span>
              <button
                onClick={() => onBookMentor(mentor)}
                className="px-4 py-2 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule 15-Min Capsule</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
