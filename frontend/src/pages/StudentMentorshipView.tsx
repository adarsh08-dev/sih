import React from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';
import { Users, UserPlus, Calendar } from 'lucide-react';

export const StudentMentorshipView: React.FC = () => {
  const mentees = [
    { id: 1, name: 'Rahul Kumar', roll: 'CS202601', sem: 6, status: 'Active' },
    { id: 2, name: 'Priya Singh', roll: 'CS202605', sem: 6, status: 'Active' },
  ];

  return (
    <BaseFacultyView title="Student Mentorship" description="Manage your mentees and sessions.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0E1538] p-4 rounded-xl border border-[#1E2964]"><p className="text-xs text-slate-400">Total Mentees</p><p className="text-2xl font-black text-white">12</p></div>
        <div className="bg-[#0E1538] p-4 rounded-xl border border-[#1E2964]"><p className="text-xs text-slate-400">Active Sessions</p><p className="text-2xl font-black text-emerald-400">4</p></div>
        <div className="bg-[#0E1538] p-4 rounded-xl border border-[#1E2964]"><p className="text-xs text-slate-400">Avg Rating</p><p className="text-2xl font-black text-amber-400">4.8</p></div>
      </div>
      <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
        <h3 className="text-sm font-bold text-white mb-4">Mentees</h3>
        <table className="w-full text-left text-white text-xs">
          <thead><tr className="text-slate-400"><th className="pb-3">Name</th><th className="pb-3">Roll No</th><th className="pb-3">Status</th></tr></thead>
          <tbody>
            {mentees.map(m => (
              <tr key={m.id} className="border-t border-[#1E2964]"><td className="py-3">{m.name}</td><td className="py-3">{m.roll}</td><td className="py-3">{m.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseFacultyView>
  );
};
