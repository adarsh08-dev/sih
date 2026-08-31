import React from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';
import { BarChart, TrendingUp } from 'lucide-react';

export const AcademicIntelligenceView: React.FC = () => {
  return (
    <BaseFacultyView title="Academic Intelligence" description="Data-driven insights for CSIT Department.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
          <h3 className="text-sm font-bold text-white mb-4">Placement Trends</h3>
          <div className="h-48 flex items-end gap-2">
            {[40, 60, 55, 75].map((h, i) => (
              <div key={i} style={{height: `${h}%`}} className="w-full bg-indigo-500 rounded-t"></div>
            ))}
          </div>
        </div>
        <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
          <h3 className="text-sm font-bold text-white mb-4">Key Insights</h3>
          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li>Placement rate up 12% this semester</li>
            <li>Mentorship participation dropped in Sem 3</li>
          </ul>
        </div>
      </div>
    </BaseFacultyView>
  );
};
