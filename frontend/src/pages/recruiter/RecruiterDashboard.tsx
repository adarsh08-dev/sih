import React from 'react';
import { Users, Briefcase, CheckCircle, Calendar, BarChart2, Zap } from 'lucide-react';
import { mockJobs, mockApplications, mockInterviews } from '../../data/recruiterMockData';
import { StatCard, StatusBadge } from '../../components/recruiter/Common';

export const RecruiterDashboard: React.FC = () => {
  const stages = ['Applied', 'Screening', 'Shortlisted', 'Interview', 'Selected', 'Hired'];
  const pipelineData = stages.map(stage => ({
    stage,
    count: mockApplications.filter(a => a.stage === stage).length
  }));

  const topSkills = ['React', 'Python', 'Java', 'SQL', 'Node.js', 'Machine Learning'];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Good morning, Rahul</h1>
        <p className="text-sm text-slate-400">Manage your university hiring pipeline from one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Jobs" value={mockJobs.filter(j => j.status === 'Active').length} icon={Briefcase} />
        <StatCard label="Applications" value={mockApplications.length} icon={Users} />
        <StatCard label="Shortlisted" value={mockApplications.filter(a => a.stage === 'Shortlisted').length} icon={CheckCircle} />
        <StatCard label="Interviews" value={mockInterviews.filter(i => i.status === 'Scheduled').length} icon={Calendar} />
      </div>

      {/* Hiring Pipeline */}
      <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
        <h3 className="text-sm font-bold text-white mb-6">Hiring Pipeline</h3>
        <div className="flex justify-between items-end gap-2">
            {pipelineData.map((s, idx) => (
                <div key={s.stage} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#1E2964] rounded-t-lg relative" style={{ height: `${(s.count / 20) * 100 + 20}px` }}>
                        <span className="absolute -top-6 w-full text-center text-xs font-bold text-indigo-300">{s.count}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{s.stage}</span>
                </div>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
          <h3 className="text-sm font-bold text-white mb-4">Recent Applications</h3>
          <table className="w-full text-left text-white text-xs">
            <thead><tr className="text-slate-400"><th className="pb-3">Candidate</th><th className="pb-3">Role</th><th className="pb-3">Stage</th></tr></thead>
            <tbody>
              {mockApplications.slice(0, 5).map(app => (
                <tr key={app.id} className="border-t border-[#1E2964]">
                  <td className="py-3">{app.cand}</td>
                  <td className="py-3">{app.job}</td>
                  <td className="py-3"><StatusBadge status={app.stage} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-6">
            <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
                <h3 className="text-sm font-bold text-white mb-4">Upcoming Interviews</h3>
                <div className="space-y-3">
                    {mockInterviews.filter(i => i.status === 'Scheduled').slice(0, 3).map(i => (
                        <div key={i.id} className="p-3 bg-[#0B1033] rounded-lg border border-[#1E2964] flex justify-between items-center">
                            <div><p className="text-xs text-white font-bold">{i.cand}</p><p className="text-[10px] text-slate-400">{i.role} • {i.date}</p></div>
                            <StatusBadge status={i.status} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
                <h3 className="text-sm font-bold text-white mb-4">Top Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {topSkills.map(skill => (
                        <span key={skill} className="px-2 py-1 rounded-md bg-indigo-900/30 text-[10px] text-indigo-300 border border-indigo-900/50">{skill}</span>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
