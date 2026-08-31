import React from 'react';
import { BaseFacultyView } from '../components/BaseFacultyView';

export const GenericFacultyView: React.FC<{title: string}> = ({ title }) => (
  <BaseFacultyView title={title} description="Module coming soon with full functionality.">
    <div className="bg-[#0E1538] p-6 rounded-2xl border border-[#1E2964]">
      <div className="text-white text-xs">This module is currently being configured for {title}.</div>
    </div>
  </BaseFacultyView>
);
