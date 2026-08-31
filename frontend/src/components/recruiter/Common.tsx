import React from 'react';

export const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType; trend?: string }> = ({ label, value, icon: Icon, trend }) => (
  <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400"><Icon className="w-4 h-4" /></div>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
    </div>
    <p className="text-xl font-black text-white">{value}</p>
    {trend && <p className="text-[9px] text-emerald-400">{trend}</p>}
  </div>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Active: 'bg-emerald-900/50 text-emerald-300',
    Draft: 'bg-slate-800 text-slate-300',
    Closed: 'bg-red-900/50 text-red-300',
    Shortlisted: 'bg-indigo-900/50 text-indigo-300',
    Screening: 'bg-amber-900/50 text-amber-300',
    Interview: 'bg-blue-900/50 text-blue-300',
    Selected: 'bg-emerald-900/50 text-emerald-300',
    Applied: 'bg-slate-700 text-slate-300',
    Rejected: 'bg-red-900/50 text-red-300',
    Scheduled: 'bg-indigo-900/50 text-indigo-300',
    Completed: 'bg-slate-800 text-slate-300',
    Upcoming: 'bg-amber-900/50 text-amber-300',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] ${colors[status] || 'bg-slate-700'}`}>{status}</span>;
};
