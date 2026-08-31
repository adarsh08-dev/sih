import React from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';
import { getFacultyProfile } from '../services/facultyDataService';

export const FacultyProfileView: React.FC = () => {
  const profile = getFacultyProfile();
  return (
    <BaseFacultyView title="Faculty Profile" description="Manage your academic credentials and professional portfolio.">
      <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-indigo-900 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{profile.name}</h3>
            <p className="text-sm text-slate-400">{profile.designation} | {profile.department}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div><p className="text-xs text-slate-400">Email</p><p className="text-sm text-white">{profile.email}</p></div>
          <div><p className="text-xs text-slate-400">Qualifications</p><p className="text-sm text-white">{profile.qualifications.join(', ')}</p></div>
        </div>
      </div>
    </BaseFacultyView>
  );
};
