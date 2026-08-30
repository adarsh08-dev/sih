import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { CollegeItem } from '../data/colleges';

interface DashboardSplashProps {
  role: 'student' | 'mentor' | 'hod' | 'company';
  college?: CollegeItem | null;
  onFinished: () => void;
}

export const DashboardSplash: React.FC<DashboardSplashProps> = ({
  role,
  college,
  onFinished
}) => {
  const [stage, setStage] = useState<'animating' | 'fading'>('animating');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('fading');
    }, 1800);

    const timer2 = setTimeout(() => {
      onFinished();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinished]);

  const getSubtext = () => {
    if (role === 'mentor') return 'Opening Mentor Capsule...';
    if (role === 'hod') return 'Opening HOD Panel...';
    if (role === 'company') return 'Opening Recruiter Hiring Portal...';
    return 'Opening Student OS...';
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0B0F2A] flex flex-col items-center justify-center font-sans select-none transition-opacity duration-400 ease-out ${
        stage === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        @keyframes splashPulse {
          0%, 100% {
            transform: scale(0.96);
            filter: drop-shadow(0 0 12px rgba(124, 92, 252, 0.4));
          }
          50% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 24px rgba(124, 92, 252, 0.8));
          }
        }
        @keyframes loaderDots {
          0%, 20% {
            opacity: 0.2;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-4px);
          }
          80%, 100% {
            opacity: 0.2;
            transform: translateY(0);
          }
        }
        .splash-pulse-logo {
          animation: splashPulse 1.2s ease-in-out infinite;
        }
        .loader-dot-1 {
          animation: loaderDots 1.2s infinite ease-in-out 0s;
        }
        .loader-dot-2 {
          animation: loaderDots 1.2s infinite ease-in-out 0.2s;
        }
        .loader-dot-3 {
          animation: loaderDots 1.2s infinite ease-in-out 0.4s;
        }
      `}</style>

      {/* Center Logo with 1.2s pulse animation */}
      <div className="relative flex flex-col items-center">
        {/* Glow ambient background ring */}
        <div className="w-64 h-64 rounded-full bg-[#7C5CFC]/15 blur-3xl absolute -top-12 pointer-events-none" />

        {/* Center Animated Logo: 220px or Logo with specs */}
        <div className="relative z-10 flex flex-col items-center mb-6 splash-pulse-logo">
          {!imgError ? (
            <img 
              src="/mnt/data/skillbridge_ai_logo.webp" 
              alt="SkillBridge AI" 
              className="w-[200px] h-[90px] object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <Logo 
              showText={true} 
              subtitle={false} 
              iconSize={72} 
              className="flex-col items-center text-center gap-3"
            />
          )}
        </div>

        {/* College Sync Badge if available */}
        {college && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1538] border border-white/10 shadow-md mb-4 animate-in fade-in zoom-in-95">
            <div className="w-5 h-5 rounded bg-white p-0.5 flex items-center justify-center shrink-0">
              <img 
                src={college.logo || college.fallbackLogo} 
                alt={college.short} 
                className="w-full h-full object-contain" 
              />
            </div>
            <span className="text-xs font-semibold text-slate-300">
              Syncing with {college.short}...
            </span>
          </div>
        )}

        {/* Dynamic Subtext + Animated Dots Loader */}
        <div className="flex items-center gap-2 mt-2">
          <p 
            className="text-[13px] text-white/60 font-medium tracking-wide"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {getSubtext()}
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] loader-dot-1" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] loader-dot-2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] loader-dot-3" />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[11.5px] text-white/45 mt-3 font-normal tracking-[0.2px]">
          Empowering Talent, Bridging Academia & Industry
        </p>
      </div>
    </div>
  );
};

export default DashboardSplash;
