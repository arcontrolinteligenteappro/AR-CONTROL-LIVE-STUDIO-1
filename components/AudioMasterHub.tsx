
import React, { useState } from 'react';
import { Mic, MicOff, Lock, Unlock, Link2, Link2Off, SlidersHorizontal, Clock, VolumeX, Zap } from 'lucide-react';
import { AudioChannel, AudioMasterState } from '../types';

interface AudioMasterHubProps {
  channels: AudioChannel[];
  masterState: AudioMasterState;
  onUpdateChannel: (id: string, updates: Partial<AudioChannel>) => void;
  onUpdateMaster: (updates: Partial<AudioMasterState>) => void;
  compact?: boolean;
}

export const AudioMasterHub: React.FC<AudioMasterHubProps> = ({ channels, masterState, onUpdateChannel, onUpdateMaster, compact = false }) => {
  const [viewMode, setViewMode] = useState<'FADER' | 'DSP'>('FADER');

  if (!masterState) return null;

  if (compact) {
      return (
          <div className="bg-zinc-950 rounded border border-zinc-800 p-2 flex flex-col items-center justify-center h-full w-full">
              <span className="text-[9px] font-bold text-zinc-500 uppercase mb-1">PGM Mix</span>
              <div className="flex gap-1.5 h-full max-h-32">
                    <div className="w-2.5 bg-zinc-900 rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800">
                        <div className={`w-full transition-all duration-75 ${masterState.masterMeterL > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${masterState.masterMeterL}%` }} />
                    </div>
                    <div className="w-2.5 bg-zinc-900 rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800">
                        <div className={`w-full transition-all duration-75 ${masterState.masterMeterR > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${masterState.masterMeterR}%` }} />
                    </div>
              </div>
              <button 
                onClick={() => onUpdateMaster({ globalLock: !masterState.globalLock })}
                className={`mt-2 p-1.5 rounded-full transition-all ${masterState.globalLock ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-600'}`}
                title="Audio Master Lock"
              >
                  <Lock className="w-3.5 h-3.5" />
              </button>
          </div>
      )
  }

  return (
    <div className="bg-zinc-950 flex flex-col h-full w-full border-t border-zinc-800">
        {/* Top Header Controls */}
        <div className="h-12 shrink-0 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-black text-white uppercase tracking-tighter">ARCLS Audio Matrix 8.0</span>
                <div className="flex bg-black/40 rounded p-1 ml-4 border border-white/5">
                    <button 
                        onClick={() => setViewMode('FADER')}
                        className={`px-4 py-1 text-[10px] font-black rounded transition-all ${viewMode === 'FADER' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        MIXER
                    </button>
                    <button 
                        onClick={() => setViewMode('DSP')}
                        className={`px-4 py-1 text-[10px] font-black rounded transition-all ${viewMode === 'DSP' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        DSP / EQ
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Global Ducking Indicator */}
                <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-[9px] font-bold text-zinc-400">DUCKING: AUTO</span>
                </div>

                <button 
                    onClick={() => onUpdateMaster({ globalLock: !masterState.globalLock })}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase px-5 py-1.5 rounded-full border transition-all ${masterState.globalLock ? 'bg-red-600 text-white border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse' : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'}`}
                >
                    {masterState.globalLock ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    {masterState.globalLock ? 'Mic Master Lock' : 'Unlock Mics'}
                </button>
            </div>
        </div>

        {/* Scrollable Mixer Strip */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-2 flex gap-1.5 custom-scrollbar bg-zinc-950/20">
            
            {channels.map(ch => (
                <div key={ch.id} className={`w-32 bg-zinc-900/60 rounded-lg border transition-all flex flex-col group ${ch.isLocked || masterState.globalLock ? 'border-red-900/30' : (ch.afvEnabled ? 'border-orange-900/30' : 'border-zinc-800 hover:border-zinc-700')}`}>
                    
                    {/* Header: Name & Locks */}
                    <div className="h-10 p-2 flex justify-between items-center border-b border-zinc-800 bg-black/20 rounded-t-lg">
                        <span className="text-[10px] font-black text-zinc-300 truncate uppercase tracking-tighter" title={ch.name}>
                            {ch.name}
                        </span>
                        <button 
                            onClick={() => onUpdateChannel(ch.id, { isLocked: !ch.isLocked })}
                            className={`transition-colors ${ch.isLocked ? 'text-red-500' : 'text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100'}`}
                        >
                            {ch.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-between p-2 h-full overflow-hidden relative">
                        
                        {viewMode === 'FADER' ? (
                            <>
                                {/* AFV Toggle */}
                                <button 
                                    onClick={() => onUpdateChannel(ch.id, { afvEnabled: !ch.afvEnabled })}
                                    className={`w-full py-1.5 rounded-md border flex items-center justify-center gap-1.5 text-[9px] font-black transition-all ${
                                        ch.afvEnabled 
                                        ? 'bg-orange-600/10 text-orange-500 border-orange-500/40 shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]' 
                                        : 'bg-zinc-800/40 text-zinc-600 border-zinc-700 hover:border-zinc-600'
                                    }`}
                                >
                                    {ch.afvEnabled ? <Link2 className="w-3 h-3" /> : <Link2Off className="w-3 h-3" />} AFV
                                </button>

                                <div className="flex-1 w-full flex items-center justify-center gap-2.5 py-3 relative">
                                    {/* dB Scale */}
                                    <div className="h-full flex flex-col justify-between text-[7px] font-mono text-zinc-600 items-end py-1">
                                        <span>+12</span><span>0</span><span>-12</span><span>-40</span><span>-∞</span>
                                    </div>

                                    {/* Vertical Meter */}
                                    <div className="h-full w-2.5 bg-zinc-950 rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800">
                                        <div 
                                            className={`w-full transition-all duration-75 ${ch.meterLevel > 90 ? 'bg-red-500 shadow-[0_0_5px_red]' : (ch.meterLevel > 70 ? 'bg-yellow-500' : 'bg-green-500')}`}
                                            style={{ height: `${ch.isMuted ? 0 : ch.meterLevel}%` }}
                                        />
                                    </div>
                                    
                                    {/* Professional Fader */}
                                    <div className="h-full relative w-10 flex justify-center group/fader">
                                        <div className="absolute top-[25%] w-full h-px bg-white/5 pointer-events-none z-0"></div>
                                        <input 
                                            type="range" 
                                            {...({ orient: "vertical" } as any)}
                                            min="0" max="100" value={ch.volume}
                                            disabled={masterState.globalLock || ch.isLocked}
                                            onChange={(e) => onUpdateChannel(ch.id, { volume: parseInt(e.target.value) })}
                                            className="h-full w-4 bg-transparent appearance-none cursor-pointer [writing-mode:bt-lr] [-webkit-appearance:slider-vertical] accent-blue-600 z-10 hover:accent-blue-400"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* DSP / EQ VIEW */
                            <div className="w-full flex-1 flex flex-col gap-2 pt-2 animate-in fade-in duration-300">
                                <div className="space-y-3">
                                    {['HIGH', 'MID', 'LOW'].map((label, idx) => (
                                        <div key={label} className="space-y-1">
                                            <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase">
                                                <span>{label}</span>
                                                <span className="text-zinc-400">0dB</span>
                                            </div>
                                            <input type="range" className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-500" />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto bg-black/40 p-2 rounded border border-white/5">
                                    <span className="text-[9px] font-bold text-zinc-500 block mb-1 uppercase">A/V Sync</span>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-zinc-600" />
                                        <span className="text-[10px] font-mono text-blue-400">{ch.delayMs}ms</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Channel Mute */}
                        <button 
                            onClick={() => !masterState.globalLock && !ch.isLocked && onUpdateChannel(ch.id, { isMuted: !ch.isMuted })}
                            className={`w-full py-2.5 mt-2 rounded-lg flex items-center justify-center transition-all ${ch.isMuted ? 'bg-red-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300'}`}
                        >
                            {ch.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            ))}

            {/* Master PGM Section (Right Sticky) */}
            <div className="w-24 bg-zinc-950 rounded-lg border border-blue-900/30 flex flex-col ml-2 h-full shrink-0 shadow-2xl relative">
                 <div className="h-10 flex items-center justify-center border-b border-zinc-800 bg-blue-950/20">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">PGM Out</span>
                 </div>
                 <div className="flex-1 flex flex-col p-3 gap-3 items-center justify-center">
                    <div className="flex gap-1.5 h-full relative">
                         <div className="absolute top-[25%] w-full h-px bg-white/10 pointer-events-none z-10"></div>
                         {[1, 2].map(i => (
                            <div key={i} className="w-3 bg-zinc-900 rounded-full overflow-hidden flex flex-col justify-end border border-zinc-800">
                                <div className={`w-full transition-all duration-75 ${masterState.masterMeterL > 90 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-blue-600'}`} style={{ height: `${i===1?masterState.masterMeterL:masterState.masterMeterR}%` }} />
                            </div>
                         ))}
                    </div>
                 </div>
                 <button 
                    onClick={() => onUpdateMaster({ isMasterMuted: !masterState.isMasterMuted })}
                    className={`w-full h-12 flex flex-col items-center justify-center transition-all ${masterState.isMasterMuted ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-600 hover:bg-red-950 hover:text-red-500'}`}
                 >
                     <VolumeX className="w-5 h-5" />
                     <span className="text-[7px] font-black uppercase mt-1">Panic</span>
                 </button>
            </div>
        </div>
    </div>
  );
};
