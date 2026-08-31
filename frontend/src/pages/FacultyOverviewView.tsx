import React from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  Award,
  TrendingUp,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { getFacultyProfile } from '../services/facultyDataService';

export const FacultyOverview: React.FC = () => {
  const profile = getFacultyProfile();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Profile Completion', value: `${profile.profileCompletion}%`, icon: Users },
          { label: 'Active Collaborations', value: '4', icon: Briefcase },
          { label: 'Applications', value: '5', icon: FileText },
          { label: 'Upcoming Sessions', value: '3', icon: Calendar },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#0E1538] border border-[#1E2964]">
            <div className="flex items-center gap-3">
              <stat.icon className="w-6 h-6 text-indigo-400" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-black text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Opportunities & Intervention Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Recommended Opportunities</h3>
          </div>
          <div className="space-y-3">
            {['AI Research Collaboration', 'Industry FDP', 'AI Consultancy'].map((opp, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0B1033] border border-[#1E2964] flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-white">{opp}</p>
                  <p className="text-[10px] text-slate-400">91% Match</p>
                </div>
                <button className="px-3 py-1 bg-[#7C5CFC] text-white text-[10px] font-bold rounded-lg hover:bg-[#6D4AE8]">View</button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Placement Readiness</h3>
          </div>
          <div className="h-48 flex items-center justify-center">
            {/* Simple placeholder for chart */}
            <div className="w-32 h-32 rounded-full border-8 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center">
              <span className="text-xl font-black text-white">68%</span>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400">Readiness Score</p>
        </div>
      </div>
    </div>
  );
};
