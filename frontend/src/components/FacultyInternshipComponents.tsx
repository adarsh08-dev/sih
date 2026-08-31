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
    Ongoing: 'bg-indigo-900/50 text-indigo-300',
    Completed: 'bg-slate-800 text-slate-300',
    'Pending Approval': 'bg-amber-900/50 text-amber-300',
    Rejected: 'bg-red-900/50 text-red-300',
    Applied: 'bg-blue-900/50 text-blue-300',
    Approved: 'bg-emerald-900/50 text-emerald-300'
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] ${colors[status] || 'bg-slate-700'}`}>{status}</span>;
};
