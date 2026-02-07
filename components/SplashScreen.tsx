
import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, Wifi, ExternalLink, Globe } from 'lucide-react';
import { ARStudioLogo } from './Branding/ARStudioLogo';

export const SplashScreen: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const steps = [
        "Iniciando Núcleo ARCLS v7.0...",
        "Hardening Audio DSP (Master Limiter P0)...",
        "Sincronizando Motores de Video ATEM...",
        "Validando Gemini AI Copilot...",
        "Sistema Broadcast Listo."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => {
                if (prev < steps.length - 1) return prev + 1;
                clearInterval(interval);
                setTimeout(onComplete, 1600);
                return prev;
            });
        }, 750);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen bg-black flex flex-col items-center justify-center font-sans overflow-hidden">
            <div className="relative group mb-10">
                <div className="absolute inset-0 bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <ARStudioLogo size={200} className="relative z-10 scale-110" />
            </div>

            <div className="text-center mb-10">
                <h1 className="text-5xl font-black italic tracking-tighter text-white">
                    AR CONTROL <span className="text-cyan-500">LIVE STUDIO</span>
                </h1>
                <div className="flex items-center justify-center gap-3 mt-3">
                    <div className="h-px w-10 bg-zinc-800"></div>
                    <p className="text-zinc-500 text-[11px] tracking-[0.7em] uppercase font-black">
                        Professional Broadcast OS
                    </p>
                    <div className="h-px w-10 bg-zinc-800"></div>
                </div>
            </div>
            
            <div className="w-80 space-y-6">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-cyan-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
                        {steps[step]}
                    </span>
                    <span className="text-zinc-600 font-mono">{Math.round(((step + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="h-1 bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-400 transition-all duration-700 shadow-[0_0_20px_rgba(6,182,212,0.7)]" 
                      style={{width: `${((step + 1) / steps.length) * 100}%`}}
                    ></div>
                </div>
                
                <div className="flex flex-col items-center gap-5 mt-16 pt-10 border-t border-white/5">
                    <div className="flex gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                        <Wifi className="w-5 h-5 text-white" />
                        <Cpu className="w-5 h-5 text-white" />
                        <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col items-center group">
                        <span className="text-[12px] font-black text-zinc-500 uppercase tracking-tighter">
                          Desarrollado por <span className="text-white group-hover:text-cyan-400 transition-colors">ChrisRey91</span>
                        </span>
                        <a 
                          href="https://www.arcontrolinteligente.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-cyan-700 tracking-widest hover:text-cyan-400 transition-all flex items-center gap-1.5 mt-1.5"
                        >
                          WWW.ARCONTROLINTELIGENTE.COM <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
