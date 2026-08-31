import React from 'react';
import { getUnplacedStudents } from '../services/facultyDataService';

export const UnplacedCohortView: React.FC = () => {
  const students = getUnplacedStudents();
  return (
    <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
      <h3 className="text-base font-extrabold text-white mb-4">Student Intervention Queue</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-xs uppercase">
            <th className="pb-3">Student</th>
            <th className="pb-3">Roll No</th>
            <th className="pb-3">CGPA</th>
            <th className="pb-3">Readiness</th>
            <th className="pb-3">Risk</th>
            <th className="pb-3">Action</th>
          </tr>
        </thead>
        <tbody className="text-white text-xs">
          {students.map(s => (
            <tr key={s.id} className="border-t border-[#1E2964]">
              <td className="py-3 font-bold">{s.name}</td>
              <td className="py-3">{s.rollNo}</td>
              <td className="py-3">{s.cgpa}</td>
              <td className="py-3">{s.readiness}%</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-full text-[10px] ${s.risk === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {s.risk}
                </span>
              </td>
              <td className="py-3">
                <button className="text-indigo-400 font-bold hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
