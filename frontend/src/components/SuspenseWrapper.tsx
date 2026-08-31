import React, { Suspense } from 'react';

const Skeleton = () => (
  <div className="p-4 rounded-xl bg-[#0E1538]/50 animate-pulse border border-[#1E2964]/50 h-32">
    <div className="h-4 bg-slate-700/50 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-slate-700/50 rounded w-full mb-2"></div>
    <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
  </div>
);

export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Skeleton />}>
    {children}
  </Suspense>
);
