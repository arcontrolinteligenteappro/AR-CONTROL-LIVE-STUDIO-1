import React from 'react';
import { Mic, MicOff, Volume2, Lock, Unlock } from 'lucide-react';
import { AudioChannel, CameraSource, StreamRole } from '../types';

interface AudioMixerProps {
  channels: AudioChannel[];
  sources: CameraSource[];
  onVolumeChange: (id: string, val: number) => void;
  onToggleMute: (id: string) => void;
  onToggleLock: (id: string) => void;
}

const AudioMixer: React.FC<AudioMixerProps> = ({ channels, sources, onVolumeChange, onToggleMute, onToggleLock }) => {
  return (
    <div className="bg-zinc-950 border-t border-zinc-800 p-4 shrink-0">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Audio Matrix
            </h3>
            <span className="text-[10px] text-zinc-600 font-mono">48kHz / 24-bit PCM</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {channels.map(ch => {
                const source = sources.find(s => s.id === ch.id);
                // Don't show mixer controls for video-only sources
                if (!source || source.role === StreamRole.VIDEO_ONLY) return null;

                return (
                    <div key={ch.id} className="bg-zinc-900 p-2 rounded border border-zinc-800 flex flex-col gap-2 group hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-zinc-300 truncate max-w-[80px]" title={source.name}>
                                {source.name}
                            </span>
                            <button 
                                onClick={() => onToggleLock(ch.id)}
                                className={`text-zinc-600 hover:text-zinc-400 ${ch.isLocked ? 'text-blue-500' : ''}`}
                            >
                                {ch.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                            </button>
                        </div>
                        
                        {/* VU Meter */}
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div 
                                className={`h-full transition-all duration-75 ease-out ${
                                    ch.isMuted ? 'bg-zinc-700' : (ch.meterLevel > 90 ? 'bg-red-500' : 'bg-green-500')
                                }`}
                                style={{ width: `${ch.isMuted ? 0 : ch.meterLevel}%` }}
                             />
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => !ch.isLocked && onToggleMute(ch.id)}
                                disabled={ch.isLocked}
                                className={`p-1.5 rounded transition-colors ${
                                    ch.isMuted 
                                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                } ${ch.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {ch.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                            </button>
                            
                            <div className="relative w-full h-6 flex items-center">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={ch.volume}
                                    disabled={ch.isLocked}
                                    onChange={(e) => onVolumeChange(ch.id, parseInt(e.target.value))}
                                    className={`w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full ${ch.isLocked ? '[&::-webkit-slider-thumb]:bg-zinc-600' : '[&::-webkit-slider-thumb]:bg-blue-500 hover:[&::-webkit-slider-thumb]:bg-blue-400'}`}
                                />
                                <span className="absolute -top-3 right-0 text-[9px] font-mono text-zinc-500">
                                    {ch.isMuted ? 'MUTE' : `${ch.volume}dB`}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default AudioMixer;