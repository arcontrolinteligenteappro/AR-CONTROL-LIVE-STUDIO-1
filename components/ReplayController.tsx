
import React from 'react';
import { Rewind, Database, Play, Trash2, Clock, Film } from 'lucide-react';
import { ReplayClip, VideoEngineStats } from '../types';

interface ReplayControllerProps {
    stats: VideoEngineStats;
    clips: ReplayClip[];
    onTriggerReplay: (duration: number) => void;
    onPlayClip: (clip: ReplayClip) => void;
    onDeleteClip: (id: string) => void;
    onStopReplay: () => void;
}

const ReplayController: React.FC<ReplayControllerProps> = ({ stats, clips, onTriggerReplay, onPlayClip, onDeleteClip, onStopReplay }) => {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col h-full max-h-[400px]">
             <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2 shrink-0">
                <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                    <Rewind className="w-3.5 h-3.5 text-red-500" /> Instant Replay
                </h3>
                <div className="flex items-center gap-1">
                    <Database className="w-3 h-3 text-zinc-600" />
                    <span className="text-[9px] font-mono text-zinc-500">{stats.replayBufferUsage.toFixed(0)}% Buffer</span>
                </div>
            </div>

            {/* Buffer Visual */}
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-3 shrink-0">
                <div 
                    className="h-full bg-blue-600" 
                    style={{ width: `${stats.replayBufferUsage}%` }}
                />
            </div>

            {/* Live Controls */}
            <div className="mb-4 shrink-0">
                {stats.isReplaying ? (
                    <button 
                        onClick={onStopReplay}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded text-[10px] font-bold uppercase animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                        STOP REPLAY (LIVE)
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onTriggerReplay(5)}
                            className="flex-1 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-300 py-3 rounded text-[10px] font-bold uppercase border border-zinc-700 transition-colors"
                        >
                            Quick 5s
                        </button>
                        <button 
                            onClick={() => onTriggerReplay(10)}
                            className="flex-1 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-300 py-3 rounded text-[10px] font-bold uppercase border border-zinc-700 transition-colors"
                        >
                            Long 10s
                        </button>
                    </div>
                )}
            </div>

            {/* Highlights Reel */}
            <div className="flex-1 flex flex-col min-h-0">
                <h4 className="text-[9px] font-bold text-zinc-500 uppercase mb-2 flex items-center gap-1">
                    <Film className="w-3 h-3" /> Highlights Reel
                </h4>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1 bg-black/20 rounded p-1">
                    {clips.length === 0 && (
                        <div className="text-center py-4 text-[9px] text-zinc-600 italic">
                            Sin clips guardados.
                        </div>
                    )}
                    {clips.map(clip => (
                        <div key={clip.id} className="flex gap-2 bg-zinc-950 p-1.5 rounded border border-zinc-800 group hover:border-zinc-600 transition-colors">
                            <div className="relative w-16 h-10 shrink-0">
                                <img src={clip.thumbnailUrl} className="w-full h-full object-cover rounded opacity-70 group-hover:opacity-100" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button onClick={() => onPlayClip(clip)} className="bg-black/60 p-1 rounded-full text-white hover:bg-blue-600 transition-colors">
                                        <Play className="w-3 h-3 fill-current" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white truncate">{clip.label}</span>
                                    <span className="text-[8px] text-zinc-500 font-mono">{clip.gameTime}</span>
                                </div>
                                <div className="flex justify-between items-center mt-0.5">
                                    <div className="flex items-center gap-1 text-[8px] text-zinc-500">
                                        <Clock className="w-2 h-2" /> {clip.duration}s
                                    </div>
                                    <button onClick={() => onDeleteClip(clip.id)} className="text-zinc-600 hover:text-red-500">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReplayController;
