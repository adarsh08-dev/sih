import React, { useState } from 'react';

interface LogoProps {
  showText?: boolean;
  subtitle?: boolean;
  className?: string;
  lightBg?: boolean;
  iconSize?: number;
  customSubtitle?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  showText = true, 
  subtitle = true, 
  className = '', 
  lightBg = false,
  iconSize = 42,
  customSubtitle
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      className={`flex items-start gap-3 select-none min-w-0 ${className}`}
    >
      <style>{`
        @keyframes dotBounce {
          0%, 100% {
            transform: translateY(0);
            filter: drop-shadow(0 0 6px rgba(124, 92, 252, 0.7));
          }
          50% {
            transform: translateY(-6px);
            filter: drop-shadow(0 0 14px rgba(124, 92, 252, 1));
          }
        }
        @keyframes bridgeBuild {
          0% {
            stroke-dashoffset: 100;
            opacity: 0.3;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        @keyframes aiGlowPulse {
          0%, 100% {
            text-shadow: 0 0 4px rgba(124, 92, 252, 0.4);
            filter: drop-shadow(0 0 2px rgba(124, 92, 252, 0.3));
          }
          50% {
            text-shadow: 0 0 12px rgba(124, 92, 252, 0.8), 0 0 20px rgba(124, 92, 252, 0.4);
            filter: drop-shadow(0 0 12px rgba(124, 92, 252, 0.66));
          }
        }
        .animate-dot-bounce {
          animation: dotBounce 1.2s infinite ease-in-out;
        }
        .animate-bridge-arch {
          stroke-dasharray: 100;
          animation: bridgeBuild 1.4s ease-out forwards;
        }
        .animate-ai-glow {
          animation: aiGlowPulse 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Official SkillBridge AI Logo: Bridge icon (arch + dot top + 2 pillars) #7C5CFC 42x42px bg white/5 p-1.5 rounded 10px */}
      <div 
        className="relative shrink-0 flex items-center justify-center bg-white/5 p-1.5 rounded-[10px] border border-white/5"
        style={{ width: iconSize, height: iconSize }}
      >
        {!imgError ? (
          <img 
            src="/mnt/data/skillbridge_ai_logo.webp" 
            alt="SkillBridge AI" 
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(124,92,252,0.5)]"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg 
            width={iconSize - 10} 
            height={iconSize - 10} 
            viewBox="0 0 44 44" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0 overflow-visible"
          >
            {/* Subtle Ambient Glow */}
            <circle cx="22" cy="22" r="18" fill="#7C5CFC" fillOpacity="0.1" />

            {/* Left Pillar */}
            <rect 
              x="11" 
              y="20" 
              width="4" 
              height="16" 
              rx="2" 
              fill="#7C5CFC" 
              fillOpacity="0.95"
            />

            {/* Right Pillar */}
            <rect 
              x="29" 
              y="20" 
              width="4" 
              height="16" 
              rx="2" 
              fill="#7C5CFC" 
              fillOpacity="0.95"
            />

            {/* Bridge Arch with stroke dasharray draw */}
            <path 
              d="M 11 22 C 11 12, 33 12, 33 22" 
              stroke="#7C5CFC" 
              strokeWidth="3.5" 
              strokeLinecap="round"
              fill="none"
              className="animate-bridge-arch"
            />

            {/* Horizontal Bridge Deck Platform */}
            <rect 
              x="7" 
              y="19" 
              width="30" 
              height="3.5" 
              rx="1.75" 
              fill="#7C5CFC" 
            />

            {/* Golden/Purple Glowing Dot bouncing on top of bridge */}
            <circle 
              cx="22" 
              cy="9" 
              r="4.5" 
              fill="#7C5CFC" 
              className="animate-dot-bounce origin-center"
            />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[16px] font-bold font-sans leading-tight ${lightBg ? "text-[#0F172A]" : "text-white"}`}>
              SkillBridge
            </span>
            <span className="text-[16px] text-[#7C5CFC] font-black leading-tight animate-ai-glow">
              AI
            </span>
            <span className={`text-[16px] font-bold font-sans leading-tight ${lightBg ? "text-[#0F172A]" : "text-white"}`}>
              Portal
            </span>
          </div>

          {subtitle && (
            <div className="mt-1 max-w-[180px] leading-[1.3] truncate whitespace-normal">
              <span className="text-[11px] font-semibold text-white/60 tracking-[0.2px]">Empowering Talent,</span>
              <br />
              <span className="text-[11px] font-semibold text-white/50 tracking-[0.2px]">Bridging Academia & Industry</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
