import React from 'react';

export const IndustryOpportunities: React.FC = () => {
  const opportunities = [
    { title: 'AI Research Collaboration', org: 'TCS Research', match: '91%', domain: 'AI/ML' },
    { title: 'Cloud Infrastructure Training', org: 'AWS Academy', match: '85%', domain: 'Cloud' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {opportunities.map((opp, i) => (
        <div key={i} className="p-5 rounded-2xl bg-[#0E1538] border border-[#1E2964]">
          <h3 className="text-sm font-bold text-white">{opp.title}</h3>
          <p className="text-xs text-slate-400">{opp.org}</p>
          <span className="text-emerald-400 font-bold text-xs">{opp.match} Match</span>
        </div>
      ))}
    </div>
  );
};
