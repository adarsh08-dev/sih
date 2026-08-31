import React from 'react';

export const StatCard: React.FC<{ label: string; value: string | number; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400"><Icon className="w-4 h-4" /></div>
      <p className="text-[10px] text-slate-400 font-bold uppercase">{label}</p>
    </div>
    <p className="text-xl font-black text-white">{value}</p>
  </div>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Compliant: 'bg-emerald-900/50 text-emerald-300',
    'Needs Review': 'bg-amber-900/50 text-amber-300',
    'In Progress': 'bg-blue-900/50 text-blue-300',
    Completed: 'bg-emerald-900/50 text-emerald-300',
    'Pending Approval': 'bg-slate-700 text-slate-300',
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] ${colors[status] || 'bg-slate-700'}`}>{status}</span>;
};
