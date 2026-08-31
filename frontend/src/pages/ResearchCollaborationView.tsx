import React from 'react';
import { mockResearch } from '../data/facultyMockData';
import { StatusBadge, StatCard } from '../components/faculty/FacultyCommon';
import { Microscope, Users } from 'lucide-react';

export const ResearchCollaborationView: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-black text-white mb-4">Research Collaboration</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Active Projects" value={mockResearch.filter(r => r.status === 'In Progress').length} icon={Microscope} />
        <StatCard label="Collaborations" value={mockResearch.length} icon={Users} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockResearch.map(r => (
            <div key={r.id} className="p-4 bg-[#0B1033] rounded-lg border border-[#1E2964] space-y-2">
                <h4 className="text-white font-bold">{r.project}</h4>
                <p className="text-[10px] text-slate-400">{r.partner} • {r.area}</p>
                <StatusBadge status={r.status} />
            </div>
        ))}
    </div>
  </div>
);
