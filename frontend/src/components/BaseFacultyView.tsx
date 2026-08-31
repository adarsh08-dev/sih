import React from 'react';

interface BaseFacultyViewProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const BaseFacultyView: React.FC<BaseFacultyViewProps> = ({ title, description, children }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black text-white">{title}</h2>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
};
