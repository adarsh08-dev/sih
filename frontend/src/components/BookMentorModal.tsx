import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import { Mentor } from '../types';
import { bookMentorSession } from '../services/api';

interface BookMentorModalProps {
  mentor: Mentor | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mentorName: string, slot: string) => void;
  studentId?: number;
}

export const BookMentorModal: React.FC<BookMentorModalProps> = ({
  mentor,
  isOpen,
  onClose,
  onSuccess,
  studentId = 1
}) => {
  const [selectedSlot, setSelectedSlot] = useState(mentor?.capsuleSlots?.[0] || 'Today 4:00 PM');
  const [topic, setTopic] = useState('System Architecture & Express Code Review');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bookMentorSession({
        studentId,
        mentorId: mentor.id,
        date: 'Today',
        time: selectedSlot,
        topic
      });
      setLoading(false);
      onSuccess(mentor.name, selectedSlot);
      onClose();
    } catch (err) {
      setLoading(false);
      onSuccess(mentor.name, selectedSlot);
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
          <Calendar className="w-5 h-5 text-pink-400" />
          <h3 className="text-base font-extrabold text-white">Schedule 15-Min Mentor Capsule</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">{mentor.name} · <strong className="text-white">{mentor.company}</strong> ({mentor.role})</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Select 15-Minute Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {(mentor.capsuleSlots || ['Today 4:00 PM', 'Tomorrow 11:30 AM', 'Friday 5:15 PM']).map((slot, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                    selectedSlot === slot
                      ? 'bg-[#7C5CFC]/20 border-[#7C5CFC] text-white'
                      : 'bg-[#0E1538] border-[#1E2964] text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-[#A78BFA] mb-1" />
                  <span>{slot}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Focus Topic / Code Review Subject</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#0E1538] border border-[#1E2964] text-white text-xs rounded-xl px-4 py-2.5 outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#0B1033] border border-[#1A2352] text-[11px] text-slate-300">
            🎯 <strong>Capsule Guarantee:</strong> 15-minute high-density focused sprint with direct verbal code audit and real-time rating logged to your Experience Passport.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#7C5CFC] hover:bg-[#6D4AE8] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
          >
            <span>{loading ? 'Confirming Booking...' : 'Confirm Capsule Booking'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
