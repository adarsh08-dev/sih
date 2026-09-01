import React from 'react';

export const StatCard: React.FC<{ label: string; value: number | string; trend?: string }> = ({ label, value, trend }) => (
  <div className="bg-[#0E1538] p-4 rounded-xl border border-[#1E2964]">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-2xl font-black text-white">{value}</p>
    {trend && <p className="text-[10px] text-emerald-400">{trend}</p>}
  </div>
);

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Ongoing: 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/30',
    Completed: 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30',
    'Pending Approval': 'bg-amber-900/40 text-amber-300 border border-amber-500/30',
    Rejected: 'bg-rose-900/40 text-rose-300 border border-rose-500/30',
    Applied: 'bg-blue-900/40 text-blue-300 border border-blue-500/30',
    Approved: 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${colors[status] || 'bg-slate-700/60 text-slate-300 border border-slate-600/30'}`}>{status}</span>;
};
