import React, { useState, useEffect } from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';
import { StatCard, StatusBadge } from '../components/FacultyInternshipComponents';
import { mockInternships, mockOpportunities, mockApplications, mockApprovalRequests } from '../data/facultyInternships';
import { FacultyInternship, InternshipOpportunity, Application, ApprovalRequest } from '../types/facultyInternship';

export const FacultyInternshipsView: React.FC = () => {
  const [internships, setInternships] = useState<FacultyInternship[]>([]);
  const [opportunities] = useState<InternshipOpportunity[]>(mockOpportunities);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovalRequests);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setInternships(mockInternships);
      setLoading(false);
    }, 800);
  }, []);

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleApply = (oppId: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    if (opp) {
        setApplications(prev => [...prev, { id: Date.now().toString(), internshipId: opp.id, title: opp.title, hostOrganization: opp.hostOrganization, appliedDate: new Date().toISOString().split('T')[0], status: 'Applied' }]);
    }
  };

  const activeCount = internships.filter(i => i.status === 'Ongoing').length;
  const completedCount = internships.filter(i => i.status === 'Completed').length;

  if (loading) return <BaseFacultyView title="Faculty Internships" description="Loading..."><div className="text-white">Loading data...</div></BaseFacultyView>;

  return (
    <BaseFacultyView title="Faculty Internships" description="Manage your internship programs and applications.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Ongoing Internships" value={activeCount} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard label="Pending Approvals" value={approvals.filter(a => a.status === 'Pending').length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Internships List */}
        <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
            <h3 className="text-sm font-bold text-white mb-4">My Internships</h3>
            {internships.length === 0 ? <p className="text-xs text-slate-400">No internships found.</p> :
            <div className="space-y-3">
                {internships.map(i => (
                    <div key={i.id} className="p-3 bg-[#0B1033] rounded-lg border border-[#1E2964] flex justify-between items-center">
                        <div><p className="text-xs text-white font-bold">{i.hostOrganization}</p><p className="text-[10px] text-slate-400">{i.type}</p></div>
                        <StatusBadge status={i.status} />
                    </div>
                ))}
            </div>}
        </div>

        {/* Approval Queue */}
        <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
            <h3 className="text-sm font-bold text-white mb-4">Approval Queue</h3>
            {approvals.filter(a => a.status === 'Pending').length === 0 ? <p className="text-xs text-slate-400">No pending approvals.</p> :
            <div className="space-y-3">
                {approvals.filter(a => a.status === 'Pending').map(a => (
                    <div key={a.id} className="p-3 bg-[#0B1033] rounded-lg border border-[#1E2964] flex justify-between items-center">
                        <div><p className="text-xs text-white font-bold">{a.facultyName}</p><p className="text-[10px] text-slate-400">{a.hostOrganization}</p></div>
                        <button onClick={() => handleApprove(a.id)} className="text-[10px] bg-indigo-600 px-2 py-1 rounded text-white hover:bg-indigo-700">Approve</button>
                    </div>
                ))}
            </div>}
        </div>
      </div>
    </BaseFacultyView>
  );
};
