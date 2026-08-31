import React from 'react';
import { mockCurriculum } from '../data/facultyMockData';
import { StatusBadge, StatCard } from '../components/faculty/FacultyCommon';
import { BookOpen, CheckCircle } from 'lucide-react';

export const CurriculumAlignmentView: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-black text-white mb-4">Curriculum Alignment</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard label="Total Courses" value={mockCurriculum.length} icon={BookOpen} />
        <StatCard label="Compliant" value={mockCurriculum.filter(c => c.status === 'Compliant').length} icon={CheckCircle} />
    </div>
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
        <table className="w-full text-left text-white text-xs">
            <thead><tr className="text-slate-400"><th className="pb-3">Course</th><th className="pb-3">Semester</th><th className="pb-3">Alignment %</th><th className="pb-3">Status</th></tr></thead>
            <tbody>
                {mockCurriculum.map(c => (
                    <tr key={c.id} className="border-t border-[#1E2964]">
                        <td className="py-3">{c.course}</td>
                        <td className="py-3">{c.semester}</td>
                        <td className="py-3">{c.alignment}%</td>
                        <td className="py-3"><StatusBadge status={c.status} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </div>
);
