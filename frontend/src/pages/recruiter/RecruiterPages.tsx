import React from 'react';
import { 
  mockCandidates, 
  mockApplications, 
  mockJobs, 
  mockInterviews, 
  mockDrives, 
  mockInternships, 
  mockCollabs, 
  mockMessages, 
  mockNotifications 
} from '../../data/recruiterMockData';
import { StatusBadge } from '../../components/recruiter/Common';

export const TalentDiscovery: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-black text-white mb-4">Talent Discovery</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mockCandidates.map(c => (
        <div key={c.id} className="bg-[#0E1538] p-4 rounded-xl border border-[#1E2964] space-y-2">
            <h4 className="text-white font-bold">{c.name}</h4>
            <p className="text-[10px] text-slate-400">{c.dept} • {c.gradYear}</p>
            <div className="flex flex-wrap gap-1">
                {c.skills.map(s => <span key={s} className="px-1.5 py-0.5 rounded bg-indigo-900/30 text-[9px] text-indigo-300">{s}</span>)}
            </div>
            <div className="text-[10px] text-slate-300 pt-2">Match: {c.match}%</div>
            <button className="w-full text-center text-[10px] bg-indigo-600 py-1 rounded text-white">View Profile</button>
        </div>
      ))}
    </div>
  </div>
);

export const ApplicationsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Applications</h2>
    <table className="w-full text-left text-white text-xs">
        <thead><tr className="text-slate-400"><th className="pb-3">Candidate</th><th className="pb-3">Position</th><th className="pb-3">Match</th><th className="pb-3">Stage</th></tr></thead>
        <tbody>
            {mockApplications.map(a => (
                <tr key={a.id} className="border-t border-[#1E2964]">
                    <td className="py-3">{a.cand}</td>
                    <td className="py-3">{a.job}</td>
                    <td className="py-3">{a.match}%</td>
                    <td className="py-3"><StatusBadge status={a.stage} /></td>
                </tr>
            ))}
        </tbody>
    </table>
  </div>
);
// ... (rest of the pages)

export const ShortlistedPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Shortlisted Candidates</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockApplications.filter(a => a.stage === 'Shortlisted').map(a => (
            <div key={a.id} className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964]">
                <h4 className="text-white font-bold">{a.cand}</h4>
                <p className="text-[10px] text-slate-400">{a.job}</p>
                <div className="text-[10px] text-slate-300 pt-2">Match: {a.match}%</div>
                <div className="flex gap-2 pt-3">
                    <button className="flex-1 text-[10px] bg-indigo-600 py-1 rounded text-white">View</button>
                    <button className="flex-1 text-[10px] bg-emerald-600 py-1 rounded text-white">Schedule</button>
                </div>
            </div>
        ))}
    </div>
  </div>
);

export const JobPostingsPage: React.FC = () => (
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
      <h2 className="text-xl font-black text-white mb-4">Job Postings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockJobs.map(j => (
              <div key={j.id} className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964] space-y-2">
                  <h4 className="text-white font-bold">{j.title}</h4>
                  <p className="text-[10px] text-slate-400">{j.company} • {j.location}</p>
                  <p className="text-[10px] text-slate-400">Apps: {j.apps}</p>
                  <StatusBadge status={j.status} />
              </div>
          ))}
      </div>
    </div>
  );

export const PostJobPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Post a New Job</h2>
    <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <input placeholder="Job Title" className="bg-[#0B1033] p-2 rounded border border-[#1E2964] text-white" />
            <input placeholder="Company" className="bg-[#0B1033] p-2 rounded border border-[#1E2964] text-white" />
        </div>
        <textarea placeholder="Job Description" className="w-full bg-[#0B1033] p-2 rounded border border-[#1E2964] text-white h-32" />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Publish Job</button>
    </form>
  </div>
);

export const InterviewsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Interviews</h2>
    <table className="w-full text-left text-white text-xs">
        <thead><tr className="text-slate-400"><th className="pb-3">Candidate</th><th className="pb-3">Role</th><th className="pb-3">Date</th><th className="pb-3">Status</th></tr></thead>
        <tbody>
            {mockInterviews.map(i => (
                <tr key={i.id} className="border-t border-[#1E2964]">
                    <td className="py-3">{i.cand}</td>
                    <td className="py-3">{i.job}</td>
                    <td className="py-3">{i.date}</td>
                    <td className="py-3"><StatusBadge status={i.status} /></td>
                </tr>
            ))}
        </tbody>
    </table>
  </div>
);

export const RecruiterAnalyticsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Recruitment Analytics</h2>
    <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964]">
            <p className="text-slate-400">Total Applications</p>
            <p className="text-3xl font-black text-white">{mockApplications.length}</p>
        </div>
        <div className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964]">
            <p className="text-slate-400">Interviews Conducted</p>
            <p className="text-3xl font-black text-white">{mockInterviews.filter(i => i.status === 'Completed').length}</p>
        </div>
    </div>
  </div>
);

export const CompanyProfilePage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Company Profile</h2>
    <div className="space-y-2 text-white">
        <p><strong>Name:</strong> TechNova Solutions</p>
        <p><strong>Industry:</strong> Software & Technology</p>
        <p><strong>Website:</strong> company.example</p>
    </div>
  </div>
);

export const CampusDrivesPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Campus Drives</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockDrives.map(d => (
            <div key={d.id} className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964]">
                <h4 className="text-white font-bold">{d.name}</h4>
                <p className="text-xs text-slate-400">{d.company} • {d.date}</p>
                <StatusBadge status={d.status} />
            </div>
        ))}
    </div>
  </div>
);

export const InternshipProgramsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Internship Programs</h2>
    <div className="space-y-4">
        {mockInternships.map(i => (
            <div key={i.id} className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964] flex justify-between">
                <h4 className="text-white font-bold">{i.title} ({i.company})</h4>
                <StatusBadge status={i.status} />
            </div>
        ))}
    </div>
  </div>
);

export const UniversityCollaborationPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">University Collaboration</h2>
    <table className="w-full text-left text-white text-xs">
        <tbody>
            {mockCollabs.map(c => (
                <tr key={c.id} className="border-t border-[#1E2964]">
                    <td className="py-3">{c.org}</td>
                    <td className="py-3">{c.type}</td>
                    <td className="py-3"><StatusBadge status={c.status} /></td>
                </tr>
            ))}
        </tbody>
    </table>
  </div>
);

export const LiveProjectsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Live Projects</h2>
    <div className="text-slate-400">Live projects management interface.</div>
  </div>
);

export const ResearchOpportunitiesPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Research Opportunities</h2>
    <div className="text-slate-400">Research collaboration opportunities interface.</div>
  </div>
);

export const MessagesPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964] h-[500px] flex">
    <div className="w-1/3 border-r border-[#1E2964] p-2 space-y-2">
        {mockMessages.map(m => (
            <div key={m.id} className="p-2 rounded bg-[#0B1033] text-white text-xs">{m.from}</div>
        ))}
    </div>
    <div className="w-2/3 p-4 text-slate-400">Select a conversation.</div>
  </div>
);

export const NotificationsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Notifications</h2>
    <div className="space-y-2">
        {mockNotifications.map(n => (
            <div key={n.id} className="p-3 bg-[#0B1033] rounded border border-[#1E2964] text-xs text-white">{n.msg}</div>
        ))}
    </div>
  </div>
);

export const SettingsPage: React.FC = () => (
  <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
    <h2 className="text-xl font-black text-white mb-4">Settings</h2>
    <div className="space-y-4 text-white">
        <label className="block"><input type="checkbox" className="mr-2" /> Email Notifications</label>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Save Changes</button>
    </div>
  </div>
);

