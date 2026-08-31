import React from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';

export const IndustrialTrainingView: React.FC = () => (
  <BaseFacultyView title="Industrial Training" description="Manage industrial training programs.">
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
      <table className="w-full text-left text-white text-xs">
        <thead><tr className="text-slate-400"><th className="pb-3">Company</th><th className="pb-3">Program</th><th className="pb-3">Status</th></tr></thead>
        <tbody>
          <tr><td className="py-3">TCS</td><td className="py-3">Full Stack</td><td className="py-3">Active</td></tr>
        </tbody>
      </table>
    </div>
  </BaseFacultyView>
);
