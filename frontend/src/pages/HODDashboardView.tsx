import React from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';
import { Users, Building, Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';

export const HODDashboardView: React.FC = () => {
  const stats = [
    { label: 'Total Students', value: '480', icon: Users, trend: '+2% vs last year' },
    { label: 'Active Faculty', value: '22', icon: Users, trend: 'Stable' },
    { label: 'Industry Collaborations', value: '7', icon: Building, trend: '+1 vs last month' },
    { label: 'Placement Rate', value: '78%', icon: Briefcase, trend: '+5% vs last year' },
  ];

  return (
    <BaseFacultyView title="Welcome back, Dr. Arvind Sharma" description="Today is Saturday, August 30, 2026. You have 2 pending mentorship requests, 1 workshop proposal awaiting approval, and 3 new collaboration invites this week.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-indigo-900/30 text-indigo-400"><stat.icon className="w-4 h-4" /></div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</p>
            </div>
            <p className="text-xl font-black text-white">{stat.value}</p>
            <p className="text-[9px] text-emerald-400">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
          <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { text: 'Priya Verma requested mentorship', time: '2 hours ago' },
              { text: 'TCS proposed a new Collaboration Hub project', time: 'Yesterday' },
              { text: 'Workshop "Cloud Computing Basics" completed', time: '2 days ago' },
            ].map((act, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5" />
                <p className="text-slate-300 flex-1">{act.text}</p>
                <p className="text-slate-500">{act.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
          <h3 className="text-sm font-bold text-white mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {['Mentorship Request: Rahul', 'Workshop: AI Trends', 'MoU: Infosys'].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-[#0B1033] p-2 rounded-lg border border-[#1E2964]">
                <span className="text-slate-300 truncate">{item}</span>
                <button className="text-indigo-400 font-bold hover:underline ml-2">Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseFacultyView>
  );
};
