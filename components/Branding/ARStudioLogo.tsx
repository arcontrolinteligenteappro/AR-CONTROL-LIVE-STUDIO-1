
import React from 'react';

export const ARStudioLogo: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center bg-black rounded-3xl overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.15)] ${className}`} style={{ width: size, height: size }}>
      {/* 1. Neon Circuit Board Trace Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Circuit traces */}
        <path d="M5 20 H25 V40 H45" fill="none" stroke="url(#neonGrad)" strokeWidth="0.5" className="animate-pulse" />
        <path d="M95 80 H75 V60 H55" fill="none" stroke="#a855f7" strokeWidth="0.5" />
        <path d="M10 80 L30 60 H50" fill="none" stroke="#06b6d4" strokeWidth="0.3" opacity="0.4" />
        <circle cx="5" cy="20" r="1.2" fill="#06b6d4" />
        <circle cx="95" cy="80" r="1.2" fill="#a855f7" />
      </svg>

      {/* 2. Central Stylized Monogram 'AR' */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-baseline font-black italic tracking-tighter leading-none select-none" style={{ fontSize: size * 0.45 }}>
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">A</span>
          <span className="text-white relative">
            R
            {/* 3. Minimalist Hacker Silhouette with Laptop integrated into the 'R' loop/leg area */}
            <div className="absolute -bottom-1 -right-2 opacity-30 group-hover:opacity-70 transition-opacity">
              <svg width={size * 0.18} height={size * 0.18} viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.5">
                <path d="M12 4c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" opacity="0.2" fill="#06b6d4" />
                <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="white" />
                <rect x="7" y="14" width="10" height="6" rx="1" stroke="white" />
                <path d="M10 17h4" stroke="white" />
              </svg>
            </div>
          </span>
        </div>

        {/* 4. Integrated Icons Row (CCTV, Play, Mic) */}
        <div className="flex gap-2.5 mt-2 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-2xl">
          {/* CCTV Camera */}
          <svg width={size*0.08} height={size*0.08} viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" className="drop-shadow-[0_0_5px_#06b6d4]">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          {/* Play Button with Signal Waves */}
          <div className="relative">
            <svg width={size*0.08} height={size*0.08} viewBox="0 0 24 24" fill="white" className="drop-shadow-[0_0_5px_white]">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
          </div>
          {/* Professional Mic */}
          <svg width={size*0.08} height={size*0.08} viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" className="drop-shadow-[0_0_5px_#a855f7]">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
        </div>
      </div>

      {/* Decorative Scanner Effect Line */}
      <div className="absolute inset-x-0 h-[2px] bg-cyan-500/20 top-0 animate-[logo-scan_4s_linear_infinite] shadow-[0_0_15px_#06b6d4] z-20"></div>
      
      <style>{`
        @keyframes logo-scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
