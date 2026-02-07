
import React from 'react';
import { CameraSource, AudioChannel, ScoreboardState, ConsoleState } from '../../types';
import SwitcherPanel from './SwitcherPanel';
import MixerStrip from './MixerStrip';
import PerformanceDeck from './PerformanceDeck';
import { Radio, Save, ShieldAlert, Power, Activity, Volume2, ShieldCheck, Globe, Lock, Cpu } from 'lucide-react';
import { csl } from '../../services/ControlSurfaceEngine';
import { ARStudioLogo } from '../Branding/ARStudioLogo';

interface Props {
  cameras: CameraSource[];
  audioChannels: AudioChannel[];
  scoreboard: ScoreboardState;
  consoleState: ConsoleState;
}

const MasterDesk: React.FC<Props> = ({ cameras, audioChannels, scoreboard, consoleState }) => {
  return (
    <div className="h-full bg-black flex flex-col border-t border-zinc-800 shadow-[0_-30px_60px_rgba(0,0,0,0.9)] z-50">
      
      {/* --- CONSOLE HEADER (AR CONTROL LIVE STUDIO) --- */}
      <div className="h-14 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 backdrop-blur-2xl">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 group cursor-help transition-transform hover:scale-105">
             <ARStudioLogo size={36} />
             <div className="flex flex-col">
                <h2 className="text-sm font-black text-white uppercase italic tracking-[0.25em] leading-tight select-none">
                  AR CONTROL <span className="text-cyan-500">LIVE STUDIO</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">PRO BROADCAST OS v7.0</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                </div>
             </div>
          </div>
          
          <div className="h-8 w-px bg-zinc-800/60"></div>

          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-600 uppercase mb-0.5 tracking-tighter">Production Stream</span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-500 font-black">
                 <Activity className="w-4 h-4" />
                 6.2 <span className="text-[9px] text-zinc-700">Mbps</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-600 uppercase mb-0.5 tracking-tighter">Audio DSP Guard</span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-green-500 font-black">
                 <ShieldCheck className="w-4 h-4" />
                 SAFE <span className="text-[9px] text-zinc-700">LMT-ON</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-zinc-600 uppercase mb-0.5 tracking-tighter">AI Compute</span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-purple-500 font-black">
                 <Cpu className="w-4 h-4" />
                 ACTIVE
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="flex flex-col items-end opacity-40 hover:opacity-100 transition-all cursor-default">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">ChrisRey91</span>
              <span className="text-[8px] font-bold text-zinc-700 tracking-widest">WWW.ARCONTROLINTELIGENTE.COM</span>
           </div>
           
           <div className="flex items-center gap-3">
              <button 
                onClick={() => csl.emit('SYSTEM_PANIC', null, 'P0')}
                className="group flex items-center gap-2 px-6 py-2 bg-red-950/20 text-red-500 border border-red-900/40 rounded-full text-[11px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-[0_0_30px_rgba(220,38,38,0.1)] active:scale-90"
              >
                  <ShieldAlert className="w-4 h-4 group-hover:animate-bounce" />
                  Panic Safe
              </button>
              <button className="p-2.5 bg-zinc-900 text-zinc-500 rounded-2xl border border-zinc-800 hover:text-white hover:border-zinc-500 transition-all shadow-xl active:bg-zinc-800">
                <Power className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>

      {/* --- MAIN CONTROL SURFACE --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ZONA 1: PERFORMANCE (Left) */}
        <div className="w-80 border-r border-zinc-900 p-3 bg-zinc-950/30 backdrop-blur-lg">
           <PerformanceDeck scoreboard={scoreboard} />
        </div>

        {/* ZONA 2: AUDIO MIXER (Center) */}
        <div className="flex-1 flex flex-col bg-black/50">
           <div className="h-9 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-5">
              <span className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2 tracking-widest">
                <Volume2 className="w-4 h-4 text-purple-500" /> Multi-Bus Digital Matrix
              </span>
              <div className="flex items-center gap-5">
                 <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-cyan-600" />
                    <span className="text-[9px] font-black text-cyan-700 uppercase tracking-tighter">Master Limiter: -1.0 dBFS</span>
                 </div>
                 <span className="text-[10px] font-black text-zinc-500 uppercase">PGM Gain: <span className="text-zinc-300 ml-1">{consoleState.masterVolume}%</span></span>
              </div>
           </div>
           <div className="flex-1 flex overflow-x-auto no-scrollbar custom-scrollbar">
              {audioChannels.map(ch => (
                <MixerStrip key={ch.id} channel={ch} />
              ))}
              
              {/* PGM Master Out Strip */}
              <div className="w-32 bg-zinc-950 border-l border-zinc-900 flex flex-col items-center py-3 shrink-0 shadow-2xl">
                 <span className="text-[10px] font-black text-cyan-500 uppercase mb-5 tracking-[0.25em] select-none">PGM Out</span>
                 <div className="flex gap-2.5 h-40 mb-5 bg-zinc-900/60 p-2.5 rounded-xl border border-white/5 shadow-inner">
                    <div className="w-3 h-full bg-black rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800">
                       <div className="h-[68%] w-full bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_15px_#06b6d4]" />
                    </div>
                    <div className="w-3 h-full bg-black rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800">
                       <div className="h-[71%] w-full bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_15px_#06b6d4]" />
                    </div>
                 </div>
                 <div className="flex-1 w-full flex flex-col items-center relative py-2 px-8">
                    <div className="absolute inset-y-2 w-1.5 bg-zinc-900 rounded-full shadow-inner border border-white/5"></div>
                    <div className="w-full h-10 bg-gradient-to-b from-zinc-100 to-zinc-400 rounded-lg shadow-2xl border-x border-zinc-500 z-10 absolute bottom-[70%] flex items-center justify-center cursor-ns-resize group">
                       <div className="h-px w-full bg-zinc-600 shadow-sm"></div>
                       <div className="absolute -top-6 bg-cyan-900/40 text-cyan-400 text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">0.0dB</div>
                    </div>
                 </div>
                 <div className="mt-5 px-5 w-full">
                    <button className="w-full py-2.5 bg-zinc-900 text-zinc-500 rounded-xl hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800 flex items-center justify-center gap-2.5 shadow-lg active:scale-95">
                      <Globe className="w-4 h-4 text-cyan-600" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Network Monitor</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* ZONA 3: VIDEO SWITCHER (Right) */}
        <div className="w-96 border-l border-zinc-900 p-3 bg-zinc-950/30 backdrop-blur-lg">
           <SwitcherPanel 
            cameras={cameras} 
            programId={consoleState.programId} 
            previewId={consoleState.previewId} 
           />
           
           <div className="mt-4 grid grid-cols-1 gap-2.5 px-1">
              <button 
                onClick={() => csl.emit('VIDEO_LOAD_SCENE', 'SAFE_LOGO')}
                className={`group flex items-center justify-between p-4 rounded-[2rem] border transition-all active:scale-[0.97] ${consoleState.isStreaming ? 'bg-red-600 border-red-400 shadow-[0_0_40px_rgba(220,38,38,0.4)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'}`}
              >
                 <div className="flex items-center gap-5">
                    <div className={`p-2.5 rounded-2xl ${consoleState.isStreaming ? 'bg-white/25 shadow-inner' : 'bg-zinc-800 border border-white/5'}`}>
                      <Radio className={`w-6 h-6 ${consoleState.isStreaming ? 'text-white' : 'text-zinc-600'}`} />
                    </div>
                    <div className="text-left">
                       <div className={`text-[12px] font-black uppercase tracking-[0.15em] ${consoleState.isStreaming ? 'text-white' : 'text-zinc-400'}`}>TX On-Air</div>
                       <div className="text-[9px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase">Status: {consoleState.isStreaming ? 'TRANSMITTING' : 'READY'}</div>
                    </div>
                 </div>
                 {consoleState.isStreaming && <div className="w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></div>}
              </button>
              
              <button 
                className={`flex items-center justify-between p-4 rounded-[2rem] border border-zinc-800 transition-all active:scale-[0.97] ${consoleState.isRecording ? 'bg-zinc-50 border-white text-black shadow-2xl' : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-600'}`}
              >
                 <div className="flex items-center gap-5">
                    <div className={`p-2.5 rounded-2xl ${consoleState.isRecording ? 'bg-black/10' : 'bg-zinc-800 border border-white/5'}`}>
                      <Save className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                       <div className="text-[12px] font-black uppercase tracking-[0.15em]">ISO Master Record</div>
                       <div className="text-[9px] font-mono opacity-60 uppercase">Codec: HEVC 10-bit • {consoleState.isRecording ? 'RECORDING' : 'IDLE'}</div>
                    </div>
                 </div>
              </button>
           </div>
        </div>
      </div>
      
      {/* Branding Footer Persistente */}
      <div className="h-7 bg-black flex items-center justify-between px-6 border-t border-white/5 shadow-2xl">
         <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] select-none">AR CONTROL LIVE STUDIO | MISSION CRITICAL BROADCAST ENVIRONMENT</span>
         <div className="flex items-center gap-6">
            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">HW Acceleration: ON</span>
            <span className="text-[9px] font-bold text-zinc-800 italic">Desarrollado por ChrisRey91 - arcontrolinteligente.com</span>
         </div>
      </div>
    </div>
  );
};

export default MasterDesk;
